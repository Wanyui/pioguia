import type { CollectionEntry } from "astro:content";
import { CATEGORIES, type CategoryKey } from "./categories";

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
  text: Record<string, string>;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const joinParts = (parts: Array<string | undefined>) =>
  normalize(parts.filter(Boolean).join(" "));

const buildLocalizedText = (
  entry: CollectionEntry<"benefits">["data"],
  lang: keyof Localized<string>
) => {
  const title = entry.title[lang] ?? "";
  const description = entry.description[lang] ?? "";
  const tags = entry.tags[lang]?.join(" ") ?? "";
  const category = CATEGORIES[entry.category].label[lang];
  const highlight = entry.highlight?.[lang] ?? "";
  return joinParts([
    title,
    description,
    tags,
    category,
    highlight,
    entry.address,
    entry.city,
    entry.email,
  ]);
};

export const buildSearchIndex = (
  entries: CollectionEntry<"benefits">[]
): SearchItem[] =>
  entries.map((entry) => {
    const { data } = entry;
    const text = {
      es: buildLocalizedText(data, "es"),
      ca: buildLocalizedText(data, "ca"),
      en: buildLocalizedText(data, "en"),
      fr: buildLocalizedText(data, "fr"),
      ru: buildLocalizedText(data, "ru"),
      all: joinParts([
        buildLocalizedText(data, "es"),
        buildLocalizedText(data, "ca"),
        buildLocalizedText(data, "en"),
        buildLocalizedText(data, "fr"),
        buildLocalizedText(data, "ru"),
      ]),
    };

    return {
      id: data.id,
      slug: entry.slug,
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: data.category,
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
      text,
    };
  });
