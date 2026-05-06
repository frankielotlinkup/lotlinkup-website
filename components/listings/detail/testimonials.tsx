import { TESTIMONIALS } from "@/lib/testimonials";

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-paper">
      <h2 className="type-h2">What buyers say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="rounded-md bg-paper-warm p-8"
          >
            <blockquote>
              <p className="font-serif text-[22px] italic leading-[1.45] text-ink">
                “{t.quote}”
              </p>
            </blockquote>
            <figcaption className="mt-5 text-sm text-ink-soft">
              <span className="font-medium text-ink">{t.name}</span>
              <span className="mx-1.5 text-muted">·</span>
              <span>{t.location}</span>
              <span className="mx-1.5 text-muted">·</span>
              <span className="text-muted">{t.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
