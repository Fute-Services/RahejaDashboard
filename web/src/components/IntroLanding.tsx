import { Cormorant_Garamond } from "next/font/google";
import { IndiaOutlineMap } from "./IndiaOutlineMap";
import styles from "./IntroLanding.module.css";

// The deck this screen is built from sets its display copy in a high-contrast
// serif; the rest of the site is Space Grotesk, so scope this font to here.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const STATS = [
  { value: "60+", label: "Years of experience" },
  { value: "Pan-India", label: "Presence" },
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

/**
 * The only screen after signing in: the group's story and its numbers on the
 * left, the India map on the right. There is no separate map route any more —
 * the pins on that map are the way onward, and the only one.
 */
export function IntroLanding() {
  return (
    <div className={`${styles.page} ${cormorant.variable}`}>
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
      </main>

      {/*
        The map: every pin on it is a way into a city's projects. It hangs off
        the page rather than off <main>, because on a wide screen it is anchored
        to the top-right corner of the whole screen and runs off two edges of it.
        Sitting here in the DOM also puts it exactly where it belongs once it
        drops back into the flow on a narrow screen — under the story, above the
        sector cards.
      */}
      <div className={styles.mapZone}>
        <IndiaOutlineMap />
      </div>

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
