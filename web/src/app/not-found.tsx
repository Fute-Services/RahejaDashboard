import Link from "next/link";
import styles from "./not-found.module.css";

/** Shown when a `/city/[city]` URL names a place with no projects (or garbage). */
export default function NotFound() {
  return (
    <main className={styles.page}>
      {/* eslint-disable-next-line @next/next/no-img-element -- bundled brand asset; keeps the raw-<img> convention */}
      <img
        className={styles.brandLogo}
        src="/brand/k-raheja-corp.png"
        width={198}
        height={258}
        alt="K Raheja Corp"
      />
      <h1 className={styles.title}>No projects here</h1>
      <p className={styles.body}>
        That city isn&rsquo;t part of the portfolio yet.
      </p>
      <Link className={styles.link} href="/">
        &larr; Back to the map
      </Link>
    </main>
  );
}
