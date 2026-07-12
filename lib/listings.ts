import { DEMO_LISTINGS } from "./demo-data";

// We talk to PostgREST directly via fetch instead of going through the
// supabase-js client. The client has bitten us multiple times with silent
// row-drop bugs whose triggers depend on subtle data shapes (specific column
// values, sort orders, filter operators). Raw fetch with the same URL params
// returned correct results every time in our diagnostic probes, so it's
// strictly more reliable for read paths. We pay one fetch per page render;
// pages are `force-dynamic` anyway. RLS still enforces public-only reads.

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeListing(row: PublicListing): PublicListing {
  return {
    ...row,
    latitude: toNumberOrNull(row.latitude),
    longitude: toNumberOrNull(row.longitude),
  };
}

// One selectable option on a combo (two-lots-side-by-side) listing. The
// listing row still renders as a single page; the page shows a toggle that
// swaps these variants. `key` is 'both' | 'a' | 'b'; 'both' is always first
// and is the default selection.
export type ListingVariant = {
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

export type PublicListing = {
  id: string;
  slug: string | null;
  state: string | null;
  state_code: string | null;
  city: string | null;
  county: string | null;
  acreage: number | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  cash_price: number | null;
  finance_price: number | null;
  financing_available: boolean | null;
  down_payment: number | null;
  monthly_payment: number | null;
  term_months: number | null;
  interest_rate: number | null;
  road_access: string | null;
  utilities: string | null;
  topography: string | null;
  nearest_recreation: string | null;
  nearest_town: string | null;
  best_use_cases: string | null;
  description: string | null;
  lead_hook: string | null;
  main_image: string | null;
  gallery: string[] | null;
  date_listed: string | null;
  apn: string | null;
  available_terms: string | null;
  // 'single' (or null) renders as today. 'combo' means two side-by-side lots
  // with a buy-both / buy-A / buy-B toggle driven by `variants`.
  listing_type: string | null;
  variants: ListingVariant[] | null;
};

const PUBLIC_COLUMNS = [
  "id",
  "slug",
  "state",
  "state_code",
  "city",
  "county",
  "acreage",
  "latitude",
  "longitude",
  "google_maps_url",
  "cash_price",
  "finance_price",
  "financing_available",
  "down_payment",
  "monthly_payment",
  "term_months",
  "interest_rate",
  "road_access",
  "utilities",
  "topography",
  "nearest_recreation",
  "nearest_town",
  "best_use_cases",
  "description",
  "lead_hook",
  "main_image",
  "gallery",
  "date_listed",
  "apn",
  "available_terms",
  "listing_type",
  "variants",
].join(",");

function getEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }
  return { url, anonKey };
}

async function pgrstGet(path: string): Promise<unknown> {
  const { url, anonKey } = getEnv();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PostgREST ${res.status}: ${body}`);
  }
  return res.json();
}

const isDemo = () => process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1";

export async function getPublishedListings(): Promise<PublicListing[]> {
  const select = encodeURIComponent(PUBLIC_COLUMNS);
  let real: PublicListing[] = [];
  try {
    const rows = (await pgrstGet(
      `inventory?select=${select}&published=is.true`,
    )) as PublicListing[];
    real = rows.map(normalizeListing);
    real.sort((a, b) => {
      const ad = a.date_listed ?? "";
      const bd = b.date_listed ?? "";
      return bd.localeCompare(ad);
    });
  } catch (e) {
    // In demo/preview mode, still render the demo listings even if the live
    // inventory fetch fails (e.g. the combo columns aren't migrated yet).
    // Real production (demo off) rethrows so failures stay loud.
    if (!isDemo()) throw e;
    console.warn("[listings] live fetch failed; demo data only:", e);
  }

  if (isDemo()) {
    return [...real, ...DEMO_LISTINGS];
  }

  return real;
}

export async function getListingBySlug(
  slug: string,
): Promise<PublicListing | null> {
  const select = encodeURIComponent(PUBLIC_COLUMNS);
  const slugParam = encodeURIComponent(slug);
  try {
    const rows = (await pgrstGet(
      `inventory?select=${select}&slug=eq.${slugParam}&published=is.true&limit=1`,
    )) as PublicListing[];
    if (rows.length > 0) return normalizeListing(rows[0]);
  } catch (e) {
    if (!isDemo()) throw e;
    console.warn("[listings] live fetch failed; demo data only:", e);
  }

  if (isDemo()) {
    const demo = DEMO_LISTINGS.find((l) => l.slug === slug);
    if (demo) return demo;
  }

  return null;
}
