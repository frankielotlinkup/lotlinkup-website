import Link from "next/link";
import { buildLandUrl, type Acres, type View } from "./utils";

const ACRE_OPTIONS: { value: Acres; label: string }[] = [
  { value: null, label: "All sizes" },
  { value: "under-1", label: "Under 1 acre" },
  { value: "1-plus", label: "1+ acres" },
];

export function DesktopFilterBar({
  stateFilter,
  acresFilter,
  view,
  states,
  resultCount,
}: {
  stateFilter: string | null;
  acresFilter: Acres;
  view: View;
  states: { code: string; name: string }[];
  resultCount: number;
}) {
  return (
    <div className="hidden md:flex items-end justify-between gap-6 flex-wrap">
      <div className="flex items-end gap-6 flex-wrap">
        {/* State filter — form so it works without JS */}
        <form
          method="GET"
          action="/land-for-sale"
          className="flex items-end gap-2"
        >
          {view !== "all" && (
            <input type="hidden" name="view" value={view} />
          )}
          {acresFilter && (
            <input type="hidden" name="acres" value={acresFilter} />
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">State</span>
            <select
              name="state"
              defaultValue={stateFilter ?? ""}
              className="rounded-md border border-paper-edge bg-paper-warm px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">All states</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md border border-paper-edge bg-paper-warm px-3 py-2 text-sm font-medium text-ink hover:bg-paper-edge transition-colors"
          >
            Apply
          </button>
        </form>

        {/* Acreage filter — Link pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Acreage</span>
          <div className="flex gap-2">
            {ACRE_OPTIONS.map((opt) => {
              const active = opt.value === acresFilter;
              const href = buildLandUrl({
                view,
                state: stateFilter,
                acres: opt.value,
              });
              return (
                <Link
                  key={opt.label}
                  href={href}
                  aria-pressed={active}
                  className={
                    active
                      ? "rounded-md bg-ink text-paper px-3 py-2 text-sm font-medium"
                      : "rounded-md border border-paper-edge bg-paper-warm text-ink-soft hover:bg-paper-edge px-3 py-2 text-sm font-medium transition-colors"
                  }
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-ink-soft self-center">
        {resultCount} {resultCount === 1 ? "lot" : "lots"}
      </p>
    </div>
  );
}
