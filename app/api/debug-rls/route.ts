// TEMPORARY DIAGNOSTIC — comparing what anon role sees vs what service-role
// sees against the inventory table. Used to definitively prove whether the
// "deployed page sees fewer rows than expected" bug is RLS-driven or not.
//
// Returns id/slug/published/status only — same surface area as /debug. No
// internal CRM fields. Revert once we're done debugging.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/listings";

const PUBLIC_COLUMNS_FULL = [
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json(
      {
        error: "missing env",
        have_url: Boolean(url),
        have_anon: Boolean(anonKey),
        have_service: Boolean(serviceKey),
      },
      { status: 500 },
    );
  }

  const anon = createClient(url, anonKey, { auth: { persistSession: false } });
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const minimalCols = "id, slug, published, status";

  // 1. Anon, minimal columns, no order — same as before
  const anonMinimal = await anon
    .from("inventory")
    .select(minimalCols)
    .eq("published", true);

  // 2. Anon, FULL PUBLIC_COLUMNS, with order by date_listed desc nullslast —
  //    same query getPublishedListings() makes
  const anonFull = await anon
    .from("inventory")
    .select(PUBLIC_COLUMNS_FULL)
    .eq("published", true)
    .order("date_listed", { ascending: false, nullsFirst: false });

  // 3. Admin minimal — service role, no RLS
  const adminMinimal = await admin
    .from("inventory")
    .select(minimalCols)
    .eq("published", true);

  // 4. Direct call to getPublishedListings() — what the page actually uses
  let helperSlugs: (string | null)[] | null = null;
  let helperCount: number | null = null;
  let helperError: string | null = null;
  try {
    const helperRows = await getPublishedListings();
    helperCount = helperRows.length;
    helperSlugs = helperRows.map((l) => l.slug);
  } catch (e) {
    helperError = e instanceof Error ? e.message : String(e);
  }

  // 5. Bisection — group-by-group to isolate which column drops rows
  const groups: { name: string; cols: string }[] = [
    { name: "geo", cols: "id, slug, latitude, longitude, google_maps_url" },
    {
      name: "pricing",
      cols:
        "id, slug, cash_price, financing_available, down_payment, monthly_payment, term_months, interest_rate",
    },
    {
      name: "details",
      cols:
        "id, slug, road_access, utilities, topography, nearest_recreation, nearest_town, best_use_cases",
    },
    {
      name: "narrative",
      cols: "id, slug, description, lead_hook, main_image, gallery",
    },
    {
      name: "meta",
      cols: "id, slug, state, state_code, city, county, acreage, date_listed, apn, available_terms",
    },
  ];

  const groupResults: Record<string, unknown> = {};
  for (const g of groups) {
    const r = await anon
      .from("inventory")
      .select(g.cols)
      .eq("published", true);
    groupResults[g.name] = {
      count: r.data?.length ?? null,
      error: r.error?.message ?? null,
    };
  }

  type SlugRow = { slug: string | null };

  return NextResponse.json({
    anon_minimal: {
      count: anonMinimal.data?.length ?? null,
      slugs:
        (anonMinimal.data as SlugRow[] | null)?.map(
          (r) => r.slug ?? "(null)",
        ) ?? null,
      error: anonMinimal.error?.message ?? null,
    },
    anon_full: {
      count: anonFull.data?.length ?? null,
      slugs:
        (anonFull.data as SlugRow[] | null)?.map(
          (r) => r.slug ?? "(null)",
        ) ?? null,
      error: anonFull.error?.message ?? null,
    },
    admin_minimal: {
      count: adminMinimal.data?.length ?? null,
      slugs:
        (adminMinimal.data as SlugRow[] | null)?.map(
          (r) => r.slug ?? "(null)",
        ) ?? null,
      error: adminMinimal.error?.message ?? null,
    },
    helper: {
      count: helperCount,
      slugs: helperSlugs,
      error: helperError,
    },
    bisect_groups: groupResults,
    demo_flag: process.env.NEXT_PUBLIC_LOTLINKUP_DEMO ?? null,
  });
}
