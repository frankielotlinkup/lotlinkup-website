import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How seller financing works at Lot Linkup.",
};

const SECTIONS = [
  {
    title: "Why we offer financing",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "What you’ll need",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "Closing the deal",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <header className="max-w-3xl">
          <h1 className="type-h1">How seller financing works.</h1>
        </header>
        <div className="mt-12 lg:mt-16 grid gap-12 lg:gap-16">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="type-h2">{section.title}</h2>
              <p className="type-body text-ink-soft mt-4 max-w-2xl">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
