// ONE-SHOT cleanup endpoint. Deletes a hardcoded list of inventory row IDs
// that were duplicates Andrew authorized for removal on 2026-05-12. Will be
// removed from the repo right after the deletes run.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IDS_TO_DELETE = [
  "57346312-7b2a-4075-b9aa-f79825d10274", // Texas MO sync duplicate ($58k)
  "c3249139-70c4-4b44-9ff5-9fbbb892f9f5", // Van Buren combined CRM entry ($9.35k)
  "dc29e0ca-1e55-44c3-87d2-455f2283c643", // Navarro "and" CRM original ($14.5k)
  "849f221c-bd76-416c-a34b-0538547f02b0", // Navarro "and" CRM original ($12.5k)
];

export async function POST(req: Request) {
  const expected = process.env.SYNC_SECRET ?? "";
  if (!expected || req.headers.get("x-sync-secret") !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "missing env" }, { status: 500 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const results: Array<{
    id: string;
    slug: string | null;
    apn: string | null;
    deleted: boolean;
    error: string | null;
  }> = [];

  for (const id of IDS_TO_DELETE) {
    const { data: before } = await admin
      .from("inventory")
      .select("id, slug, apn")
      .eq("id", id)
      .maybeSingle();

    if (!before) {
      results.push({ id, slug: null, apn: null, deleted: false, error: "not_found" });
      continue;
    }

    const { error } = await admin.from("inventory").delete().eq("id", id);
    results.push({
      id,
      slug: before.slug,
      apn: before.apn,
      deleted: !error,
      error: error?.message ?? null,
    });
  }

  return NextResponse.json({ results });
}
