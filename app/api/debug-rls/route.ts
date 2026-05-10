// TEMPORARY DIAGNOSTIC — find why anon view differs from admin view.
// Will be reverted once we figure out which row is missing and why.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/listings";

const PUBLIC_COLUMNS_FULL = [
  "id", "slug", "state", "state_code", "city", "county", "acreage",
  "latitude", "longitude", "google_maps_url", "cash_price",
  "financing_available", "down_payment", "monthly_payment", "term_months",
  "interest_rate", "road_access", "utilities", "topography",
  "nearest_recreation", "nearest_town", "best_use_cases", "description",
  "lead_hook", "main_image", "gallery", "date_listed", "apn",
  "available_terms",
].join(",");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: "missing env" }, { status: 500 });
  }

  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Admin view (full row dump for ALL rows w/ drive_folder set)
  const adminAll = await admin
    .from("inventory")
    .select(
      "id, slug, published, status, drive_folder, date_listed, apn, latitude, longitude, main_image",
    )
    .not("drive_folder", "is", null);

  // Anon view of published (full PUBLIC_COLUMNS — what the helper uses now)
  const anonHelper = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS_FULL)
    .eq("published", true)
    .order("date_listed", { ascending: false });

  // Anon view minimal cols (control)
  const anonMinimal = await anon
    .from("inventory")
    .select("id, slug, published, status")
    .eq("published", true);

  // Direct helper call (what /debug uses)
  let helperResult: { count: number | null; slugs: (string | null)[] | null } =
    { count: null, slugs: null };
  try {
    const rows = await getPublishedListings();
    helperResult = { count: rows.length, slugs: rows.map((r) => r.slug) };
  } catch {
    /* ignore */
  }

  type Row = Record<string, unknown>;
  return NextResponse.json({
    admin_all_rows: adminAll.data ?? adminAll.error?.message,
    anon_helper: {
      count: anonHelper.data?.length ?? null,
      slugs:
        (anonHelper.data as Row[] | null)?.map((r) => r.slug as string) ?? null,
      error: anonHelper.error?.message ?? null,
    },
    anon_minimal: {
      count: anonMinimal.data?.length ?? null,
      slugs:
        (anonMinimal.data as Row[] | null)?.map((r) => r.slug as string) ??
        null,
      error: anonMinimal.error?.message ?? null,
    },
    helper: helperResult,
  });
}
