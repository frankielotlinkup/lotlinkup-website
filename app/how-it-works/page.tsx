import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How seller financing works at Lot Linkup — no credit checks, low down payments, and a clear path to owning rural land.",
};

const STEPS = [
  {
    n: "01",
    title: "Find a lot you like",
    body: "Browse the listings page or look at the map. Every lot is owned outright by us — what you see is what's available right now. The card shows the cash price, the minimum down, and the monthly payment if you finance it.",
  },
  {
    n: "02",
    title: "Send us your name and a good mailing address",
    body: "That's all we need to get started. No credit pull, no income statements, no employment history. Just enough to put your name on a purchase agreement.",
  },
  {
    n: "03",
    title: "Sign the purchase agreement",
    body: "We send it to you via DocuSign. Read it, sign it, and the deal is in motion. Once the agreement is signed, we coordinate with the closing attorney to draft the financing paperwork.",
  },
  {
    n: "04",
    title: "Close with the attorney",
    body: "Closing usually takes two to three weeks, depending on the attorney's schedule. You pay the down payment at closing. Once closing is complete, the lot is yours to use — build, camp, hold, whatever you want — while you make monthly payments.",
  },
  {
    n: "05",
    title: "Make your payments. Own the land outright at the end.",
    body: "Monthly payments are auto-drafted or paid however we agree. When the loan is paid off, you own the property free and clear with full deed in hand.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-paper pb-16 lg:pb-24">
      {/* Header */}
      <section className="bg-paper pt-16 lg:pt-24">
        <Container>
          <header className="max-w-3xl">
            <p className="type-caption text-muted">
              SELLER FINANCING, PLAINLY EXPLAINED
            </p>
            <h1 className="type-h1 mt-3">
              Land you can finance directly with us.
            </h1>
            <p className="type-body text-ink-soft mt-6 max-w-2xl">
              We own every lot we list and we finance every lot we sell. No
              banks, no credit checks, no jumping through hoops. Just rural
              land, a clear monthly payment, and a clear path to owning it
              outright.
            </p>
          </header>
        </Container>
      </section>

      {/* Why seller financing */}
      <section className="mt-16 lg:mt-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            <div>
              <p className="type-caption text-muted">No credit checks</p>
              <p className="type-body text-ink-soft mt-3">
                We don&apos;t pull your credit. We don&apos;t care about your
                score. Your history is your business; the land is what we
                care about.
              </p>
            </div>
            <div>
              <p className="type-caption text-muted">Low down payments</p>
              <p className="type-body text-ink-soft mt-3">
                Whatever&apos;s listed on the property page is the minimum
                down. On most lots that&apos;s well under 10% — sometimes
                just a few hundred dollars to lock it in.
              </p>
            </div>
            <div>
              <p className="type-caption text-muted">No prepayment penalty</p>
              <p className="type-body text-ink-soft mt-3">
                Pay it off whenever you want. Six months in, six years in,
                doesn&apos;t matter. The interest stops when the balance
                does.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* The steps */}
      <section className="mt-20 lg:mt-28">
        <Container>
          <h2 className="type-h2 max-w-2xl">
            What buying a lot actually looks like.
          </h2>
          <div className="mt-12 grid gap-10 lg:gap-12">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="grid gap-4 md:grid-cols-[80px_1fr] md:gap-10"
              >
                <p className="font-mono text-sm text-accent">{step.n}</p>
                <div>
                  <h3 className="font-serif text-2xl font-normal tracking-tight text-ink md:text-[28px]">
                    {step.title}
                  </h3>
                  <p className="type-body text-ink-soft mt-3 max-w-2xl">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The two structures */}
      <section className="mt-20 lg:mt-28">
        <Container>
          <h2 className="type-h2 max-w-2xl">
            Two ways we structure the deal.
          </h2>
          <p className="type-body text-ink-soft mt-4 max-w-2xl">
            Which one we use depends on the state the property is in and, in
            some cases, what the original seller prefers. Both end the same
            way: you own the land outright when the loan is paid off.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="rounded-md border border-paper-edge bg-white p-7 md:p-8">
              <p className="type-caption text-muted">Default</p>
              <h3 className="mt-2 font-serif text-2xl font-normal tracking-tight text-ink md:text-[28px]">
                Contract for deed
              </h3>
              <p className="type-body text-ink-soft mt-4">
                In states that allow it, this is what we offer first.
                It&apos;s the fastest, simplest way to get you on the land.
                We hold the title while you make payments; the deed transfers
                to your name once the loan is fully paid off. You get full
                use of the property the moment closing is done.
              </p>
            </div>

            <div className="rounded-md border border-paper-edge bg-white p-7 md:p-8">
              <p className="type-caption text-muted">Alternate</p>
              <h3 className="mt-2 font-serif text-2xl font-normal tracking-tight text-ink md:text-[28px]">
                Deed of trust
              </h3>
              <p className="type-body text-ink-soft mt-4">
                In states with restrictions on contract-for-deed sales — or
                when the seller wants the deed in your hands while you pay —
                we use a deed of trust. Title transfers to you at closing
                with a lien recorded for the balance. Same monthly payments,
                same end result, slightly different paperwork. Most of our
                financed properties right now use this structure.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="mt-20 lg:mt-28">
        <Container>
          <div className="rounded-md bg-ink px-8 py-12 text-center md:px-12 md:py-16">
            <h2 className="font-serif text-3xl font-normal tracking-tight text-paper md:text-[40px]">
              Ready to look at what we have?
            </h2>
            <p className="type-body mt-4 max-w-xl text-paper/80 mx-auto">
              Every active lot, every state we&apos;re in, on one page.
            </p>
            <Link
              href="/land-for-sale"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              Browse Land for Sale
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
