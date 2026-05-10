import { getSupabaseClient } from "./supabase";
import { DEMO_LISTINGS } from "./demo-data";

// PostgREST serializes Postgres `numeric` columns as strings to preserve
// precision. Our PublicListing type says `latitude: number | null`, but at
// runtime the values arrive as `"33.824730"`. Coerce explicitly so consumers
// can rely on the typed contract — strings parse, NaN/missing fall to null.
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
].join(",");

export async function getPublishedListings(): Promise<PublicListing[]> {
  const supabase = getSupabaseClient();
  // No `.order()` here — full PUBLIC_COLUMNS + `.order("date_listed", ...)`
  // triggers a supabase-js silent-row-drop bug. Verified via /api/debug-rls:
  // same query without order returns 6 rows; with order returns 5.
  // `.range(0, 99)` and `.order("id")` also work as escape hatches.
  // We sort in JS instead — fewer than 100 rows; cost is trivial.
  const { data, error } = await supabase
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .is("published", true);

  if (error) {
    throw new Error(`Failed to fetch published listings: ${error.message}`);
  }

  const real = ((data ?? []) as unknown as PublicListing[]).map(
    normalizeListing,
  );

  real.sort((a, b) => {
    const ad = a.date_listed ?? "";
    const bd = b.date_listed ?? "";
    return bd.localeCompare(ad);
  });

  if (process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1") {
    return [...real, ...DEMO_LISTINGS];
  }

  return real;
}

export async function getListingBySlug(
  slug: string,
): Promise<PublicListing | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .is("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch listing by slug: ${error.message}`);
  }

  if (data) return normalizeListing(data as unknown as PublicListing);

  if (process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1") {
    const demo = DEMO_LISTINGS.find((l) => l.slug === slug);
    if (demo) return demo;
  }

  return null;
}
