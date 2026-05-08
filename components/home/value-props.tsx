import { Container } from "@/components/container";
import { SectionTitle } from "@/components/section-title";

const ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function DollarSignIcon() {
  return (
    <svg {...ICON_PROPS}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const BLOCKS = [
  {
    Icon: DollarSignIcon,
    title: "Financing without the bank.",
    body: "Most rural land buyers get told no when they walk into a bank. We say yes — small down payment, monthly payments, the deed transfers when you put your money down. The land is yours from day one.",
  },
  {
    Icon: ClockIcon,
    title: "Honest deals, closed fast.",
    body: "We work with experienced land attorneys and title companies who know how to move quickly. Most closings take three weeks or less. No hidden fees, no surprises, no chasing paperwork.",
  },
  {
    Icon: MapPinIcon,
    title: "Listings you can trust.",
    body: "Every property goes through deep research before we list it — road access, zoning, drive times, what's nearby. By the time a lot reaches the website, you already have answers to the questions buyers actually care about. No surprises after you sign.",
  },
];

export function ValueProps() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="WHY LOT LINKUP"
          headline="Why buy land from us."
          align="center"
          variant="light"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-12">
          {BLOCKS.map(({ Icon, title, body }) => (
            <div key={title}>
              <span className="text-accent">
                <Icon />
              </span>
              <h3 className="mt-5 font-serif text-[24px] font-bold leading-[1.2] text-ink">
                {title}
              </h3>
              <p className="mt-3 text-base leading-[1.6] text-ink-soft">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
