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
          <div className="absolute left-3 top-3">
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

          {isFinanced ? (
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
            {isFinanced
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
