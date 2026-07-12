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
  finance_price?: number;
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
    updated: 0,
    archived: 0,
    unmatched: [] as { folder: string; apn: string | null; slug: string }[],
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

    // 1. /maps/...@lat,lng,zoom — appears in /maps/place URLs
    let m = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 2. /maps/search/<lat>,<lng> — what maps.app.goo.gl shortlinks
    //    redirect to in 2026. The "+" between the comma and the lng is
    //    a URL-encoded space, e.g. /maps/search/33.824,+-87.242
    m = finalUrl.match(/\/maps\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 3. ?q=lat,lng or &q=lat,lng — legacy maps query API
    m = finalUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 4. ?query=lat,lng — newer maps query API
    m = finalUrl.match(/[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };

    // 5. !3d<lat>!4d<lng> — embedded in the /maps data parameter,
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
  report: SyncReport
) {
  const folderId = pf.id!;
  const folderName = pf.name!;

  // 1. Read property-info.md
  const mdFile = await findChildByName(drive, folderId, 'property-info.md');
  if (!mdFile) throw new Error('property-info.md not found');
  const mdText = await downloadFileText(drive, mdFile.id!);

  // Combo listings ("- listing type: combo") carry three ## sections and three
  // image subfolders; hand off to the combo path. Everything else is a normal
  // single-lot folder and flows through unchanged below.
  const sectioned = parseSections(mdText);
  if ((sectioned.preamble['listing type'] || '').toLowerCase() === 'combo') {
    await syncComboFolder(
      drive,
      supa,
      folderId,
      folderName,
      stateName,
      sectioned,
      report,
    );
    return;
  }

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
    finance_price: parsed.finance_price,
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
    listing_type: 'single',
    variants: null,
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
    // CRM is the gatekeeper for new lots. If we can't match by APN or slug,
    // skip insert and report so Andrew can fix the APN in either CRM or
    // property-info.md and re-run.
    report.unmatched.push({
      folder: folderName,
      apn: parsed.apn ?? null,
      slug,
    });
  }
}

