// TEMPORARY read-only inventory audit endpoint.
// Used to identify duplicate rows before cleanup. No writes.
// Will be removed once cleanup is done.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "missing env" }, { status: 500 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await admin
    .from("inventory")
    .select(
      "id, slug, state, state_code, county, city, acreage, apn, drive_folder, published, status, buy_price, sell_price, asking_price, cash_price, closing_costs, misc_expenses, created_at, updated_at",
    )
    .order("state_code")
    .order("county");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Row = {
    id: string;
    slug: string | null;
    state: string | null;
    state_code: string | null;
    county: string | null;
    city: string | null;
    acreage: number | null;
    apn: string | null;
    drive_folder: string | null;
    published: boolean | null;
    status: string | null;
    buy_price: number | null;
    sell_price: number | null;
    asking_price: number | null;
    cash_price: number | null;
    closing_costs: number | null;
    misc_expenses: number | null;
    created_at: string | null;
    updated_at: string | null;
  };

  const rows = (data ?? []) as Row[];
  const annotated = rows.map((r) => {
    const sell = r.sell_price ?? r.asking_price ?? r.cash_price ?? 0;
    const buy = r.buy_price ?? 0;
    const closing = r.closing_costs ?? 0;
    const misc = r.misc_expenses ?? 0;
    const projected = sell - buy - closing - misc;
    return {
      ...r,
      from_sync: r.drive_folder !== null,
      projected_profit: projected,
    };
  });

  return NextResponse.json({ count: annotated.length, rows: annotated });
}
