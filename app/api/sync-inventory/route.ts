// app/api/sync-inventory/route.ts
//
// Drive-as-source-of-truth sync for Lot Linkup inventory.
//
// Folder structure expected in Drive:
//   Lot Link Up Properties/
//     Active/
//       <Property Folder>/
//         property-info.md
//         Images/
//           hero.jpg (or any image; auto-pick if no hero* prefix)
//           gallery-01.jpg
//           ...
//     Sold/
//     Pending/  (optional)
//
// Triggers:
//   POST /api/sync-inventory
//   Header: x-sync-secret: <SYNC_SECRET>
//
// What it does:
//   1. Walks Active/, Sold/, Pending/ folders in Drive
//   2. For each property folder: parses property-info.md, mirrors images
//      to Supabase Storage, upserts a row in `inventory`
//   3. Sets published/status based on which top-level folder the property is in
//   4. For inventory rows whose drive_folder no longer appears anywhere:
//      sets published=false (soft-archive)
//   5. Returns JSON report

import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { google, drive_v3 } from 'googleapis';
import crypto from 'crypto';

// ---------- env ----------
const {
  SYNC_SECRET,
  GOOGLE_SERVICE_ACCOUNT_JSON,
  DRIVE_ROOT_FOLDER_ID,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET = 'listings',
} = process.env as Record<string, string>;

// ---------- types ----------
type FolderState = 'Active' | 'Sold' | 'Pending';

type ParsedProperty = {
  // basics
  state?: string;
  state_code?: string;
  county?: string;
  city?: string;
  acreage?: number;
  apn?: string;
  google_maps_url?: string;
  // pricing
  cash_price?: number;
  asking_price?: number;
  financing_available?: boolean;
  down_payment?: number;
  monthly_payment?: number;
  term_months?: number;
  interest_rate?: number;
  // details
  zoning?: string;
  road_access?: string;
  utilities?: string;
  notable?: string;
  // acquisition (internal)
  buy_price?: number;
  // listing details (filled at publish)
  topography?: string;
  nearest_recreation?: string;
  nearest_town?: string;
  best_use_cases?: string;
  description?: string;
  lead_hook?: string;
};

// ---------- handler ----------
export async function POST(req: Request) {
  if (req.headers.get('x-sync-secret') !== SYNC_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const drive = await getDriveClient();
  const supa = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const report = {
    created: 0,
    updated: 0,
    archived: 0,
    errors: [] as { folder: string; error: string }[],
    seen_folder_ids: [] as string[],
  };

  // 1. Find Active/Sold/Pending folders under root
  const stateFolders = await listChildFolders(drive, DRIVE_ROOT_FOLDER_ID);
  const stateMap = new Map<string, FolderState>();
  for (const f of stateFolders) {
    if (f.name === 'Active' || f.name === 'Sold' || f.name === 'Pending') {
      stateMap.set(f.id!, f.name as FolderState);
    }
  }

  // 2. Walk each state folder and process its properties
  for (const [stateFolderId, stateName] of Array.from(stateMap.entries())) {
    const propertyFolders = await listChildFolders(drive, stateFolderId);
    for (const pf of propertyFolders) {
      try {
        await syncPropertyFolder(drive, supa, pf, stateName, report);
        report.seen_folder_ids.push(pf.id!);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        report.errors.push({ folder: pf.name || pf.id!, error: message });
      }
    }
  }

  // 3. Soft-archive: anything in DB whose drive_folder isn't in seen_folder_ids
  const { data: orphans } = await supa
    .from('inventory')
    .select('id, drive_folder')
    .not('drive_folder', 'is', null)
    .eq('published', true);
  for (const row of orphans || []) {
    if (!report.seen_folder_ids.includes(row.drive_folder)) {
      await supa.from('inventory').update({ published: false }).eq('id', row.id);
      report.archived++;
    }
  }

  return NextResponse.json(report);
}

// ---------- maps URL → coordinates ----------
// Resolves a Google Maps URL (including maps.app.goo.gl shortlinks) and
// extracts lat/lng. Returns null on any failure rather than throwing — the
// sync should still upsert the row even when geocoding misses.
async function extractCoordsFromMapsUrl(
  url: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const finalUrl = response.url;

    // 1. /maps/...@lat,lng,zoom — most common after a maps.app.goo.gl
    //    shortlink resolves to a /maps/place URL
    let m = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 2. ?q=lat,lng or &q=lat,lng — legacy maps query API
    m = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 3. ?query=lat,lng — newer maps query API
    m = finalUrl.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 4. !3d<lat>!4d<lng> — embedded in the /maps data parameter,
    //    sometimes the only place coords appear when the URL points
    //    at a labeled place rather than raw coordinates
    m = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    return null;
  } catch {
    return null;
  }
}

