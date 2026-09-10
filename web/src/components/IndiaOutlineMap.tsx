"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { mapCities } from "@/data/properties";
import { INDIA_STATES, INDIA_VIEWBOX, projectIndia } from "@/data/indiaMap";
import styles from "./IndiaOutlineMap.module.css";

/**
 * The map on the landing screen: India drawn from real state geometry (see
 * {@link INDIA_STATES}) as hairlines over the navy ground, with a pin on every
 * city in the registry. Clicking a pin opens that city's filtered carousel at
 * `/city/[id]` — the same trip the old Leaflet screen made, minus the tiles, the
 * provider and the extra route.
 *
 * Pins come from {@link mapCities}, which is every city whether or not it has a
 * project yet: the map marks the group's footprint, so a city still waiting on
 * its first project is drawn but has nothing to open, and is left inert rather
 * than leading to an empty screen. Pins and paths go through the same
 * {@link projectIndia}, so a pin can never drift off the state it belongs to.
 */

/**
 * How long the chosen pin holds the screen before the city arrives. Short: this
 * is a single click, and the handover should feel like the click landing rather
 * than like waiting for something.
 */
const LEAVE_MS = 260;

const pad2 = (n: number) => String(n).padStart(2, "0");

/* ---------- keeping neighbouring pins apart ---------- */

/*
 * Two cities can sit almost on top of each other at this scale — Mumbai and Pune
 * are about 34 × 23 viewBox units apart, which is under 20 screen pixels — so a
 * pin's chip is not simply parked above its dot. Cities closer than the box
 * below are treated as one cluster and fanned out.
 *
 * These thresholds are viewBox units, while the chips they keep apart are sized
 * in CSS pixels. The map is drawn at roughly half a pixel per unit, so the box
 * is a little over twice a chip's own size.
 */
const CLUSTER_X = 150;
const CLUSTER_Y = 80;

/** Horizontal spread and vertical step between the chips of one cluster, in px. */
const FAN_X = 38;
const FAN_Y = 44;

/** Stem length, in px, for a pin with no neighbour to avoid. */
const BASE_STEM = 34;

type Placed = {
  x: number;
  y: number;
  /** Chip offset from the dot: right is positive, up is a positive `stem`. */
  dx: number;
  stem: number;
  /** Which side of the dot the city's name is written on. */
  side: "left" | "right";
};

/**
 * Fans each cluster of near-neighbours out: chips step sideways and upwards in
 * turn, and their names lean away from the middle of the cluster, so no two pins
 * ever write over each other. A lone pin keeps the plain straight stem.
 */
function placePins(points: { x: number; y: number }[]): Placed[] {
  // Cluster by proximity, working down the map so the fan is stable.
  const order = points.map((_, i) => i).sort((a, b) => points[a].y - points[b].y);
  const clusters: number[][] = [];

  for (const i of order) {
    const near = clusters.find((c) =>
      c.some(
        (j) =>
          Math.abs(points[i].x - points[j].x) < CLUSTER_X &&
          Math.abs(points[i].y - points[j].y) < CLUSTER_Y,
      ),
    );
    if (near) near.push(i);
    else clusters.push([i]);
  }

  const placed = new Array<Placed>(points.length);
  for (const cluster of clusters) {
    const n = cluster.length;
    cluster.forEach((i, k) => {
      const spread = k - (n - 1) / 2;
      placed[i] = {
        ...points[i],
        dx: spread * FAN_X,
        // The higher a pin sits in its cluster, the longer its stem, so the
        // chips stack rather than collide.
        stem: BASE_STEM + (n - 1 - k) * FAN_Y,
        side: n > 1 && spread < 0 ? "left" : "right",
      };
    });
  }
  return placed;
}

export function IndiaOutlineMap() {
  const router = useRouter();
  const entries = mapCities();
  const layout = placePins(
    entries.map(({ city }) =>
      projectIndia(city.coordinates.lng, city.coordinates.lat),
    ),
  );
  const [leaving, setLeaving] = useState<string | null>(null);

  /**
   * Opening a city lights its pin, dims the rest, then hands over — so the jump
   * to the projects reads as a choice landing rather than a cut.
   */
  const openCity = useCallback(
    (id: string) => {
      if (leaving) return;
      setLeaving(id);
      window.setTimeout(() => router.push(`/city/${id}`), LEAVE_MS);
    },
    [leaving, router],
  );

  return (
    <div
      className={`${styles.map} ${leaving ? styles.mapLeaving : ""}`}
      style={{
        ["--vb-w" as string]: INDIA_VIEWBOX.w,
        ["--vb-h" as string]: INDIA_VIEWBOX.h,
      }}
    >
      <svg
        className={styles.outline}
        viewBox={`0 0 ${INDIA_VIEWBOX.w} ${INDIA_VIEWBOX.h}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/*
         * Every state at full strength inside the group, with the group itself
         * faded: an internal border belongs to the two states either side of it
         * and so gets stroked twice, and fading each path on its own would draw
         * those shared lines twice as bright as the coast.
         */}
        <g className={styles.states}>
          {INDIA_STATES.map(([name, d]) => (
            <path key={name} d={d} />
          ))}
        </g>
      </svg>

      {/*
       * Pins are HTML, not SVG, so their type and logo stay a fixed size however
       * wide the map is drawn. They line up with the states because the box's
       * aspect ratio is locked to the viewBox (module CSS), which makes a percent
       * of the box exactly a percent of the viewBox.
       */}
      <ul className={styles.pins}>
        {entries.map(({ city, projects }, i) => {
          const { x, y, dx, stem, side } = layout[i];
          const count = projects.length;
          // A city still waiting on its first project is drawn, but there is
          // nothing behind it to open.
          const live = count > 0;
          const parts = (
            <>
              <span className={styles.pinBadge}>
                {/* eslint-disable-next-line @next/next/no-img-element -- bundled brand asset; keeps the site's raw-<img> convention */}
                <img
                  className={styles.pinLogo}
                  src="/brand/k-raheja-corp.png"
                  width={198}
                  height={258}
                  alt=""
                />
                {count > 1 && (
                  <span className={styles.pinCount}>{pad2(count)}</span>
                )}
              </span>
              {/*
                Drawn rather than sized, because a fanned-out chip sits off to
                one side and its tether has to lean. Overflow is visible, so
                the line lives happily outside this 1×1 box.
              */}
              <svg
                className={styles.pinStem}
                width="1"
                height="1"
                aria-hidden="true"
              >
                <line x1={dx} y1={-stem} x2="0" y2="0" />
              </svg>
              <span className={styles.pinDot} aria-hidden="true" />
              <span className={styles.pinName}>{city.name}</span>
            </>
          );
          return (
            <li
              key={city.id}
              className={[
                styles.pin,
                side === "left" ? styles.pinLeft : "",
                live ? "" : styles.pinQuiet,
                leaving === city.id ? styles.pinChosen : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${(x / INDIA_VIEWBOX.w) * 100}%`,
                top: `${(y / INDIA_VIEWBOX.h) * 100}%`,
                ["--i" as string]: i,
                ["--dx" as string]: `${dx}px`,
                ["--stem" as string]: `${stem}px`,
              }}
            >
              {live ? (
                <button
                  type="button"
                  className={styles.pinButton}
                  onClick={() => openCity(city.id)}
                  aria-label={`${city.name} — ${count} project${
                    count === 1 ? "" : "s"
                  }`}
                >
                  {parts}
                </button>
              ) : (
                <span className={styles.pinButton}>{parts}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
