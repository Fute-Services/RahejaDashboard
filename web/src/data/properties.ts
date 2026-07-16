export type Property = {
  /** Stable slug — will become the API/route key once the backend lands. */
  slug: string;
  name: string;
  location: string;
  /** External site for the property, if it has one (PRD §2). */
  href: string;
  image?: string;
};

/**
 * Placeholder content — real names, locations and site URLs still needed.
 * The carousel derives its geometry from this list's length, so adding or
 * removing entries is safe.
 */
export const properties: Property[] = [
  {
    slug: "raheja-vistas",
    name: "Raheja Vistas",
    location: "Pune",
    href: "#",
  },
  {
    slug: "raheja-atlantis",
    name: "Raheja Atlantis",
    location: "Gurugram",
    href: "#",
  },
  {
    slug: "raheja-revanta",
    name: "Raheja Revanta",
    location: "Gurugram",
    href: "#",
  },
];
