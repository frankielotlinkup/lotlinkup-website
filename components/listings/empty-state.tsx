import Link from "next/link";
import type { View } from "./utils";

const linkClass =
  "text-accent underline underline-offset-2 transition-colors hover:text-accent-deep";

export function EmptyState({
  view,
  hasFilters,
}: {
  view: View;
  hasFilters: boolean;
}) {
  // If state/acreage filters are applied, the issue is likely the filter
  // combination — push toward clearing filters rather than switching view.
  if (hasFilters || view === "all") {
    return (
      <div className="rounded-md bg-paper-warm px-8 py-16 text-center">
        <h3 className="type-h3">No lots match these filters.</h3>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-soft">
          Try adjusting your filters or{" "}
          <Link href="/land-for-sale" className={linkClass}>
            view all listings
          </Link>
          .
        </p>
      </div>
    );
  }

  if (view === "financed") {
    return (
      <div className="rounded-md bg-paper-warm px-8 py-16 text-center">
        <h3 className="type-h3">No financed listings right now.</h3>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-soft">
          Browse{" "}
          <Link href="/land-for-sale?view=premium" className={linkClass}>
            Premium lots
          </Link>{" "}
          or{" "}
          <Link href="/land-for-sale" className={linkClass}>
            all listings
          </Link>
          .
        </p>
      </div>
    );
  }

  // view === "premium"
  return (
    <div className="rounded-md bg-paper-warm px-8 py-16 text-center">
      <h3 className="type-h3">No premium listings right now.</h3>
      <p className="mx-auto mt-3 max-w-md text-base text-ink-soft">
        Browse{" "}
        <Link href="/land-for-sale?view=financed" className={linkClass}>
          Owner Financed lots
        </Link>{" "}
        or{" "}
        <Link href="/land-for-sale" className={linkClass}>
          all listings
        </Link>
        .
      </p>
    </div>
  );
}