// ---------- per-property sync ----------
async function syncPropertyFolder(
  drive: drive_v3.Drive,
  supa: SupabaseClient,
  pf: drive_v3.Schema$File,
  stateName: FolderState,
  report: { created: number; updated: number }
) {
  const folderId = pf.id!;
  const folderName = pf.name!;

  // 1. Read property-info.md
  const mdFile = await findChildByName(drive, folderId, 'property-info.md');
  if (!mdFile) throw new Error('property-info.md not found');
  const mdText = await downloadFileText(drive, mdFile.id!);
  const parsed = parsePropertyMd(mdText);

  // 2. Find Images/ subfolder and list images
  const imagesFolder = await findChildByName(drive, folderId, 'Images', true);
  const images = imagesFolder
    ? await listImageFiles(drive, imagesFolder.id!)
    : [];

  // 3. Mirror images to Supabase Storage; pick hero
  const slug = slugify(folderName);
  const mirrored: { name: string; url: string }[] = [];
  for (const img of images) {
    const url = await mirrorImage(drive, supa, img, slug);
    mirrored.push({ name: img.name!, url });
  }
  const heroUrl = pickHero(mirrored);
  const galleryUrls = mirrored
    .filter((m) => m.url !== heroUrl)
    .map((m) => m.url);

  // 4. Geocode the maps link, if present
  const coords = parsed.google_maps_url
    ? await extractCoordsFromMapsUrl(parsed.google_maps_url)
    : null;

  // 5. Build row
  const publishedFlags = stateToFlags(stateName);
  const row = {
    slug,
    drive_folder: folderId,
    state: parsed.state,
    state_code: parsed.state_code,
    county: parsed.county,
    city: parsed.city,
    acreage: parsed.acreage,
    apn: parsed.apn,
    google_maps_url: parsed.google_maps_url,
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
    cash_price: parsed.cash_price,
    asking_price: parsed.cash_price, // mirror unless explicitly different
    financing_available: parsed.financing_available ?? false,
    down_payment: parsed.down_payment,
    monthly_payment: parsed.monthly_payment,
    term_months: parsed.term_months,
    interest_rate: parsed.interest_rate,
    available_terms: buildAvailableTerms(parsed),
    zoning: parsed.zoning,
    road_access: parsed.road_access,
    utilities: parsed.utilities,
    topography: parsed.topography,
    nearest_recreation: parsed.nearest_recreation,
    nearest_town: parsed.nearest_town,
    best_use_cases: parsed.best_use_cases,
    description: parsed.description,
    lead_hook: parsed.lead_hook,
    buy_price: parsed.buy_price,
    main_image: heroUrl,
    gallery: galleryUrls,
    ...publishedFlags,
    date_listed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 6. Upsert. Try APN match first — CRM rows pre-exist with APNs but no slug.
  // Fall back to slug match for rows the sync itself created previously.
  let existing: { id: string } | null = null;
  if (parsed.apn) {
    const { data } = await supa
      .from('inventory')
      .select('id')
      .eq('apn', parsed.apn)
      .maybeSingle();
    existing = data;
  }
  if (!existing) {
    const { data } = await supa
      .from('inventory')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    existing = data;
  }

  if (existing) {
    await supa.from('inventory').update(row).eq('id', existing.id);
    report.updated++;
  } else {
    await supa.from('inventory').insert(row);
    report.created++;
  }
}

// ---------- folder state → flags ----------
function stateToFlags(state: FolderState): {
  published: boolean;
  status: string;
} {
  switch (state) {
    case 'Active':
      return { published: true, status: 'owned' };
    case 'Sold':
      return { published: false, status: 'sold' };
    case 'Pending':
      return { published: false, status: 'pending' };
  }
}

// ---------- markdown parser ----------
function parsePropertyMd(md: string): ParsedProperty {
  const lines = md.split(/\r?\n/);
  const fields: Record<string, string> = {};
  for (const raw of lines) {
    const m = raw.match(/^\s*-\s*([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (val === '' || val === 'TBD') continue;
    fields[key] = val;
  }

  const num = (k: string): number | undefined => {
    const v = fields[k];
    if (!v) return undefined;
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
    return Number.isFinite(n) ? n : undefined;
  };
  const bool = (k: string): boolean | undefined => {
    const v = fields[k]?.toLowerCase();
    if (v === 'yes' || v === 'true') return true;
    if (v === 'no' || v === 'false') return false;
    return undefined;
  };

  return {
    state: fields['state'],
    state_code: fields['state code']?.toUpperCase(),
    county: fields['county'],
    city: fields['city'],
    acreage: num('acres'),
    apn: fields['apn'],
    google_maps_url: fields['maps link'],
    cash_price: num('cash price'),
    financing_available: bool('owner financing'),
    down_payment: num('down payment'),
    monthly_payment: num('monthly payment'),
    term_months: num('term months'),
    interest_rate: num('interest rate'),
    zoning: fields['zoning'],
    road_access: fields['road access'],
    utilities: fields['utilities'],
    notable: fields['notable'],
    buy_price: num('purchase price'),
    topography: fields['terrain'],
    nearest_recreation: fields['nearest recreation'],
    nearest_town: fields['nearest town'],
    best_use_cases: fields['best use cases'],
    description: fields['description'],
    lead_hook: fields['lead hook'],
  };
}

function buildAvailableTerms(p: ParsedProperty): string | undefined {
  if (!p.financing_available) return undefined;
  const parts: string[] = [];
  if (p.down_payment) parts.push(`$${p.down_payment.toLocaleString()} down`);
  if (p.monthly_payment) parts.push(`$${p.monthly_payment}/mo`);
  if (p.term_months) parts.push(`${p.term_months} months`);
  if (p.interest_rate != null) parts.push(`${p.interest_rate}% APR`);
  return parts.join(' · ');
}

// ---------- hero picker ----------
function pickHero(images: { name: string; url: string }[]): string | undefined {
  if (images.length === 0) return undefined;
  const score = (n: string) => {
    const lower = n.toLowerCase();
    if (/^(00-)?hero/.test(lower)) return 100;
    if (/aerial|drone/.test(lower)) return 50;
    if (/wide|frontage|road/.test(lower)) return 30;
    return 0;
  };
  const sorted = [...images].sort(
    (a, b) => score(b.name) - score(a.name) || a.name.localeCompare(b.name)
  );
  return sorted[0].url;
}

// ---------- Drive helpers ----------
async function getDriveClient(): Promise<drive_v3.Drive> {
  const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return google.drive({ version: 'v3', auth });
}

async function listChildFolders(drive: drive_v3.Drive, parentId: string) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 1000,
  });
  return res.data.files || [];
}

async function findChildByName(
  drive: drive_v3.Drive,
  parentId: string,
  name: string,
  isFolder = false
) {
  const mime = isFolder
    ? `mimeType = 'application/vnd.google-apps.folder'`
    : `mimeType != 'application/vnd.google-apps.folder'`;
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${name.replace(/'/g, "\\'")}' and ${mime} and trashed = false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 1,
  });
  return res.data.files?.[0];
}

async function listImageFiles(drive: drive_v3.Drive, folderId: string) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
    fields: 'files(id, name, mimeType, md5Checksum)',
    pageSize: 1000,
  });
  return res.data.files || [];
}

async function downloadFileText(drive: drive_v3.Drive, fileId: string) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' }
  );
  return res.data as unknown as string;
}

async function downloadFileBuffer(drive: drive_v3.Drive, fileId: string) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data as ArrayBuffer);
}

// ---------- image mirror ----------
async function mirrorImage(
  drive: drive_v3.Drive,
  supa: SupabaseClient,
  img: drive_v3.Schema$File,
  slug: string
): Promise<string> {
  // Use Drive md5 in path so changed files get a new URL (busts CDN cache)
  const hash = (img.md5Checksum || crypto.randomBytes(4).toString('hex')).slice(0, 8);
  const safeName = img.name!.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${slug}/${hash}-${safeName}`;

  // Skip re-upload if already there
  const { data: existing } = await supa.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .list(slug, { search: `${hash}-${safeName}` });
  if (!existing?.find((f) => f.name === `${hash}-${safeName}`)) {
    const buf = await downloadFileBuffer(drive, img.id!);
    await supa.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(path, buf, {
        contentType: img.mimeType || 'image/jpeg',
        upsert: true,
      });
  }

  const { data } = supa.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

// ---------- slug ----------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
