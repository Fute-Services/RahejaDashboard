"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AUTH_COOKIE, LOGIN_PATH } from "@/lib/auth";
import { citiesWithProjects, properties } from "@/data/properties";
import styles from "./IndiaMapLanding.module.css";

/*
 * Leaflet reads `window` on import, so the map can only exist in the browser.
 * Loading it here with `ssr: false` keeps the page a normal server-rendered
 * shell while the map hydrates client-side (with a themed loading placeholder).
 */
const IndiaMap = dynamic(() => import("./IndiaMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} />,
});

const pad2 = (n: number) => String(n).padStart(2, "0");

/** The map landing: the interactive India map under the KRAHEJA header chrome. */
export function IndiaMapLanding() {
  const router = useRouter();

  const signOut = useCallback(() => {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push(LOGIN_PATH);
    router.refresh();
  }, [router]);

  const cityCount = citiesWithProjects().length;
  const projectCount = properties.length;

  return (
    <div className={styles.page}>
      <div className={styles.mapLayer}>
        <IndiaMap />
      </div>

      <header className={styles.header}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- bundled logo asset; matches the carousel header. */}
          <img
            className={styles.brandLogo}
            src="/brand/k-raheja-corp.png"
            width={198}
            height={258}
            alt="K Raheja Corp"
          />
          <h1 className={styles.title}>KRAHEJA</h1>
          <p className={styles.subtitle}>
            Pick a city on the map to see its projects
          </p>
        </div>
        <div className={styles.meta}>
          <div className={styles.counter}>
            <span>{pad2(cityCount)}</span>
            <span className={styles.counterTotal}>
              &nbsp;{cityCount === 1 ? "city" : "cities"}
            </span>
          </div>
          <div className={styles.tagline}>
            {pad2(projectCount)} project{projectCount === 1 ? "" : "s"} &middot; 2026
          </div>
        </div>
      </header>

      <button
        type="button"
        className={styles.signout}
        onClick={signOut}
        aria-label="Log out"
      >
        Log out ↗
      </button>
    </div>
  );
}
