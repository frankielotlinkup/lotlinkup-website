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

  // Admin view: explicitly list every column we know exists, so we get
  // them all in the response (PostgREST 'select *' was returning only 10
  // for some reason — maybe a default-values quirk).
  const adminAll = await admin
    .from("inventory")
    .select(
      [
        ...PUBLIC_COLUMNS_FULL.split(","),
        "buy_price",
        "sell_price",
        "asking_price",
        "closing_costs",
        "misc_expenses",
        "notes",
        "lead_id",
        "zoning",
        "drive_folder",
        "published",
        "status",
        "updated_at",
        "created_at",
      ].join(","),
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

  // Anon by APN — direct lookup of Polk and Walker for comparison
  const anonPolkByApn = await anon
    .from("inventory")
    .select("id, slug, published, status, apn")
    .eq("apn", "34704");
  const anonWalkerByApn = await anon
    .from("inventory")
    .select("id, slug, published, status, apn")
    .eq("apn", "1706143000029003");
  // Anon by slug
  const anonPolkBySlug = await anon
    .from("inventory")
    .select("id, slug, published, status")
    .eq("slug", "polk-county-tx-0-44-acres-livingston");
  // Same query but no filter — what is anon's COMPLETE view of inventory
  const anonAll = await anon.from("inventory").select("id, slug");
  const adminAllSimple = await admin.from("inventory").select("id, slug");

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
    anon_polk_by_apn: {
      data: anonPolkByApn.data,
      error: anonPolkByApn.error?.message,
    },
    anon_walker_by_apn: {
      data: anonWalkerByApn.data,
      error: anonWalkerByApn.error?.message,
    },
    anon_polk_by_slug: {
      data: anonPolkBySlug.data,
      error: anonPolkBySlug.error?.message,
    },
    anon_all_count: anonAll.data?.length ?? null,
    admin_all_count: adminAllSimple.data?.length ?? null,
  });
}
