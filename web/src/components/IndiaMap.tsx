"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { citiesWithProjects } from "@/data/properties";
import styles from "./IndiaMap.module.css";

/**
 * India-wide interactive map. One pin per city that has projects (derived from
 * the data, so pins are never hand-placed); clicking a pin opens that city's
 * filtered carousel at `/city/[id]`.
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

/**
 * Base layers the switcher offers — all free, no API key. Order sets the toggle
 * order; the first is the default. Attribution swaps with the layer.
 */
const BASEMAPS = [
  {
    id: "map",
    label: "Map",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Imagery &copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics',
  },
  {
    id: "streets",
    label: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
] as const;

type BasemapId = (typeof BASEMAPS)[number]["id"];

/** What a fresh visit opens on, before the user has picked anything. */
const DEFAULT_BASEMAP: BasemapId = "satellite";

/**
 * Remembers the chosen base layer across reloads. The `-v2` suffix drops any
 * stale preference saved before satellite became the default, so a fresh visit
 * reliably opens on satellite.
 */
const BASEMAP_STORAGE_KEY = "kraheja_basemap_v2";

function initialBasemap(): BasemapId {
  if (typeof window === "undefined") return DEFAULT_BASEMAP;
  const saved = window.localStorage.getItem(BASEMAP_STORAGE_KEY);
  return BASEMAPS.some((b) => b.id === saved)
    ? (saved as BasemapId)
    : DEFAULT_BASEMAP;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * A pin built as a `divIcon` (HTML, not Leaflet's default PNG — which breaks
 * under bundlers): an accent dot with a pulsing halo, the city name, and a count
 * badge only when a city holds more than one project. Size is left 0×0 and the
 * pill re-centres itself with a CSS transform, so any label width still points
 * at the exact coordinate.
 */
function pinIcon(name: string, count: number) {
  const badge =
    count > 1 ? `<span class="${styles.pinBadge}">${pad2(count)}</span>` : "";
  return L.divIcon({
    className: styles.pinWrap,
    html: `
      <span class="${styles.pin}">
        <span class="${styles.pinDot}">${badge}</span>
        <span class="${styles.pinLabel}">${name}</span>
      </span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function IndiaMap() {
  const router = useRouter();
  const entries = citiesWithProjects();
  const [basemapId, setBasemapId] = useState<BasemapId>(initialBasemap);

  /** Switches the base layer and remembers it for next time. */
  const chooseBasemap = useCallback((id: BasemapId) => {
    setBasemapId(id);
    try {
      window.localStorage.setItem(BASEMAP_STORAGE_KEY, id);
    } catch {
      // Private mode / storage disabled — the choice just won't persist.
    }
  }, []);

  return (
    <div className={styles.wrap}>
      <MapContainer
        className={styles.map}
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={17}
        scrollWheelZoom
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={0.9}
        zoomControl={false}
        attributionControl={false}
      >
        {/*
          All base layers stay mounted; switching only changes their opacity,
          so the map crossfades gently instead of snapping to the new tiles.
        */}
        {BASEMAPS.map((b) => (
          <TileLayer
            key={b.id}
            url={b.url}
            opacity={b.id === basemapId ? 1 : 0}
            zIndex={b.id === basemapId ? 2 : 1}
          />
        ))}

        {entries.map(({ city, projects }) => (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={pinIcon(city.name, projects.length)}
            keyboard
            title={`${city.name} — ${projects.length} project${projects.length === 1 ? "" : "s"}`}
            eventHandlers={{ click: () => router.push(`/city/${city.id}`) }}
          >
            <Tooltip
              direction="top"
              offset={[0, -30]}
              opacity={1}
              className={styles.tip}
            >
              {city.name} &middot; {projects.length} project
              {projects.length === 1 ? "" : "s"}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Google-Maps-style base-layer switcher, bottom-centre. */}
      <div className={styles.switcher} role="group" aria-label="Map view">
        {BASEMAPS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={styles.switchBtn}
            aria-pressed={b.id === basemapId}
            onClick={() => chooseBasemap(b.id)}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
