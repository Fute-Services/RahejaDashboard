"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { citiesWithProjects } from "@/data/properties";
import styles from "./IndiaMap.module.css";

/**
 * India-wide interactive map. One pin per city that has projects (derived from
 * the data, so pins are never hand-placed); clicking a pin opens that city's
 * filtered carousel at `/city/[id]`.
 *
 * The view is a real, pale basemap — place names, coastlines and roads all
 * present but dialled right down, so the colour-coded pins are the only
 * saturated thing on screen.
 *
 * Leaflet touches `window`, so this whole component is loaded client-only via
 * `next/dynamic({ ssr: false })` from {@link IndiaMapLanding}.
 */

/** Roughly India's extent, so the map can't be dragged off into empty ocean. */
const INDIA_CENTER: [number, number] = [22.8, 80];
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6, 67], // south-west
  [37, 98], // north-east
];

const MAX_ZOOM = 17;

/**
 * The base layers this map can be drawn on — all free, no API key. Only
 * {@link DEFAULT_BASEMAP} is rendered; the others are kept as the documented
 * alternatives, so changing the map's look is a one-word edit below.
 */
const BASEMAPS = [
  {
    id: "map",
    label: "Map",
    // CARTO Positron: near-white land, pale water, quiet labels.
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  },
  {
    id: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    id: "streets",
    label: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
] as const;

type BasemapId = (typeof BASEMAPS)[number]["id"];

/** The layer the map is drawn on. */
const DEFAULT_BASEMAP: BasemapId = "map";

const BASEMAP =
  BASEMAPS.find((b) => b.id === DEFAULT_BASEMAP) ?? BASEMAPS[0];

/**
 * Pin colours, cycled by city order — the map reads as a set of distinct places
 * at a glance rather than a row of identical dots.
 */
const PIN_COLOURS = [
  { body: "#1a73e8", edge: "#1558b0" }, // blue
  { body: "#e5372b", edge: "#b32419" }, // red
  { body: "#2f9e44", edge: "#22753a" }, // green
  { body: "#f5a524", edge: "#c07c12" }, // amber
  { body: "#7a4ee0", edge: "#5b34b0" }, // violet
];

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * A pin built as a `divIcon` (HTML, not Leaflet's default PNG — which breaks
 * under bundlers): a teardrop with its own cast shadow, a name plate beside it,
 * and a count badge when a city holds more than one project.
 *
 * The icon box is 0×0 at the coordinate and each part positions itself against
 * that point, so the teardrop's tip always lands exactly on the city. Labels
 * are pushed away from the centre of the group (`side`), which keeps close
 * neighbours — Mumbai and Pune — from writing over each other. `--i` staggers
 * the drop-in.
 */
function pinIcon(
  name: string,
  count: number,
  index: number,
  side: "left" | "right",
) {
  const { body, edge } = PIN_COLOURS[index % PIN_COLOURS.length];
  const badge =
    count > 1 ? `<span class="${styles.pinBadge}">${pad2(count)}</span>` : "";
  const labelClass =
    side === "left"
      ? `${styles.pinLabel} ${styles.pinLabelLeft}`
      : styles.pinLabel;
  return L.divIcon({
    className: styles.pinWrap,
    html: `
      <span class="${styles.pin}" style="--i:${index}; --pin:${body}; --pin-edge:${edge}">
        <span class="${styles.pinShadow}"></span>
        <span class="${styles.pinDrop}">
          <span class="${styles.pinArt}">
            <svg viewBox="0 0 32 44" width="34" height="47" aria-hidden="true">
              <path
                d="M16 43.2C16 43.2 31 25.9 31 15.9 31 7.6 24.3 1 16 1S1 7.6 1 15.9c0 10 15 27.3 15 27.3Z"
                fill="var(--pin)" stroke="var(--pin-edge)" stroke-width="1.2"/>
              <circle cx="16" cy="15.6" r="5.4" fill="#fff"/>
            </svg>
            ${badge}
          </span>
        </span>
        <span class="${labelClass}">${name}</span>
      </span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/** How long the flight to a city runs before its screen takes over. */
const FLY_MS = 760;

/**
 * Lives inside the map so it can take the Leaflet instance from context — a
 * `ref` on MapContainer isn't attached yet when the parent's own effects run,
 * so a parent effect would silently no-op on first paint.
 */
function MapHandle({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onMap(map);
  }, [map, onMap]);

  return null;
}

export default function IndiaMap() {
  const router = useRouter();
  const entries = citiesWithProjects();
  const [leaving, setLeaving] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const holdMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  /**
   * Opening a city flies the map to it first, then hands over — so the jump to
   * that city's projects reads as travel rather than a cut. A veil fades up
   * over the flight and meets the next screen's own fade-in.
   */
  const openCity = useCallback(
    (id: string, lat: number, lng: number) => {
      if (leaving) return;
      setLeaving(true);
      const map = mapRef.current;
      if (map) {
        map.flyTo([lat, lng], Math.max(map.getZoom(), 8), {
          duration: FLY_MS / 1000,
        });
      }
      window.setTimeout(() => router.push(`/city/${id}`), FLY_MS);
    },
    [leaving, router],
  );

  /*
   * Publish the current view so the chrome floating over the map (the KRAHEJA
   * header, which lives in a sibling component) can flip to light type over
   * dark satellite imagery.
   */
  useEffect(() => {
    document.documentElement.dataset.mapView = BASEMAP.id;
    return () => {
      delete document.documentElement.dataset.mapView;
    };
  }, []);

  // Labels lean away from the middle of the group, so neighbouring pins don't
  // overlap each other's plates.
  const midLng =
    entries.reduce((sum, e) => sum + e.city.coordinates.lng, 0) /
    Math.max(entries.length, 1);

  return (
    <div className={styles.wrap}>
      <MapContainer
        className={styles.map}
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={MAX_ZOOM}
        scrollWheelZoom
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={0.9}
        zoomControl={false}
        attributionControl={false}
      >
        <MapHandle onMap={holdMap} />

        <TileLayer url={BASEMAP.url} />

        {entries.map(({ city, projects }, i) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={pinIcon(
              city.name,
              projects.length,
              i,
              city.coordinates.lng <= midLng ? "left" : "right",
            )}
            keyboard
            title={`${city.name} — ${projects.length} project${projects.length === 1 ? "" : "s"}`}
            eventHandlers={{
              click: () =>
                openCity(city.id, city.coordinates.lat, city.coordinates.lng),
            }}
          />
        ))}
      </MapContainer>

      {/* Fades up during the flight, so the city screen arrives out of navy. */}
      {leaving && <div className={styles.veil} aria-hidden="true" />}
    </div>
  );
}
