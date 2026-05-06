import type { PublicListing } from "@/lib/listings";

function Row({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "py-3" : "border-b border-paper-edge py-3"}>
      <p className="type-caption text-muted">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  );
}

export function AboutSection({ listing }: { listing: PublicListing }) {
  const facts: { label: string; value: string }[] = [];
  if (listing.acreage != null) {
    facts.push({
      label: "Acreage",
      value: `${listing.acreage} ${listing.acreage === 1 ? "acre" : "acres"}`,
    });
  }
  if (listing.apn) facts.push({ label: "APN", value: listing.apn });
  if (listing.road_access)
    facts.push({ label: "Road access", value: listing.road_access });
  if (listing.utilities)
    facts.push({ label: "Utilities", value: listing.utilities });
  if (listing.topography)
    facts.push({ label: "Topography", value: listing.topography });

  const paragraphs = listing.description
    ? listing.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <section className="bg-paper">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12">
        <div className="md:col-span-3">
          <h2 className="type-h2">About this lot</h2>
          {paragraphs.length === 0 ? (
            <p className="mt-6 text-base leading-[1.65] text-ink-soft">
              Description coming soon.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-[1.65] text-ink-soft"
                >
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
        {facts.length > 0 && (
          <aside className="md:col-span-2">
            <div className="rounded-md border border-paper-edge bg-white p-6 md:p-8">
              <p className="type-caption text-muted">Key facts</p>
              <div className="mt-4">
                {facts.map((f, i) => (
                  <Row
                    key={f.label}
                    label={f.label}
                    value={f.value}
                    last={i === facts.length - 1}
                  />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
