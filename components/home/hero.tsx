import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";

export function Hero() {
  return (
    <section className="relative -mt-16 flex h-[80vh] min-h-[600px] flex-col justify-end overflow-hidden bg-ink md:min-h-[720px]">
      {/* Photo */}
      <Image
        src="/images/hero-lake-texoma.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dark gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/45"
      />

      {/* Content — bottom-aligned with bottom padding */}
      <div className="relative z-10 pb-20 md:pb-24">
        <Container>
          <p className="type-caption text-paper-warm/85">
            RURAL LAND, NATIONWIDE
          </p>
          <h1 className="mt-4 max-w-[720px] font-serif text-[44px] font-bold leading-[1.05] tracking-[-0.01em] text-paper md:text-[64px]">
            Rural land, made accessible.
          </h1>
          <p className="mt-5 max-w-[580px] text-base leading-[1.55] text-paper/90 md:text-[18px]">
            We buy raw land in good country and sell it direct &mdash; with
            seller financing built in. No banks, no realtors, no nonsense.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/land-for-sale"
              className="inline-flex items-center justify-center rounded-md bg-accent px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Browse Land for Sale
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-md border-[1.5px] border-paper bg-transparent px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              How It Works
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}
