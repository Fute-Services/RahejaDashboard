export type Property = {
  /** Stable slug — will become the API/route key once the backend lands. */
  slug: string;
  /** Shown on the card face. */
  name: string;
  /**
   * Shown in the footer list, where entries read as a set and so carry the
   * "Kraheja" prefix the card can drop. Defaults to `name`.
   */
  listName?: string;
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
    slug: "cignus",
    name: "Cignus",
    listName: "Kraheja Cignus",
    location: "Powai, Mumbai",
    href: "https://project-cignus.vercel.app/",
    image: "/properties/cignus.jpg",
  },
  {
    slug: "kr-pune",
    name: "KR Pune",
    listName: "Kraheja KR Pune",
    location: "Pune",
    href: "https://krpune1.futeservices.in/",
    image: "/properties/kr-pune.jpg",
  },
];
