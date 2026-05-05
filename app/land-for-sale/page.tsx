import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getPublishedListings, type PublicListing } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Land for Sale",
  description: "Browse our active rural land listings.",
};

function formatPrice(value: number | null) {
  if (value == null) return "Price on request";
  return `$${value.toLocaleString("en-US")}`;
}

function ListingRow({ listing }: { listing: PublicListing }) {
  const place =
    listing.city && listing.state_code
      ? `${listing.city}, ${listing.state_code}`
      : listing.state ?? "Location TBD";
  return (
    <li className="rounded-lg border border-paper-edge bg-white p-6 transition-colors hover:border-accent/40">
      <h2 className="type-h3">{place}</h2>
      <p className="type-small text-ink-soft mt-2">
        {listing.acreage != null ? `${listing.acreage} acres` : "Acreage TBD"}
        {" · "}
        {formatPrice(listing.cash_price)}
      </p>
      {listing.lead_hook && (
        <p className="type-body text-ink-soft mt-3">{listing.lead_hook}</p>
      )}
    </li>
  );
}

export default async function LandForSalePage() {
  const listings = await getPublishedListings();

  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <header className="max-w-3xl">
          <h1 className="type-h1">Land for Sale</h1>
          <p className="type-body text-ink-soft mt-4">
            Browse our active rural land listings.
          </p>
        </header>

        <section className="mt-12 lg:mt-16">
          {listings.length === 0 ? (
            <div className="rounded-lg border border-paper-edge bg-white p-8">
              <p className="type-body text-ink-soft">
                No active listings right now. Check back soon, or{" "}
                <Link
                  href="/contact"
                  className="text-accent underline underline-offset-2 hover:text-accent-deep"
                >
                  contact us
                </Link>{" "}
                to be notified when new lots come available.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {listings.map((l) => (
                <ListingRow key={l.id} listing={l} />
              ))}
            </ul>
          )}
        </section>
      </Container>
    </div>
  );
}
