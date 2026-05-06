import type { PublicListing } from "@/lib/listings";
import { LocationMap } from "./location-map";

function InfoCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="type-caption text-muted">{label}</p>
      <p className="mt-2 text-base text-ink leading-[1.5]">{value}</p>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md border border-paper-edge bg-white p-6 transition-colors hover:border-accent/40"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="rounded-md border border-paper-edge bg-white p-6">
      {inner}
    </div>
  );
}

export function LocationSection({ listing }: { listing: PublicListing }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const hasCoords =
    listing.latitude != null && listing.longitude != null;

  const directionsHref = listing.google_maps_url
    ? listing.google_maps_url
    : hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`
      : null;

  return (
    <section id="location" className="bg-paper">
      <h2 className="type-h2">Location</h2>

      <div className="mt-8 overflow-hidden rounded-md bg-paper-warm">
        {token && hasCoords ? (
          <div className="aspect-[4/3] w-full md:aspect-[16/9]">
            <LocationMap
              lat={listing.latitude as number}
              lng={listing.longitude as number}
              token={token}
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full md:aspect-[16/9] flex items-center justify-center px-6 text-center">
            <p className="text-base text-ink-soft">
              Map loading. Use the directions link below for now.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {listing.nearest_town && (
          <InfoCard label="Nearest town" value={listing.nearest_town} />
        )}
        {listing.nearest_recreation && (
          <InfoCard
            label="Nearest recreation"
            value={listing.nearest_recreation}
          />
        )}
        {directionsHref && (
          <InfoCard
            label="Get directions"
            value="Open in Google Maps →"
            href={directionsHref}
          />
        )}
      </div>
    </section>
  );
}
