"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import type { PublicListing, ListingVariant } from "@/lib/listings";
import { Gallery } from "./gallery";
import { TitleBlock } from "./title-block";
import { AboutSection } from "./about-section";
import { FinancingCalculator } from "./financing-calculator";

// Overlay the selected variant onto the base listing so we can reuse the
// existing (variant-unaware) TitleBlock / AboutSection / Gallery / calculator
// components unchanged. Anything the variant doesn't specify falls back to the
// base row.
function mergeVariant(base: PublicListing, v: ListingVariant): PublicListing {
  return {
    ...base,
    acreage: v.acreage ?? base.acreage,
    cash_price: v.cash_price ?? base.cash_price,
    finance_price: v.finance_price,
    financing_available: v.financing_available,
    down_payment: v.down_payment,
    monthly_payment: v.monthly_payment,
    term_months: v.term_months,
    interest_rate: v.interest_rate,
    apn: v.apn ?? base.apn,
    description: v.description ?? base.description,
    lead_hook: v.lead_hook ?? base.lead_hook,
    main_image: v.main_image ?? base.main_image,
    gallery: v.gallery && v.gallery.length > 0 ? v.gallery : base.gallery,
  };
}

function money(n: number | null): string {
  return n != null ? `$${n.toLocaleString("en-US")}` : "";
}

export function ComboHero({
  base,
  variants,
  phone,
}: {
  base: PublicListing;
  variants: ListingVariant[];
  phone: string | null;
}) {
  const [idx, setIdx] = useState(0);
  const selected = variants[idx];
  const merged = mergeVariant(base, selected);
  const isFinanced = merged.financing_available === true;

  const gallery = merged.gallery ?? [];
  const slides = merged.main_image
    ? [merged.main_image, ...gallery.filter((u) => u !== merged.main_image)]
    : gallery.length > 0
      ? gallery
      : ["placeholder-1"];

  // Savings shown only on the "both" option: sum of the single-lot cash prices
  // minus the both-together cash price, when every piece is priced.
  const both = variants[0];
  const singles = variants.slice(1);
  const singlesPriced = singles.every((s) => s.cash_price != null);
  const singleSum = singles.reduce((sum, s) => sum + (s.cash_price ?? 0), 0);
  const savings =
    both.cash_price != null && singlesPriced && singleSum > both.cash_price
      ? singleSum - both.cash_price
      : 0;

  return (
    <>
      <div className="bg-paper py-8 md:py-12">
        <Container size="wide">
          <div className="mb-6">
            <p className="type-caption text-muted mb-3">
              Two adjoining lots — buy them together or one at a time
            </p>
            <div
              role="tablist"
              aria-label="Choose what to buy"
              className="flex flex-col gap-3 sm:flex-row"
            >
              {variants.map((v, i) => {
                const active = i === idx;
                return (
                  <button
                    key={v.key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`flex-1 rounded-md border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      active
                        ? "border-accent bg-white text-ink ring-1 ring-accent"
                        : "border-paper-edge bg-white text-ink-soft hover:border-ink"
                    }`}
                  >
                    <span className="block text-sm font-medium">{v.label}</span>
                    <span className="block text-[13px] text-muted">
                      {v.acreage != null ? `${v.acreage} ac · ` : ""}
                      {money(v.cash_price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {idx === 0 && savings > 0 && (
            <p className="mb-4 inline-block rounded-sm bg-paper-warm px-3 py-1.5 text-[13px] font-medium text-ink">
              Save {money(savings)} versus buying the lots separately
            </p>
          )}

          <Gallery
            slides={slides}
            badge={isFinanced ? "OWNER FINANCED" : "PREMIUM"}
          />
        </Container>
      </div>

      <Container>
        <div className="pt-4 md:pt-8">
          <TitleBlock listing={merged} phone={phone} />
        </div>

        <div className="mt-16 md:mt-24">
          <AboutSection listing={merged} />
        </div>

        {isFinanced && merged.cash_price != null && (
          <div className="mt-16 md:mt-24">
            <FinancingCalculator
              financePrice={merged.finance_price ?? merged.cash_price}
              cashPrice={merged.cash_price}
              minDownPayment={merged.down_payment ?? 0}
              defaultTermMonths={merged.term_months ?? 60}
              annualRate={merged.interest_rate ?? 0}
            />
          </div>
        )}
      </Container>
    </>
  );
}
