"use client";

import { useMemo, useState } from "react";

const TERMS = [24, 36, 48, 60] as const;
type Term = (typeof TERMS)[number];

function fmtUSD(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function computeMonthly({
  cashPrice,
  downPayment,
  termMonths,
  annualRate,
}: {
  cashPrice: number;
  downPayment: number;
  termMonths: number;
  annualRate: number;
}): number {
  const principal = Math.max(0, cashPrice - downPayment);
  if (principal === 0 || termMonths <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function snap(value: number, step: number, min: number, max: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  const snapped = Math.round((clamped - min) / step) * step + min;
  return Math.min(max, Math.max(min, snapped));
}

export function FinancingCalculator({
  cashPrice,
  minDownPayment,
  defaultTermMonths,
  annualRate,
}: {
  cashPrice: number;
  minDownPayment: number;
  defaultTermMonths: number;
  annualRate: number;
}) {
  const sliderMax = Math.max(minDownPayment, Math.round(cashPrice * 0.7));
  const initialTerm = (TERMS as readonly number[]).includes(defaultTermMonths)
    ? (defaultTermMonths as Term)
    : 60;

  const [downPayment, setDownPayment] = useState(minDownPayment);
  const [term, setTerm] = useState<Term>(initialTerm);

  const monthly = useMemo(
    () =>
      computeMonthly({
        cashPrice,
        downPayment,
        termMonths: term,
        annualRate,
      }),
    [cashPrice, downPayment, term, annualRate],
  );
  const monthlyRounded = Math.round(monthly);
  const totalPayments = monthlyRounded * term;
  const totalInterest = Math.max(
    0,
    totalPayments - (cashPrice - downPayment),
  );

  return (
    <section className="bg-paper">
      <h2 className="type-h2">Run your numbers</h2>
      <p className="mt-3 text-base text-ink-soft">
        Adjust the down payment and term to find what works for you.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
        {/* Controls */}
        <div className="rounded-md border border-paper-edge bg-white p-6 md:p-8">
          <div>
            <p className="type-caption text-muted">Down payment</p>
            <p className="mt-2 font-serif text-[36px] font-normal tracking-[-0.01em] text-ink">
              {fmtUSD(downPayment)}
            </p>
            <input
              type="range"
              min={minDownPayment}
              max={sliderMax}
              step={500}
              value={downPayment}
              onChange={(e) =>
                setDownPayment(
                  snap(Number(e.target.value), 500, minDownPayment, sliderMax),
                )
              }
              aria-label="Down payment"
              className="mt-4 w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>{fmtUSD(minDownPayment)}</span>
              <span>{fmtUSD(sliderMax)}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="type-caption text-muted">Term</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {TERMS.map((t) => {
                const active = t === term;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    aria-pressed={active}
                    className={
                      active
                        ? "rounded-md bg-ink py-2 text-sm font-medium text-paper"
                        : "rounded-md border border-paper-edge bg-paper-warm py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-edge"
                    }
                  >
                    {t} mo
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-sm text-muted">
            Interest rate: {annualRate}% APR
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-md border border-paper-edge bg-white p-6 md:p-8">
          <p className="type-caption text-muted">Estimated monthly</p>
          <p className="mt-2 font-serif text-[40px] font-bold leading-tight text-ink md:text-[48px]">
            {fmtUSD(monthlyRounded)}
            <span className="ml-1 text-[20px] font-normal text-ink-soft md:text-[22px]">
              /mo
            </span>
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {term}-month term at {annualRate}% APR
          </p>
          <p className="mt-6 text-xs leading-[1.55] text-muted">
            Total of payments over the term: {fmtUSD(totalPayments)}. Interest
            paid: {fmtUSD(totalInterest)}.
          </p>
          <a
            href="#lead-form"
            className="mt-8 block w-full rounded-md bg-accent px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Apply for this lot
          </a>
        </div>
      </div>
    </section>
  );
}