// ---------- per-combo sync ----------
// A combo folder holds one property-info.md with a shared preamble + three
// "## ..." sections (Both / Lot A / Lot B), plus three image subfolders
// (Images-Both / Images-LotA / Images-LotB). We build one inventory row whose
// top-level fields mirror the "both" option (so cards/SEO work), and store all
// three options in `variants` for the on-page toggle.
async function syncComboFolder(
  drive: drive_v3.Drive,
  supa: SupabaseClient,
  folderId: string,
  folderName: string,
  stateName: FolderState,
  sectioned: MdSections,
  report: SyncReport,
) {
  const slug = slugify(folderName);
  const shared = fieldsToProperty(sectioned.preamble);

  const variants: SyncVariant[] = [];
  for (const sec of sectioned.sections) {
    const cls = classifyVariant(sec.title);
    if (!cls) continue;
    const f = sec.fields;

    // Mirror this option's images into <slug>/<key>/… and pick its hero.
    const imgFolder = await findChildByName(drive, folderId, cls.folder, true);
    const imgs = imgFolder ? await listImageFiles(drive, imgFolder.id!) : [];
    const mirrored: { name: string; url: string }[] = [];
    for (const img of imgs) {
      const url = await mirrorImage(drive, supa, img, slug, cls.key);
      mirrored.push({ name: img.name!, url });
    }
    const heroUrl = pickHero(mirrored);
    const gallery = mirrored
      .filter((m) => m.url !== heroUrl)
      .map((m) => m.url);

    variants.push({
      key: cls.key,
      label: f['label'] || cls.defaultLabel,
      acreage: numFrom(f, 'acres') ?? null,
      cash_price: numFrom(f, 'cash price') ?? null,
      finance_price: numFrom(f, 'financed price') ?? null,
      financing_available: boolFrom(f, 'owner financing') ?? false,
      down_payment: numFrom(f, 'down payment') ?? null,
      monthly_payment: numFrom(f, 'monthly payment') ?? null,
      term_months: numFrom(f, 'term months') ?? null,
      interest_rate: numFrom(f, 'interest rate') ?? null,
      apn: f['apn'] || null,
      description: f['description'] || null,
      lead_hook: f['lead hook'] || null,
      main_image: heroUrl ?? null,
      gallery,
    });
  }

  const order: Record<string, number> = { both: 0, a: 1, b: 2 };
  variants.sort((x, y) => (order[x.key] ?? 9) - (order[y.key] ?? 9));

  const both = variants.find((v) => v.key === 'both') ?? variants[0];
  if (!both) throw new Error('combo listing has no recognized lot sections');

  const coords = shared.google_maps_url
    ? await extractCoordsFromMapsUrl(shared.google_maps_url)
    : null;

  const publishedFlags = stateToFlags(stateName);
  const row = {
    slug,
    drive_folder: folderId,
    state: shared.state,
    state_code: shared.state_code,
    county: shared.county,
    city: shared.city,
    acreage: both.acreage ?? undefined,
    apn: both.apn ?? undefined,
    google_maps_url: shared.google_maps_url,
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
    cash_price: both.cash_price ?? undefined,
    finance_price: both.finance_price ?? undefined,
    asking_price: both.cash_price ?? undefined,
    financing_available: both.financing_available,
    down_payment: both.down_payment ?? undefined,
    monthly_payment: both.monthly_payment ?? undefined,
    term_months: both.term_months ?? undefined,
    interest_rate: both.interest_rate ?? undefined,
    available_terms: buildAvailableTerms({
      financing_available: both.financing_available,
      down_payment: both.down_payment ?? undefined,
      monthly_payment: both.monthly_payment ?? undefined,
      term_months: both.term_months ?? undefined,
      interest_rate: both.interest_rate ?? undefined,
    }),
    zoning: shared.zoning,
    road_access: shared.road_access,
    utilities: shared.utilities,
    topography: shared.topography,
    nearest_recreation: shared.nearest_recreation,
    nearest_town: shared.nearest_town,
    best_use_cases: shared.best_use_cases,
    description: both.description ?? shared.description,
    lead_hook: both.lead_hook ?? shared.lead_hook,
    buy_price: shared.buy_price,
    main_image: both.main_image,
    gallery: both.gallery,
    listing_type: 'combo',
    variants,
    ...publishedFlags,
    date_listed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Match the CRM row by any of the parcel APNs (a combo has two), then slug.
  const apnCandidates = [
    both.apn,
    ...variants.filter((v) => v.key !== 'both').map((v) => v.apn),
  ].filter((a): a is string => !!a);

  let existing: { id: string } | null = null;
  for (const apn of apnCandidates) {
    const { data } = await supa
      .from('inventory')
      .select('id')
      .eq('apn', apn)
      .maybeSingle();
    if (data) {
      existing = data;
      break;
    }
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
    report.unmatched.push({
      folder: folderName,
      apn: apnCandidates[0] ?? null,
      slug,
    });
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
// Pull "- key: value" lines into a lowercased map. Blank / TBD values skipped.
function extractFields(lines: string[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const raw of lines) {
    const m = raw.match(/^\s*-\s*([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (val === '' || val === 'TBD') continue;
    fields[key] = val;
  }
  return fields;
}

function numFrom(fields: Record<string, string>, k: string): number | undefined {
  const v = fields[k];
  if (!v) return undefined;
  const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

function boolFrom(fields: Record<string, string>, k: string): boolean | undefined {
  const v = fields[k]?.toLowerCase();
  if (v === 'yes' || v === 'true') return true;
  if (v === 'no' || v === 'false') return false;
  return undefined;
}

function fieldsToProperty(fields: Record<string, string>): ParsedProperty {
  return {
    state: fields['state'],
    state_code: fields['state code']?.toUpperCase(),
    county: fields['county'],
    city: fields['city'],
    acreage: numFrom(fields, 'acres'),
    apn: fields['apn'],
    google_maps_url: fields['maps link'],
    cash_price: numFrom(fields, 'cash price'),
    finance_price: numFrom(fields, 'financed price'),
    financing_available: boolFrom(fields, 'owner financing'),
    down_payment: numFrom(fields, 'down payment'),
    monthly_payment: numFrom(fields, 'monthly payment'),
    term_months: numFrom(fields, 'term months'),
    interest_rate: numFrom(fields, 'interest rate'),
    zoning: fields['zoning'],
    road_access: fields['road access'],
    utilities: fields['utilities'],
    notable: fields['notable'],
    buy_price: numFrom(fields, 'purchase price'),
    topography: fields['terrain'],
    nearest_recreation: fields['nearest recreation'],
    nearest_town: fields['nearest town'],
    best_use_cases: fields['best use cases'],
    description: fields['description'],
    lead_hook: fields['lead hook'],
  };
}

function parsePropertyMd(md: string): ParsedProperty {
  return fieldsToProperty(extractFields(md.split(/\r?\n/)));
}

// Split a combo sheet into a shared preamble (before the first "## ..."
// heading) plus one block per "## Section". Each block's "- key: value" lines
// are extracted the same way as a single-lot sheet.
type MdSections = {
  preamble: Record<string, string>;
  sections: { title: string; fields: Record<string, string> }[];
};
function parseSections(md: string): MdSections {
  const lines = md.split(/\r?\n/);
  const preamble: string[] = [];
  const sections: { title: string; lines: string[] }[] = [];
  let cur: { title: string; lines: string[] } | null = null;
  for (const l of lines) {
    const h = l.match(/^\s*#{2,}\s+(.*)$/);
    if (h) {
      cur = { title: h[1].trim(), lines: [] };
      sections.push(cur);
      continue;
    }
    if (cur) cur.lines.push(l);
    else preamble.push(l);
  }
  return {
    preamble: extractFields(preamble),
    sections: sections.map((s) => ({
      title: s.title,
      fields: extractFields(s.lines),
    })),
  };
}

// Map a "## ..." section title to one of the three combo options and the
// Drive image subfolder that holds its photos.
function classifyVariant(
  title: string,
): { key: string; folder: string; defaultLabel: string } | null {
  const t = title.toLowerCase();
  if (t.includes('both') || t.includes('together'))
    return { key: 'both', folder: 'Images-Both', defaultLabel: 'Both lots together' };
  if (t.includes('lot a') || t.includes('lot-a'))
    return { key: 'a', folder: 'Images-LotA', defaultLabel: 'Lot A' };
  if (t.includes('lot b') || t.includes('lot-b'))
    return { key: 'b', folder: 'Images-LotB', defaultLabel: 'Lot B' };
  return null;
}

type SyncVariant = {
  key: string;
  label: string;
  acreage: number | null;
  cash_price: number | null;
  finance_price: number | null;
  financing_available: boolean;
  down_payment: number | null;
  monthly_payment: number | null;
  term_months: number | null;
  interest_rate: number | null;
  apn: string | null;
  description: string | null;
  lead_hook: string | null;
  main_image: string | null;
  gallery: string[];
};

type SyncReport = {
  updated: number;
  unmatched: { folder: string; apn: string | null; slug: string }[];
};

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
  slug: string,
  subdir = ''
): Promise<string> {
  // Use Drive md5 in path so changed files get a new URL (busts CDN cache).
  // `subdir` namespaces a combo option's images (e.g. <slug>/a/…).
  const hash = (img.md5Checksum || crypto.randomBytes(4).toString('hex')).slice(0, 8);
  const safeName = img.name!.replace(/[^a-zA-Z0-9._-]/g, '_');
  const dir = subdir ? `${slug}/${subdir}` : slug;
  const path = `${dir}/${hash}-${safeName}`;

  // Skip re-upload if already there
  const { data: existing } = await supa.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .list(dir, { search: `${hash}-${safeName}` });
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
