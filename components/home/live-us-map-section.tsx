import Link from "next/link";
import { Container } from "@/components/container";
import type { PublicListing } from "@/lib/listings";
import { LiveUsMap, type Pin } from "./live-us-map";

function toPin(l: PublicListing): Pin | null {
  if (l.latitude == null || l.longitude == null || !l.slug) return null;
  return {
    id: l.id,
    slug: l.slug,
    lat: l.latitude,
    lng: l.longitude,
    acreage: l.acreage,
    city: l.city,
    state_code: l.state_code,
    financing_available: l.financing_available,
    cash_price: l.cash_price,
    monthly_payment: l.monthly_payment,
  };
}

export function LiveUsMapSection({
  listings,
}: {
  listings: PublicListing[];
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const pins = listings
    .map(toPin)
    .filter((p): p is Pin => p !== null);

  return (
    <section className="bg-paper py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="type-caption text-accent mb-4">OUR INVENTORY</p>
          <h2 className="font-serif text-[30px] font-normal tracking-[-0.01em] text-ink md:text-[40px]">
            Land all across the country.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            Click a pin to see the lot. Every property listed, every state
            we&apos;re in, on one map.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-md border border-paper-edge">
          {!token ? (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-paper-warm px-6 text-center md:aspect-[16/9]">
              <p className="text-base text-ink-soft">
                Map loading. Use the listings page to browse all lots.
              </p>
              <Link
                href="/land-for-sale"
                className="mt-5 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
              >
                Browse Land for Sale
              </Link>
            </div>
          ) : pins.length === 0 ? (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-paper-warm px-6 text-center md:aspect-[16/9]">
              <p className="max-w-md text-base text-ink-soft">
                We&apos;re refreshing inventory. Check back soon, or{" "}
                <Link
                  href="/contact"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-accent-deep"
                >
                  contact us
                </Link>{" "}
                to be notified.
              </p>
            </div>
          ) : (
            <div className="aspect-[4/3] w-full md:aspect-[16/9]">
              <LiveUsMap pins={pins} token={token} />
            </div>
          )}
        </div>

        {token && pins.length > 0 && (
          <p className="mt-3 text-center text-xs text-muted">
            Hold ⌘ or Ctrl while scrolling to zoom
          </p>
        )}
      </Container>
    </section>
  );
}
