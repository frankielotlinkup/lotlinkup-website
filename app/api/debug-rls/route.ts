// TEMPORARY DIAGNOSTIC — find why the KY row is in DB but not public.
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: "missing env" }, { status: 500 });
  }
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const all = await admin
    .from("inventory")
    .select("id, slug, county, state_code, apn, published, status, drive_folder, main_image, latitude, longitude, date_listed, created_at")
    .not("drive_folder", "is", null);

  return NextResponse.json({
    rows: all.data,
    error: all.error?.message ?? null,
    count: all.data?.length ?? null,
  });
}
