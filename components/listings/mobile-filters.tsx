"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Acres, View } from "./utils";

const ACRE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All sizes" },
  { value: "under-1", label: "Under 1" },
  { value: "1-plus", label: "1+ acres" },
];

export function MobileFilters({
  stateFilter,
  acresFilter,
  view,
  states,
  activeFilterCount,
}: {
  stateFilter: string | null;
  acresFilter: Acres;
  view: View;
  states: { code: string; name: string }[];
  activeFilterCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    Array.from(formData.entries()).forEach(([key, raw]) => {
      const value = String(raw);
      if (value) params.set(key, value);
    });
    setOpen(false);
    const qs = params.toString();
    router.push(qs ? `/land-for-sale?${qs}` : "/land-for-sale");
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-paper-edge bg-paper-warm px-4 py-3 text-sm font-medium text-ink hover:bg-paper-edge transition-colors"
      >
        <svg
          viewBox="0 0 20 20"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm3 5h8a1 1 0 010 2H6a1 1 0 010-2zm3 5h2a1 1 0 010 2H9a1 1 0 010-2z" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-paper">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 flex flex-col"
        >
          <button
            type="button"
            aria-label="Close filters backdrop"
            onClick={() => setOpen(false)}
            className="flex-1 bg-ink/60 backdrop-blur-sm"
          />
          <form
            method="GET"
            action="/land-for-sale"
            onSubmit={onSubmit}
            className="rounded-t-xl bg-paper text-ink shadow-2xl"
          >
            {view !== "all" && (
              <input type="hidden" name="view" value={view} />
            )}

            <div className="flex items-center justify-between border-b border-paper-edge px-6 py-4">
              <h2 className="font-serif text-xl font-normal">Filters</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-black/5 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 px-6 py-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">State</span>
                <select
                  name="state"
                  defaultValue={stateFilter ?? ""}
                  className="rounded-md border border-paper-edge bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">All states</option>
                  {states.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-ink mb-1">
                  Acreage
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {ACRE_OPTIONS.map((opt) => (
                    <label key={opt.label} className="cursor-pointer">
                      <input
                        type="radio"
                        name="acres"
                        value={opt.value}
                        defaultChecked={(acresFilter ?? "") === opt.value}
                        className="peer sr-only"
                      />
                      <span className="block rounded-md border border-paper-edge bg-paper-warm px-3 py-2 text-center text-sm font-medium text-ink-soft transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="border-t border-paper-edge bg-paper-warm px-6 py-4">
              <button
                type="submit"
                className="w-full rounded-md bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Apply filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
