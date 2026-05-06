import { getSupabaseClient } from "./supabase";
import { DEMO_LISTINGS } from "./demo-data";

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
].join(",");

export async function getPublishedListings(): Promise<PublicListing[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .eq("published", true)
    .order("date_listed", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch published listings: ${error.message}`);
  }

  const real = (data ?? []) as unknown as PublicListing[];

  if (process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1") {
    return [...real, ...DEMO_LISTINGS];
  }

  return real;
}
