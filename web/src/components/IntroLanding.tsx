"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import styles from "./IntroLanding.module.css";

// The deck this screen is built from sets its display copy in a high-contrast
// serif; the rest of the site is Space Grotesk, so scope this font to here.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

/** How long the screen takes to fade out before the map takes over. */
const EXIT_MS = 320;

const STATS = [
  { value: "60 +", label: "Years of experience" },
  { value: "Pan Indian", label: "Presence" },
  { value: "$6Bn", label: "Market capitalization" },
];

const SECTORS = [
  {
    name: "Office",
    lines: [
      "Lease-able area of c. 83 msf",
      "One of the largest grade-A office portfolios in India",
    ],
  },
  {
    name: "Hospitality",
    lines: [
      "c. 5,000+ keys",
      "Poised to be one of India's largest hotel developers",
      "Group hotels in partnership with Marriott",
    ],
  },
  {
    name: "Malls",
    lines: [
      "Poised for the next phase of growth",
      "Tapping under-served markets",
      "5 operational and 2 under construction",
    ],
  },
  {
    name: "Residential",
    lines: [
      "Developed over 30 projects",
      "Across 5 cities spanning 30+ msf",
      "Market leader in central Mumbai",
    ],
  },
  {
    name: "Retail",
    lines: [
      "Operates 301 retail stores across India",
      "Expanding across retail formats to cater to consumers",
    ],
  },
];

const Sparkle = (
  <svg
    className={styles.sparkle}
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.4c.5 3.9 1.4 5.6 3.3 6.9 1 .7 2.3 1.1 4.3 1.4-2 .3-3.3.7-4.3 1.4-1.9 1.3-2.8 3-3.3 6.9-.5-3.9-1.4-5.6-3.3-6.9-1-.7-2.3-1.1-4.3-1.4 2-.3 3.3-.7 4.3-1.4C10.6 8 11.5 6.3 12 2.4Z" />
    <path d="M19 15.2c.26 1.9.72 2.75 1.68 3.4.5.34 1.15.55 2.14.69-.99.14-1.64.35-2.14.69-.96.65-1.42 1.5-1.68 3.4-.26-1.9-.72-2.75-1.68-3.4-.5-.34-1.15-.55-2.14-.69.99-.14 1.64-.35 2.14-.69.96-.65 1.42-1.5 1.68-3.4Z" />
  </svg>
);

/**
 * The screen you land on after signing in: the group's story, its numbers and
 * its sectors, with one way forward — "explore", which opens the India map.
 */
export function IntroLanding() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  // The map is heavy (Leaflet + tiles); fetching it while the visitor reads
  // means "explore" opens on an already-warm route.
  useEffect(() => {
    router.prefetch("/map");
  }, [router]);

  /** Fades this screen out first, so the map doesn't cut in mid-sentence. */
  const openMap = useCallback(
    (e: React.MouseEvent) => {
      // Let modified clicks (new tab, new window) behave normally.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      if (leaving) return;
      setLeaving(true);
      window.setTimeout(() => router.push("/map"), EXIT_MS);
    },
    [leaving, router],
  );

  return (
    <div
      className={`${styles.page} ${cormorant.variable} ${
        leaving ? styles.leaving : ""
      }`}
    >
      <div className={styles.backdrop} aria-hidden="true">
        {/* Faint contour lines drifting behind everything. */}
        <svg
          className={styles.waves}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M-100 ${140 + i * 130} C 240 ${60 + i * 130}, 620 ${
                300 + i * 130
              }, 1540 ${120 + i * 130}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className={styles.photo} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- bundled art direction; keeps the site's raw-<img> convention */}
        <img className={styles.photoImg} src="/brand/skyline.jpg" alt="" />
      </div>

      <header className={styles.header}>
        <span className={styles.brandBadge}>
          {/* eslint-disable-next-line @next/next/no-img-element -- bundled brand asset; keeps the site's raw-<img> convention */}
          <img
            className={styles.brandLogo}
            src="/brand/k-raheja-corp.png"
            width={198}
            height={258}
            alt="K Raheja Corp"
          />
        </span>
        <span className={styles.headerMeta}>PORTFOLIO&nbsp;·&nbsp;2026</span>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Shaping India&rsquo;s Cities</h1>
        <p className={styles.lede}>
          For over six decades, K Raheja Corp has transformed ambitious ideas
          into enduring landmarks, creating trusted spaces that shape how India
          works, lives and connects.
        </p>

        <div className={styles.stats}>
          {STATS.map((stat, i) => (
            <div
              className={styles.stat}
              key={stat.label}
              style={{ ["--i" as string]: i }}
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <Link href="/map" className={styles.explore} onClick={openMap}>
          <span className={styles.exploreBadge}>
            {/* eslint-disable-next-line @next/next/no-img-element -- bundled brand asset; keeps the site's raw-<img> convention */}
            <img
              className={styles.exploreLogo}
              src="/brand/k-raheja-corp.png"
              width={198}
              height={258}
              alt=""
            />
          </span>
          <span className={styles.exploreCta}>
            {Sparkle}
            explore
          </span>
        </Link>
      </main>

      <section className={styles.sectors} aria-label="Business sectors">
        {SECTORS.map((sector, i) => (
          <article
            className={styles.sector}
            key={sector.name}
            style={{ ["--i" as string]: i }}
          >
            <h2 className={styles.sectorName}>{sector.name}</h2>
            <ul className={styles.sectorLines}>
              {sector.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
