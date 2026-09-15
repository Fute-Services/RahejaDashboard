import { notFound } from "next/navigation";
import { PropertyFrame } from "@/components/PropertyFrame";
import { findProperty } from "@/data/properties";

/**
 * A project's own site, shown inside the dashboard rather than in a new tab, so
 * there is always a way back. Reached from a card's "Visit" link.
 */
export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = findProperty(slug);

  if (!property) notFound();

  return <PropertyFrame property={property} />;
}
