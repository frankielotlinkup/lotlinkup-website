"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  Marker,
  Popup,
  type MapRef,
} from "react-map-gl/mapbox";
import { useEffect, useRef, useState } from "react";

export type Pin = {
  id: string;
  slug: string;
  lat: number;
  lng: number;
  acreage: number | null;
  city: string | null;
  state_code: string | null;
  financing_available: boolean | null;
  cash_price: number | null;
  monthly_payment: number | null;
};

function fmtMoney(n: number | null): string {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US")}`;
}

function locationLabel(p: Pin): string {
  const parts: string[] = [];
  if (p.acreage != null) {
    parts.push(`${p.acreage} ${p.acreage === 1 ? "acre" : "acres"}`);
  }
  if (p.city && p.state_code) parts.push(`${p.city}, ${p.state_code}`);
  else if (p.state_code) parts.push(p.state_code);
  return parts.join(" · ");
}

export function LiveUsMap({
  pins,
  token,
}: {
  pins: Pin[];
  token: string;
}) {
  const mapRef = useRef<MapRef | null>(null);
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [hoverPin, setHoverPin] = useState<Pin | null>(null);

  // Fit bounds to all pins on load (or center on the single pin).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || pins.length === 0) return;
    if (pins.length === 1) {
      map.flyTo({ center: [pins[0].lng, pins[0].lat], zoom: 8, duration: 0 });
      return;
    }
    const lats = pins.map((p) => p.lat);
    const lngs = pins.map((p) => p.lng);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 60, duration: 0 },
    );
  }, [pins]);

  const popupPin = activePin ?? hoverPin;

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{
        latitude: 39.8283,
        longitude: -98.5795,
        zoom: 3.5,
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      dragRotate={false}
      pitchWithRotate={false}
      cooperativeGestures
      style={{ width: "100%", height: "100%" }}
    >
      {pins.map((p) => (
        <Marker key={p.id} latitude={p.lat} longitude={p.lng} anchor="center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePin(p);
            }}
            onMouseEnter={() => setHoverPin(p)}
            onMouseLeave={() => setHoverPin(null)}
            aria-label={`${locationLabel(p) || "Listing"} — view details`}
            className="block h-3.5 w-3.5 rounded-full bg-accent shadow-md ring-2 ring-paper transition-transform hover:scale-125 focus-visible:scale-125 focus-visible:outline-none"
          />
        </Marker>
      ))}

      {popupPin && (
        <Popup
          latitude={popupPin.lat}
          longitude={popupPin.lng}
          onClose={() => setActivePin(null)}
          closeOnClick={false}
          closeButton={false}
          offset={20}
          anchor="bottom"
          maxWidth="260px"
        >
          <div className="rounded-md bg-white p-3.5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
              {locationLabel(popupPin) || "Listing"}
            </p>
            {popupPin.financing_available ? (
              <>
                <p className="mt-2 font-serif text-[24px] font-bold leading-tight text-ink">
                  {fmtMoney(popupPin.monthly_payment)}
                  <span className="ml-0.5 text-[14px] font-normal text-ink-soft">
                    /mo
                  </span>
                </p>
                <p className="text-xs text-muted">
                  {fmtMoney(popupPin.cash_price)} cash
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 font-serif text-[24px] font-bold leading-tight text-ink">
                  {fmtMoney(popupPin.cash_price)}
                </p>
                <p className="text-xs text-muted">Cash sale</p>
              </>
            )}
            <a
              href={`/listings/${popupPin.slug}`}
              className="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:text-accent-deep"
            >
              View details →
            </a>
          </div>
        </Popup>
      )}
    </Map>
  );
}
