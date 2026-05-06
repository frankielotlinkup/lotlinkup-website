export function BestUses({ raw }: { raw: string | null }) {
  if (!raw) return null;
  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section className="bg-paper">
      <h2 className="type-h2">What you can build here</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-paper-warm px-4 py-3 text-center text-sm text-ink"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
