import Link from "next/link";
import { Container } from "@/components/container";

export function HowItWorksTeaser() {
  return (
    <section className="bg-paper-warm py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-[20px] italic leading-[1.5] text-ink md:text-[24px]">
            “Buy with cash, or pay monthly with seller financing. Either way,
            the closing is straightforward and the land is yours fast.”
          </p>
          <Link
            href="/how-it-works"
            className="mt-6 inline-block text-base text-accent underline underline-offset-2 transition-colors hover:text-accent-deep"
          >
            Learn how it works →
          </Link>
        </div>
      </Container>
    </section>
  );
}
