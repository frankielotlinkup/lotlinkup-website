// Amortization runs on the seller-finance principal: financePrice - downPayment.
// cashPrice is the discounted price for an all-cash buyer and is *not* the
// basis for monthly payments. Old/cash-only rows that don't carry a
// finance_price fall back to cashPrice so the page still renders something
// sane — but for any lot we actually finance, finance_price must be set.

export function computeMonthlyPayment({
  financePrice,
  cashPrice,
  downPayment,
  termMonths,
  annualRate,
}: {
  financePrice: number | null | undefined;
  cashPrice: number | null | undefined;
  downPayment: number | null | undefined;
  termMonths: number | null | undefined;
  annualRate: number | null | undefined;
}): number {
  const price = financePrice ?? cashPrice ?? 0;
  const down = downPayment ?? 0;
  const term = termMonths ?? 0;
  const rate = annualRate ?? 0;
  const principal = Math.max(0, price - down);
  if (principal === 0 || term <= 0) return 0;
  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) return principal / term;
  const factor = Math.pow(1 + monthlyRate, term);
  return (principal * monthlyRate * factor) / (factor - 1);
}

// Standard offered terms; the calculator surfaces only those ≤ the listing's
// max term_months so we don't advertise a length we don't offer.
export const STANDARD_TERMS: number[] = [24, 36, 48, 60, 72, 84];

export function termsForListing(maxTermMonths: number | null | undefined): number[] {
  const max = maxTermMonths ?? 0;
  if (max <= 0) return [];
  const within = STANDARD_TERMS.filter((t) => t <= max);
  return within.includes(max) ? within : [...within, max];
}
