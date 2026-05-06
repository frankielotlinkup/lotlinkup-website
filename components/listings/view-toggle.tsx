import Link from "next/link";
import { buildLandUrl, type Acres, type View } from "./utils";

const VIEWS: { value: View; label: string }[] = [
  { value: "all", label: "All Lots" },
  { value: "financed", label: "Owner Financed" },
  { value: "premium", label: "Premium" },
];

export function ViewToggle({
  currentView,
  stateFilter,
  acresFilter,
}: {
  currentView: View;
  stateFilter: string | null;
  acresFilter: Acres;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pricing view"
      className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-2"
    >
      {VIEWS.map((v) => {
        const active = v.value === currentView;
        const href = buildLandUrl({
          view: v.value,
          state: stateFilter,
          acres: acresFilter,
        });
        return (
          <Link
            key={v.value}
            href={href}
            role="tab"
            aria-selected={active}
            className={
              active
                ? "rounded-md bg-ink text-paper shadow-sm px-5 py-2.5 text-center type-small font-medium"
                : "rounded-md bg-paper-warm text-ink-soft hover:bg-paper-edge px-5 py-2.5 text-center type-small font-medium transition-colors"
            }
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
