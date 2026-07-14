import Link from "next/link";
import Image from "next/image";
import type { PublicListing } from "@/lib/listings";
import { computeMonthlyPayment } from "@/lib/financing";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function locationLabel(l: PublicListing): string {
  const parts: string[] = [];
  if (l.acreage != null) {
    parts.push(`${l.acreage} ${l.acreage === 1 ? "acre" : "acres"}`);
  }
  if (l.city) {
    parts.push(`${l.city}${l.state_code ? `, ${l.state_code}` : ""}`);
  } else if (l.county) {
    parts.push(`${l.county}${l.state_code ? `, ${l.state_code}` : ""}`);
  }
  return parts.join(" · ");
}

function truncate(s: string, max = 90): string {
  if (s.length <= max) return s;
  return s.slice(0, max).trimEnd() + "…";
}

export function ListingCard({ listing }: { listing: PublicListing }) {
  const isFinanced = listing.financing_available === true;
  const slug = listing.slug ?? listing.id;
  const summary =
    listing.lead_hook ??
    (listing.description ? truncate(listing.description) : null);

  // Combo (two side-by-side lots): show "From $<cheapest single lot>" with a
  // tag, so buyers see the low entry point and discover the options on-page.
  const isCombo =
    listing.listing_type === "combo" &&
    Array.isArray(listing.variants) &&
    listing.variants.length > 0;
  const singleVariants = isCombo
    ? listing.variants!.filter((v) => v.key !== "both")
    : [];
  const comboFinanced = singleVariants.some((v) => v.financing_available);
  // For a financed combo, lead with the cheapest single-lot monthly payment so
  // the card matches the other owner-financed listings.
  const singleMonthlies = singleVariants
    .filter((v) => v.financing_available)
    .map((v) =>
      Math.round(
        computeMonthlyPayment({
          financePrice: v.finance_price,
          cashPrice: v.cash_price,
          downPayment: v.down_payment,
          termMonths: v.term_months,
          annualRate: v.interest_rate,
        }),
      ),
    )
    .filter((n) => n > 0);
  const fromMonthly = singleMonthlies.length ? Math.min(...singleMonthlies) : 0;
  const singleCashPrices = singleVariants
    .map((v) => v.cash_price)
    .filter((n): n is number => n != null);
  const fromPrice = singleCashPrices.length
    ? Math.min(...singleCashPrices)
    : listing.cash_price ?? 0;

  return (
    <Link
      href={`/listings/${slug}`}
      className="group block overflow-hidden rounded-md border border-paper-edge bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <article>
        {/* Photo block */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-charcoal">
          {listing.main_image ? (
            <Image
              src={listing.main_image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-charcoal to-accent-deep" />
          )}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {isCombo && (
              <span className="inline-block rounded-sm bg-accent px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                2 Lots
              </span>
            )}
            {isFinanced ? (
              <span className="inline-block rounded-sm bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                Owner Financed
              </span>
            ) : (
              <span className="inline-block rounded-sm bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-paper">
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Content block */}
        <div className="p-5 md:p-6">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-muted">
            {locationLabel(listing) || "Location TBD"}
          </p>

          {isCombo ? (
            comboFinanced && fromMonthly > 0 ? (
              <p className="mb-1 font-serif text-[30px] font-bold leading-tight text-ink md:text-[36px]">
                From ${formatNumber(fromMonthly)}
                <span className="ml-1 text-[18px] font-normal text-ink-soft">
                  /mo
                </span>
              </p>
            ) : (
              <p className="mb-1 font-serif text-[30px] font-bold leading-tight text-ink md:text-[36px]">
                From ${formatNumber(fromPrice)}
              </p>
            )
          ) : isFinanced ? (
            <p className="mb-1 font-serif text-[30px] font-bold leading-tight text-ink md:text-[36px]">
              $
              {formatNumber(
                Math.round(
                  computeMonthlyPayment({
                    financePrice: listing.finance_price,
                    cashPrice: listing.cash_price,
                    downPayment: listing.down_payment,
                    termMonths: listing.term_months,
                    annualRate: listing.interest_rate,
                  }),
                ),
              )}
              <span className="ml-1 text-[18px] font-normal text-ink-soft">
                /mo
              </span>
            </p>
          ) : (
            <p className="mb-1 font-serif text-[30px] font-bold leading-tight text-ink md:text-[36px]">
              ${formatNumber(listing.cash_price ?? 0)}
            </p>
          )}

          <p className="mb-4 text-[13px] text-muted">
            {isCombo
              ? "2 lots · buy together or separately"
              : isFinanced
                ? `$${formatNumber(listing.down_payment ?? 0)} down · Cash $${formatNumber(listing.cash_price ?? 0)}${listing.finance_price != null ? ` · Finance $${formatNumber(listing.finance_price)}` : ""}`
                : "Cash sale"}
          </p>

          {summary && (
            <p className="mb-5 text-sm leading-[1.55] text-ink-soft">
              {summary}
            </p>
          )}

          <p className="font-serif text-sm font-medium text-accent transition-colors group-hover:text-accent-deep">
            View details →
          </p>
        </div>
      </article>
    </Link>
  );
}
