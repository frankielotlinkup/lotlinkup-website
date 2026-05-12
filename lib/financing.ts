// Standard amortization formula. cash_price/down_payment/term/rate are the
// source of truth — any precomputed monthly_payment from CRM/property-info.md
// is ignored on the website so the card, detail page header, map popup, and
// calculator all show the same number.

export function computeMonthlyPayment({
  cashPrice,
  downPayment,
  termMonths,
  annualRate,
}: {
  cashPrice: number | null | undefined;
  downPayment: number | null | undefined;
  termMonths: number | null | undefined;
  annualRate: number | null | undefined;
}): number {
  const price = cashPrice ?? 0;
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
