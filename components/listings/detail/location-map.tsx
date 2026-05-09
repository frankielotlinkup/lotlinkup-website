"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { Map, Marker } from "react-map-gl/mapbox";

export function LocationMap({
  lat,
  lng,
  token,
}: {
  lat: number;
  lng: number;
  token: string;
}) {
  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{ latitude: lat, longitude: lng, zoom: 11 }}
      mapStyle="mapbox://styles/mapbox/standard-satellite"
      dragRotate={false}
      pitchWithRotate={false}
      cooperativeGestures
      style={{ width: "100%", height: "100%" }}
    >
      <Marker latitude={lat} longitude={lng} anchor="center">
        <span
          aria-label="Listing location"
          className="block h-4 w-4 rounded-full bg-accent shadow-md ring-2 ring-paper"
        />
      </Marker>
    </Map>
  );
}
