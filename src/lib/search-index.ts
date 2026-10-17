import type { CollectionEntry } from "astro:content";
import type { CategoryKey } from "./categories";
import { zoneOf, type ZoneKey } from "./zones";

export type Localized<T> = {
  es: T;
  ca?: T;
  en?: T;
  fr?: T;
  ru?: T;
};

export type SearchItem = {
  id: string;
  slug: string;
  title: Localized<string>;
  description: Localized<string>;
  tags: Localized<string[]>;
  category: CategoryKey;
  zone: ZoneKey;
  highlight?: Localized<string>;
  appliesTo?: Localized<string>;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  logo?: string;
  logoBackground?: "light" | "dark";
  web?: string;
  googleMapsUrl?: string;
  languages: string[];
};

export const buildSearchIndex = (
  entries: CollectionEntry<"benefits">[]
): SearchItem[] =>
  entries.map((entry) => {
    const { data } = entry;
    return {
      id: data.id,
      slug: entry.slug,
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: data.category,
      zone: zoneOf(data.city),
      highlight: data.highlight,
      appliesTo: data.appliesTo,
      address: data.address,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      phone: data.phone,
      email: data.email,
      logo: data.logo,
      logoBackground: data.logoBackground,
      web: data.web,
      googleMapsUrl: data.googleMapsUrl,
      languages: data.languages ?? ["es"],
    };
  });
