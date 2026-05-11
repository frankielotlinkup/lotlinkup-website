"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map,
  Marker,
  Popup,
  type MapRef,
} from "react-map-gl/mapbox";
import { useEffect, useMemo, useRef, useState } from "react";
import Supercluster from "supercluster";
import type { ClusterFeature, PointFeature } from "supercluster";

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

type PinProps = { pin: Pin };

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

const US_BOUNDS: [number, number, number, number] = [-180, -85, 180, 85];

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
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3.5,
  });

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

  const supercluster = useMemo(() => {
    const sc = new Supercluster<PinProps>({
      radius: 50,
      maxZoom: 14,
    });
    sc.load(
      pins.map(
        (p): PointFeature<PinProps> => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [p.lng, p.lat] },
          properties: { pin: p },
        }),
      ),
    );
    return sc;
  }, [pins]);

  const clusters = useMemo(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return supercluster.getClusters(US_BOUNDS, Math.floor(viewState.zoom));
    }
    const b = map.getBounds();
    if (!b) {
      return supercluster.getClusters(US_BOUNDS, Math.floor(viewState.zoom));
    }
    const bbox: [number, number, number, number] = [
      b.getWest(),
      b.getSouth(),
      b.getEast(),
      b.getNorth(),
    ];
    return supercluster.getClusters(bbox, Math.floor(viewState.zoom));
  }, [supercluster, viewState]);

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
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/light-v11"
      dragRotate={false}
      pitchWithRotate={false}
      cooperativeGestures
      style={{ width: "100%", height: "100%" }}
    >
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const isCluster = (feature.properties as { cluster?: boolean }).cluster;

        if (isCluster) {
          const cluster = feature as ClusterFeature<PinProps>;
          const count = cluster.properties.point_count;
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={lat}
              longitude={lng}
              anchor="center"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const map = mapRef.current;
                  if (!map || cluster.id == null) return;
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(Number(cluster.id)),
                    16,
                  );
                  map.flyTo({
                    center: [lng, lat],
                    zoom: expansionZoom,
                    duration: 600,
                  });
                }}
                aria-label={`${count} listings — zoom in`}
                className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white shadow-md ring-2 ring-paper transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none"
              >
                +{count}
              </button>
            </Marker>
          );
        }

        const p = (feature.properties as PinProps).pin;
        return (
          <Marker
            key={p.id}
            latitude={p.lat}
            longitude={p.lng}
            anchor="center"
          >
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
        );
      })}

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
