import { getPublishedListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

function formatPrice(value: number | null) {
  if (value == null) return "—";
  return `$${value.toLocaleString("en-US")}`;
}

export default async function Home() {
  const listings = await getPublishedListings();

  return (
    <main className="min-h-screen bg-[#0F1B2A] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-[#0F6E56] sm:text-7xl">
            Lot Linkup
          </h1>
          <p className="mt-6 text-lg text-white/80 sm:text-xl">
            Rural land for sale, nationwide. Site coming soon.
          </p>
        </header>

        <section className="mt-16 border-t border-white/10 pt-8">
          <h2 className="text-xs uppercase tracking-widest text-white/50">
            Debug: published listings ({listings.length})
          </h2>
          {listings.length === 0 ? (
            <p className="mt-4 text-white/70">No published listings yet.</p>
          ) : (
            <ul className="mt-4 space-y-2 font-mono text-sm text-white/90">
              {listings.map((l) => (
                <li key={l.id}>
                  {l.city ?? "—"}, {l.state_code ?? "—"} ·{" "}
                  {l.acreage ?? "—"} ac · {l.slug ?? "—"} ·{" "}
                  {formatPrice(l.cash_price)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
