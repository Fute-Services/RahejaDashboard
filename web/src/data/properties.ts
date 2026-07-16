export type Property = {
  /** Stable slug — will become the API/route key once the backend lands. */
  slug: string;
  /** Shown on the card face. */
  name: string;
  /**
   * Shown in the footer list, where entries read as a set and so carry the
   * "Raheja" prefix the card can drop. Defaults to `name`.
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
  {
    slug: "kr-pune",
    name: "KR Pune",
    listName: "Raheja KR Pune",
    location: "Pune",
    href: "https://krpune1.futeservices.in/",
    image: "/properties/kr-pune.jpg",
  },
];
