import { Container } from "@/components/container";

export default function HomePage() {
  return (
    <>
      <section className="-mt-16 bg-ink text-white">
        <Container size="wide">
          <div className="flex min-h-[80vh] flex-col items-center justify-center py-32 text-center lg:py-40">
            <h1 className="type-display text-accent">Lot Linkup</h1>
            <p className="type-body mt-6 max-w-xl text-white/80 lg:text-lg">
              Rural land for sale, nationwide. Site coming soon.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <Container>
          <p className="type-body text-ink-soft text-center">
            We&apos;ll build the homepage out in Step 5.
          </p>
        </Container>
      </section>
    </>
  );
}
