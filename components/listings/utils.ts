export type View = "all" | "financed" | "premium";
export type Acres = "under-1" | "1-plus" | null;

export function buildLandUrl(params: {
  view?: View;
  state?: string | null;
  acres?: Acres;
}): string {
  const sp = new URLSearchParams();
  if (params.view && params.view !== "all") sp.set("view", params.view);
  if (params.state) sp.set("state", params.state);
  if (params.acres) sp.set("acres", params.acres);
  const qs = sp.toString();
  return qs ? `/land-for-sale?${qs}` : "/land-for-sale";
}

export function parseView(v: string | string[] | undefined): View {
  if (v === "financed" || v === "premium") return v;
  return "all";
}

export function parseStateCode(s: string | string[] | undefined): string | null {
  if (typeof s === "string" && /^[A-Z]{2}$/.test(s)) return s;
  return null;
}

export function parseAcres(a: string | string[] | undefined): Acres {
  if (a === "under-1" || a === "1-plus") return a;
  return null;
}
