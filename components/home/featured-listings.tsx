import Link from "next/link";
import { Container } from "@/components/container";
import { ListingCard } from "@/components/listings/listing-card";
import type { PublicListing } from "@/lib/listings";

export function FeaturedListings({
  listings,
}: {
  listings: PublicListing[];
}) {
  if (listings.length === 0) return null;

  return (
    <section className="bg-paper-warm py-16 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="type-caption text-accent mb-4">NEWEST LISTINGS</p>
          <h2 className="font-serif text-[30px] font-normal tracking-[-0.01em] text-ink md:text-[40px]">
            Lots ready to move on.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-soft">
            A look at our newest listings &mdash; financed and outright.{" "}
            <Link
              href="/land-for-sale"
              className="text-accent underline underline-offset-2 transition-colors hover:text-accent-deep"
            >
              See all available lots →
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/land-for-sale"
            className="inline-flex items-center justify-center rounded-md border-[1.5px] border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            View all listings →
          </Link>
        </div>
      </Container>
    </section>
  );
}
