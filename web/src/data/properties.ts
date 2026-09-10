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
  /**
   * Canonical city key — references a {@link City.id}. Drives which map pin the
   * project sits under and the `/city/[city]` filter. Adding a project in a new
   * city means setting this plus a matching row in {@link cities}.
   */
  city: string;
  /** External site for the property, if it has one (PRD §2). */
  href: string;
  image?: string;
};

/** A place on the map. One pin is drawn per city that has at least one project. */
export type City = {
  /** URL-safe id used as the `/city/[city]` route key and the `Property.city` link. */
  id: string;
  /** Human label shown on the pin and the filtered screen. */
  name: string;
  /** Where the pin lands on the map. */
  coordinates: { lat: number; lng: number };
};

/**
 * City registry — the source of pin coordinates, and what the map draws. Every
 * row gets a pin whether or not it has a project yet (see {@link mapCities}):
 * the board this map is built from marks the group's whole footprint, not just
 * the places already in the showcase. A new project just needs its `city` set
 * and a row here.
 */
export const cities: City[] = [
  { id: "mumbai", name: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
  { id: "pune", name: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { id: "hyderabad", name: "Hyderabad", coordinates: { lat: 17.385, lng: 78.4867 } },
  { id: "bengaluru", name: "Bengaluru", coordinates: { lat: 12.9716, lng: 77.5946 } },
];

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
    city: "mumbai",
    href: "https://cignus.futeservices.in/",
    image: "/properties/cignus.jpg",
  },
  {
    slug: "kr-pune",
    name: "KR Pune",
    listName: "Kraheja KR Pune",
    location: "Pune",
    city: "pune",
    href: "https://krpune1.futeservices.in/",
    image: "/properties/kr-pune.jpg",
  },
];

/** A city paired with the projects that sit in it. */
export type CityWithProjects = {
  city: City;
  projects: Property[];
};

/**
 * Every city on the map, joined to whatever projects sit in it — which may be
 * none. This is the single thing that decides what the map shows: add a row to
 * {@link cities} and a pin appears, add a project to it and that pin becomes a
 * way into the showcase. Order follows the registry.
 */
export function mapCities(): CityWithProjects[] {
  return cities.map((city) => ({
    city,
    projects: properties.filter((p) => p.city === city.id),
  }));
}


/** Looks up a city by id, or `undefined` if it isn't in the registry. */
export function findCity(id: string): City | undefined {
  return cities.find((city) => city.id === id);
}

/** The projects in a given city, in list order. Empty if the city is unknown. */
export function propertiesForCity(id: string): Property[] {
  return properties.filter((p) => p.city === id);
}
