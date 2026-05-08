import type { Metadata } from "next";
import { getPublishedListings } from "@/lib/listings";
import { Hero } from "@/components/home/hero";
import { LiveUsMapSection } from "@/components/home/live-us-map-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { ValueProps } from "@/components/home/value-props";
import { HowItWorksTeaser } from "@/components/home/how-it-works-teaser";
import { HomeFinalCta } from "@/components/home/final-cta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Lot Linkup — Rural land for sale, with financing",
  },
  description:
    "We buy raw land in good country and sell it direct, with seller financing built in. No banks, no realtors, no nonsense.",
  openGraph: {
    title: "Lot Linkup — Rural land for sale, with financing",
    description:
      "We buy raw land in good country and sell it direct, with seller financing built in. No banks, no realtors, no nonsense.",
    type: "website",
    siteName: "Lot Linkup",
    images: ["/images/hero-lake-texoma.jpg"],
  },
};

export default async function HomePage() {
  const listings = await getPublishedListings();
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || null;
  const newestThree = listings.slice(0, 3);

  return (
    <>
      <Hero />
      <LiveUsMapSection listings={listings} />
      <FeaturedListings listings={newestThree} />
      <ValueProps />
      <HowItWorksTeaser />
      <HomeFinalCta phone={phone} />
    </>
  );
}
