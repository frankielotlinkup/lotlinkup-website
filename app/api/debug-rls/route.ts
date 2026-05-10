// TEMPORARY DIAGNOSTIC — comparing what anon role sees vs what service-role
// sees against the inventory table. Used to definitively prove whether the
// "deployed page sees fewer rows than expected" bug is RLS-driven or not.
//
// Returns id/slug/published/status only — same surface area as /debug. No
// internal CRM fields. Revert once we're done debugging.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

  const cols = "id, slug, published, status";

  const anonResult = await anon
    .from("inventory")
    .select(cols)
    .eq("published", true);
  const adminResult = await admin
    .from("inventory")
    .select(cols)
    .eq("published", true);

  type Row = { id: string; slug: string | null; published: boolean; status: string };

  return NextResponse.json({
    anon: {
      count: anonResult.data?.length ?? null,
      slugs:
        (anonResult.data as Row[] | null)?.map((r) => r.slug ?? "(null slug)") ??
        null,
      error: anonResult.error?.message ?? null,
    },
    admin: {
      count: adminResult.data?.length ?? null,
      slugs:
        (adminResult.data as Row[] | null)?.map((r) => r.slug ?? "(null slug)") ??
        null,
      error: adminResult.error?.message ?? null,
    },
  });
}
