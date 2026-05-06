import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Listing detail",
};

export default function ListingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="bg-paper py-16 lg:py-24">
      <Container>
        <h1 className="type-h1">Listing detail page</h1>
        <p className="mt-4 type-body text-ink-soft">
          Coming in Phase 1 Step 4. The slug for this page is:{" "}
          <code className="rounded bg-paper-warm px-2 py-1 font-mono text-sm">
            {params.slug}
          </code>
        </p>
      </Container>
    </div>
  );
}
