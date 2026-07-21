import { notFound } from "next/navigation";
import { PropertyCarousel } from "@/components/PropertyCarousel";
import { findCity, propertiesForCity } from "@/data/properties";

/**
 * The filtered view: the same coverflow carousel, fed only the projects in one
 * city. Reached by clicking a pin on the map landing. Server component — it
 * resolves the city from the route param and hands a filtered list to the
 * (client) carousel, which already adapts to any list length.
 */
export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityInfo = findCity(city);
  const list = propertiesForCity(city);

  // Unknown city, or a registered city with nothing in it yet.
  if (!cityInfo || list.length === 0) notFound();

  return (
    <PropertyCarousel
      properties={list}
      backHref="/"
      cityLabel={cityInfo.name}
    />
  );
}
