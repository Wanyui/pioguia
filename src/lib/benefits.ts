import { getCollection } from "astro:content";
import { buildSearchIndex, type SearchItem } from "./search-index";
import { ZONES, zoneOf } from "./zones";

/** Logo URL to show: the benefit's own logo, else (Andorra) the parish shield, else "" (category icon). */
const resolveLogo = (logo: string | undefined, city: string | undefined) => {
  if (!logo || logo === "/img/*") return ZONES[zoneOf(city)].shield ?? "";
  const value = logo.trim();
  if (value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(value)) return value;
  return "";
};

/** Active benefits ready for the client (search text, zone, resolved logo). */
export const loadBenefits = async (): Promise<SearchItem[]> =>
  buildSearchIndex(await getCollection("benefits")).map((item) => ({
    ...item,
    logo: resolveLogo(item.logo, item.city),
  }));

/** Archived benefits: kept as pages so old shared links explain the benefit is gone. */
export const loadArchivedSlugs = async () =>
  (await getCollection("benefits-archived")).map((entry) => ({ slug: entry.slug, title: entry.data.title }));

export const benefitPath = (slug: string) => `/beneficio/${slug}/`;

export const siteOriginFrom = (site: URL | undefined) => {
  for (const candidate of [site?.href, import.meta.env.SITE, "http://localhost:4321"]) {
    if (!candidate) continue;
    try {
      return new URL(String(candidate)).origin;
    } catch {
      // Ignore malformed site values and try the next fallback.
    }
  }
  return "http://localhost:4321";
};

export const hasCoordinates = (item: Pick<SearchItem, "lat" | "lng">) =>
  Number.isFinite(item.lat) && Number.isFinite(item.lng) && !(item.lat === 0 && item.lng === 0);

/** schema.org Place for one benefit. */
export const placeJsonLd = (item: SearchItem, origin: string) => {
  const logoUrl = item.logo ? (item.logo.startsWith("/") ? `${origin}${item.logo}` : item.logo) : undefined;
  const sameAs = [item.googleMapsUrl, item.web].filter(Boolean);
  return {
    "@type": "Place",
    "@id": `${origin}${benefitPath(item.slug)}`,
    url: `${origin}${benefitPath(item.slug)}`,
    name: item.title.es,
    description: item.description.es,
    ...(item.phone ? { telephone: item.phone } : {}),
    ...(logoUrl ? { image: logoUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: item.address,
      ...(item.city ? { addressLocality: item.city } : {}),
      addressCountry: item.zone === "fuera" ? "ES" : "AD",
    },
    geo: { "@type": "GeoCoordinates", latitude: item.lat, longitude: item.lng },
  };
};
