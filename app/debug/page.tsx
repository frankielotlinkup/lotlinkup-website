import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getPublishedListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug",
  robots: { index: false, follow: false },
};

function formatPrice(value: number | null) {
  if (value == null) return "—";
  return `$${value.toLocaleString("en-US")}`;
}

export default async function DebugPage() {
  const listings = await getPublishedListings();

  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <h1 className="type-h1">Debug</h1>
        <p className="type-small text-ink-soft mt-2">
          Hidden from indexing. Used to verify the Supabase data path.
        </p>
        <section className="mt-10">
          <h2 className="type-caption text-ink-soft">
            Published listings ({listings.length})
          </h2>
          {listings.length === 0 ? (
            <p className="type-body text-ink-soft mt-4">
              No published listings yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3 font-mono text-sm text-ink">
              {listings.map((l) => (
                <li key={l.id}>
                  {l.city ?? "—"}, {l.state_code ?? "—"} ·{" "}
                  {l.acreage ?? "—"} ac · {l.slug ?? "—"} ·{" "}
                  {formatPrice(l.cash_price)}
                  <details className="mt-1.5">
                    <summary className="cursor-pointer text-xs text-muted hover:text-ink">
                      Raw row JSON
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-md border border-paper-edge bg-white p-3 text-xs leading-relaxed">
                      {JSON.stringify(l, null, 2)}
                    </pre>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </div>
  );
}
