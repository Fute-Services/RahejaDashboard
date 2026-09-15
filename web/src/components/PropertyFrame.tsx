"use client";

import { useRouter } from "next/navigation";
import type { Property } from "@/data/properties";
import styles from "./PropertyFrame.module.css";

/**
 * The project's external site, full screen, with a floating back button over
 * it. The sites live on other domains, so they can't carry a link back to us
 * themselves — this frame is what gives every one of them the same way home.
 */
export function PropertyFrame({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <iframe
        className={styles.frame}
        src={property.href}
        title={`${property.name}, ${property.location}`}
      />
      <button
        type="button"
        className={styles.back}
        onClick={() => router.push(`/city/${property.city}`)}
        aria-label="Back to the dashboard"
      >
        ← Back
      </button>
    </div>
  );
}
