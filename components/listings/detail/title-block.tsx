import type { PublicListing } from "@/lib/listings";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatPhoneHref(raw: string): string {
  return `tel:${raw.replace(/[^+0-9]/g, "")}`;
}

function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

export function TitleBlock({
  listing,
  phone,
}: {
  listing: PublicListing;
  phone: string | null;
}) {
  const isFinanced = listing.financing_available === true;
  const place =
    listing.city && listing.state_code
      ? `${listing.city}, ${listing.state_code}`
      : listing.state ?? "—";
  const eyebrow = [listing.state, listing.county]
    .filter(Boolean)
    .join(" · ");
  const headline =
    listing.acreage != null
      ? `${listing.acreage} acres in ${place}`
      : `Lot in ${place}`;

  const directionsHref = listing.google_maps_url
    ? listing.google_maps_url
    : listing.latitude != null && listing.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`
      : "#location";
  const directionsIsExternal = directionsHref.startsWith("http");

  return (
    <section className="bg-paper">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12">
        {/* Left column — text */}
        <div className="md:col-span-3">
          {eyebrow && (
            <p className="type-caption text-muted mb-4">{eyebrow}</p>
          )}
          <h1 className="font-serif text-[36px] font-normal tracking-[-0.01em] leading-[1.1] text-ink md:text-[48px]">
            {headline}
          </h1>
          {listing.lead_hook && (
            <p className="mt-5 text-[18px] leading-[1.55] text-ink-soft">
              {listing.lead_hook}
            </p>
          )}
          <div className="mt-6">
            {isFinanced ? (
              <span className="inline-block rounded-sm bg-paper-warm px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                Owner Financed
              </span>
            ) : (
              <span className="inline-block rounded-sm bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-paper">
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Right column — CTA card */}
        <aside className="md:col-span-2">
          <div className="rounded-md border border-paper-edge bg-white p-6 md:p-8">
            {isFinanced ? (
              <>
                <p className="font-serif text-[40px] font-bold leading-tight text-ink md:text-[48px]">
                  ${formatNumber(listing.monthly_payment ?? 0)}
                  <span className="ml-1 text-[20px] font-normal text-ink-soft md:text-[22px]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  ${formatNumber(listing.cash_price ?? 0)} cash · $
                  {formatNumber(listing.down_payment ?? 0)} down ·{" "}
                  {listing.term_months ?? 0} months
                </p>
              </>
            ) : (
              <>
                <p className="font-serif text-[40px] font-bold leading-tight text-ink md:text-[48px]">
                  ${formatNumber(listing.cash_price ?? 0)}
                </p>
                <p className="mt-2 text-sm text-ink-soft">Cash sale</p>
              </>
            )}

            <hr className="my-6 border-paper-edge" />

            {phone && (
              <div className="mb-6">
                <p className="type-caption text-muted mb-1">Call or text</p>
                <a
                  href={formatPhoneHref(phone)}
                  className="font-serif text-[22px] text-ink hover:text-accent transition-colors"
                >
                  {formatPhoneDisplay(phone)}
                </a>
              </div>
            )}

            <a
              href="#lead-form"
              className="block w-full rounded-md bg-accent px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Request Details
            </a>
            <a
              href={directionsHref}
              {...(directionsIsExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="mt-3 block w-full rounded-md border border-ink px-4 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Get Directions
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
