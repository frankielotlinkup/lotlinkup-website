import Link from "next/link";

const STEPS = [
  {
    title: "We close fast",
    body: "Around 3 weeks or less. No banks, no underwriting drama.",
  },
  {
    title: "Use the land from day one",
    body: "Build, camp, hold — it's yours to use the moment closing is done. Title transfers at closing or at payoff, depending on the structure we use.",
  },
  {
    title: "Make monthly payments",
    body: "Pay online or by check, on a schedule that works for you. Once paid in full, you're free and clear.",
  },
];

export function HowFinancingWorks() {
  return (
    <section className="bg-paper">
      <h2 className="type-h2">How financing works</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-md border border-paper-edge bg-white p-6"
          >
            <p className="font-serif text-[20px] font-normal text-ink">
              {s.title}
            </p>
            <p className="mt-3 text-sm leading-[1.6] text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        We do not run credit checks. We work with you on terms.{" "}
        <Link
          href="/how-it-works"
          className="text-accent underline underline-offset-2 transition-colors hover:text-accent-deep"
        >
          Read more about how it works.
        </Link>
      </p>
    </section>
  );
}
