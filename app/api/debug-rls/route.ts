// TEMPORARY DIAGNOSTIC — KY row is in DB but missing from helper output.
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/listings";

const PUBLIC_COLUMNS = [
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
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Helper as the public site uses it
  let helper: { count: number; slugs: string[] } = { count: 0, slugs: [] };
  try {
    const rows = await getPublishedListings();
    helper = { count: rows.length, slugs: rows.map((r) => r.slug ?? "") };
  } catch { /* ignore */ }

  // Anon: minimal cols, .is("published", true), no order
  const anonIsMinimal = await anon
    .from("inventory")
    .select("id, slug, published, status, date_listed")
    .is("published", true);

  // Anon: full PUBLIC_COLUMNS, .is, no order
  const anonIsFullNoOrder = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .is("published", true);

  // Anon: full PUBLIC_COLUMNS, .is, with order (mirrors helper exactly)
  const anonIsFullOrdered = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .is("published", true)
    .order("date_listed", { ascending: false });

  // Anon: range hack — explicit pagination
  const anonIsRanged = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .is("published", true)
    .order("date_listed", { ascending: false })
    .range(0, 99);

  // Anon: order by id (different column)
  const anonOrderById = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS)
    .is("published", true)
    .order("id");

  // Raw HTTP — bypasses supabase-js entirely
  let rawFetch: { count: number | null; slugs: string[]; error: string | null } =
    { count: null, slugs: [], error: null };
  try {
    const r = await fetch(
      `${url}/rest/v1/inventory?select=${encodeURIComponent(PUBLIC_COLUMNS)}&published=is.true&order=date_listed.desc`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }, cache: "no-store" },
    );
    if (!r.ok) rawFetch.error = `HTTP ${r.status}: ${await r.text()}`;
    else {
      const rows = (await r.json()) as Array<{ slug: string }>;
      rawFetch = { count: rows.length, slugs: rows.map((x) => x.slug), error: null };
    }
  } catch (e) { rawFetch.error = String(e); }

  // Admin baseline
  const adminAll = await admin
    .from("inventory")
    .select("id, slug, published, status, date_listed")
    .not("drive_folder", "is", null);

  type Row = Record<string, unknown>;
  const slugsOf = (rows: Row[] | null) =>
    (rows ?? []).map((r) => r.slug as string);

  return NextResponse.json({
    helper,
    anon_is_minimal: { count: anonIsMinimal.data?.length, slugs: slugsOf(anonIsMinimal.data as Row[] | null), error: anonIsMinimal.error?.message ?? null },
    anon_is_full_no_order: { count: anonIsFullNoOrder.data?.length, slugs: slugsOf(anonIsFullNoOrder.data as Row[] | null), error: anonIsFullNoOrder.error?.message ?? null },
    anon_is_full_ordered: { count: anonIsFullOrdered.data?.length, slugs: slugsOf(anonIsFullOrdered.data as Row[] | null), error: anonIsFullOrdered.error?.message ?? null },
    anon_is_ranged: { count: anonIsRanged.data?.length, slugs: slugsOf(anonIsRanged.data as Row[] | null), error: anonIsRanged.error?.message ?? null },
    anon_order_by_id: { count: anonOrderById.data?.length, slugs: slugsOf(anonOrderById.data as Row[] | null), error: anonOrderById.error?.message ?? null },
    raw_fetch: rawFetch,
    admin_all: { count: adminAll.data?.length, slugs: slugsOf(adminAll.data as Row[] | null), error: adminAll.error?.message ?? null },
  });
}
