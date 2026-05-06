import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getPublishedListings, type PublicListing } from "@/lib/listings";
import { ViewToggle } from "@/components/listings/view-toggle";
import { DesktopFilterBar } from "@/components/listings/desktop-filter-bar";
import { MobileFilters } from "@/components/listings/mobile-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { EmptyState } from "@/components/listings/empty-state";
import {
  parseAcres,
  parseStateCode,
  parseView,
  type Acres,
  type View,
} from "@/components/listings/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Land for Sale",
  description: "Hand-picked rural lots, sold direct.",
};

function applyFilters(
  listings: PublicListing[],
  view: View,
  state: string | null,
  acres: Acres,
): PublicListing[] {
  let result = listings;
  if (view === "financed") {
    result = result.filter((l) => l.financing_available === true);
  } else if (view === "premium") {
    result = result.filter((l) => l.financing_available === false);
  }
  if (state) {
    result = result.filter((l) => l.state_code === state);
  }
  if (acres === "under-1") {
    result = result.filter((l) => l.acreage != null && l.acreage < 1);
  } else if (acres === "1-plus") {
    result = result.filter((l) => l.acreage != null && l.acreage >= 1);
  }
  return result;
}

function lowestDownPayment(listings: PublicListing[]): number | null {
  const downs = listings
    .filter(
      (l): l is PublicListing & { down_payment: number } =>
        l.financing_available === true && l.down_payment != null,
    )
    .map((l) => l.down_payment);
  return downs.length ? Math.min(...downs) : null;
}

function viewCaption(
  view: View,
  financedListings: PublicListing[],
): string | null {
  if (view === "all") return null;
  if (view === "premium") {
    return "Larger lots, prime locations, ready to build.";
  }
  const lowest = lowestDownPayment(financedListings);
  if (lowest == null) return "Lots with seller financing.";
  return `Lots with seller financing. Down payments from $${lowest.toLocaleString("en-US")}.`;
}

function uniqueStates(
  listings: PublicListing[],
): { code: string; name: string }[] {
  const map = new Map<string, string>();
  for (const l of listings) {
    if (l.state_code && !map.has(l.state_code)) {
      map.set(l.state_code, l.state ?? l.state_code);
    }
  }
  return Array.from(map, ([code, name]) => ({ code, name })).sort((a, b) =>
    a.code.localeCompare(b.code),
  );
}

export default async function LandForSalePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const view = parseView(searchParams.view);
  const stateFilter = parseStateCode(searchParams.state);
  const acresFilter = parseAcres(searchParams.acres);

  const allListings = await getPublishedListings();

  // States dropdown is derived from the current view, before state/acres
  // filters apply — so users can't pick a state with zero results in the
  // current view.
  const inView = applyFilters(allListings, view, null, null);
  const states = uniqueStates(inView);

  const filtered = applyFilters(allListings, view, stateFilter, acresFilter);

  const financedAll = applyFilters(allListings, "financed", null, null);
  const caption = viewCaption(view, financedAll);

  const activeFilterCount =
    (stateFilter ? 1 : 0) + (acresFilter ? 1 : 0);
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <header className="mb-8 md:mb-12">
          <h1 className="type-h1">Land for Sale</h1>
          <p className="mt-4 text-[18px] text-ink-soft">
            Hand-picked rural lots, sold direct.
          </p>
        </header>

        <ViewToggle
          currentView={view}
          stateFilter={stateFilter}
          acresFilter={acresFilter}
        />
        {caption && (
          <p className="mt-3 mb-4 text-sm italic text-ink-soft">{caption}</p>
        )}

        <div className={caption ? "" : "mt-6"}>
          <DesktopFilterBar
            stateFilter={stateFilter}
            acresFilter={acresFilter}
            view={view}
            states={states}
            resultCount={filtered.length}
          />
          <MobileFilters
            stateFilter={stateFilter}
            acresFilter={acresFilter}
            view={view}
            states={states}
            activeFilterCount={activeFilterCount}
          />
        </div>

        <section className="mt-8 md:mt-12">
          {filtered.length === 0 ? (
            <EmptyState view={view} hasFilters={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              {filtered.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
