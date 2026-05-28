import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { getListingBySlug } from "@/lib/listings";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { Gallery } from "@/components/listings/detail/gallery";
import { TitleBlock } from "@/components/listings/detail/title-block";
import { AboutSection } from "@/components/listings/detail/about-section";
import { FinancingCalculator } from "@/components/listings/detail/financing-calculator";
import { LocationSection } from "@/components/listings/detail/location-section";
import { BestUses } from "@/components/listings/detail/best-uses";
import { HowFinancingWorks } from "@/components/listings/detail/how-financing-works";
import { Testimonials } from "@/components/listings/detail/testimonials";
import { LeadForm } from "@/components/listings/detail/lead-form";
import { FinalCtaStrip } from "@/components/listings/detail/final-cta-strip";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (process.env.NEXT_PUBLIC_LOTLINKUP_DEMO === "1") {
    return DEMO_LISTINGS.filter(
      (l): l is typeof l & { slug: string } => l.slug !== null,
    ).map((l) => ({ slug: l.slug }));
  }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: { absolute: "Listing not found · LotLinkUp" } };

  const place =
    listing.city && listing.state_code
      ? `${listing.city}, ${listing.state_code}`
      : (listing.state ?? "");
  const acreageStr =
    listing.acreage != null ? `${listing.acreage} acres` : "Lot";
  const titleStem = `${acreageStr} in ${place}`.trim();

  return {
    title: { absolute: `${titleStem} | LotLinkUp` },
    description:
      listing.lead_hook ??
      (listing.description ? listing.description.slice(0, 160) : undefined),
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || null;
  const isFinanced = listing.financing_available === true;

  const slides =
    listing.gallery && listing.gallery.length > 0
      ? listing.gallery
      : listing.main_image
        ? [listing.main_image]
        : ["placeholder-1"];

  const place =
    listing.city && listing.state_code
      ? `${listing.city}, ${listing.state_code}`
      : (listing.state ?? "this lot");
  const prefilledMessage = `I'm interested in ${
    listing.acreage != null ? `${listing.acreage} acres in ` : ""
  }${place}.`;

  return (
    <div className="bg-paper pb-16 lg:pb-24">
      {/* Gallery hero */}
      <div className="bg-paper py-8 md:py-12">
        <Container size="wide">
          <Gallery
            slides={slides}
            badge={isFinanced ? "OWNER FINANCED" : "PREMIUM"}
          />
        </Container>
      </div>

      {/* Title block */}
      <Container>
        <div className="pt-4 md:pt-8">
          <TitleBlock listing={listing} phone={phone} />
        </div>

        {/* About */}
        <div className="mt-16 md:mt-24">
          <AboutSection listing={listing} />
        </div>

        {/* Calculator (financed only) */}
        {isFinanced && listing.cash_price != null && (
          <div className="mt-16 md:mt-24">
            <FinancingCalculator
              financePrice={listing.finance_price ?? listing.cash_price}
              cashPrice={listing.cash_price}
              minDownPayment={listing.down_payment ?? 0}
              defaultTermMonths={listing.term_months ?? 60}
              annualRate={listing.interest_rate ?? 0}
            />
          </div>
        )}

        {/* Location */}
        <div className="mt-16 md:mt-24">
          <LocationSection listing={listing} />
        </div>

        {/* Best uses */}
        {listing.best_use_cases && (
          <div className="mt-16 md:mt-24">
            <BestUses raw={listing.best_use_cases} />
          </div>
        )}

        {/* How financing works (financed only) */}
        {isFinanced && (
          <div className="mt-16 md:mt-24">
            <HowFinancingWorks />
          </div>
        )}

        {/* Testimonials (conditional) */}
        <div className="mt-16 md:mt-24">
          <Testimonials />
        </div>

        {/* Lead form */}
        <div className="mt-16 md:mt-24">
          <LeadForm prefilledMessage={prefilledMessage} phone={phone} />
        </div>

        {/* Back link */}
        <div className="mt-12 md:mt-16">
          <Link
            href="/land-for-sale"
            className="text-sm text-ink-soft transition-colors hover:text-accent"
          >
            ← Back to all listings
          </Link>
        </div>
      </Container>

      {/* Final CTA strip — full bleed */}
      <div className="mt-16 md:mt-24">
        <FinalCtaStrip phone={phone} />
      </div>
    </div>
  );
}
