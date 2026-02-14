import type { CollectionEntry } from "astro:content";

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
  category?: Localized<string>;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  logo?: string;
  web?: string;
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
  const category = entry.category?.[lang] ?? "";
  return joinParts([
    title,
    description,
    tags,
    category,
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
      address: data.address,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      phone: data.phone,
      email: data.email,
      logo: data.logo,
      web: data.web,
      languages: data.languages ?? ["es"],
      text,
    };
  });
