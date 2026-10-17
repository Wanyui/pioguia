import { CATEGORIES } from "../../lib/categories";
import type { SearchItem } from "../../lib/search-index";
import type { LanguageCode } from "../map-i18n";
import { normalize } from "../map-utils";

const cache = new Map<string, string>();

/** Normalised text a search query is matched against, per language (falls back to Spanish). Memoised. */
export const searchText = (item: SearchItem, lang: LanguageCode) => {
  const key = `${item.id}|${lang}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const text = normalize(
    [
      item.title[lang] || item.title.es,
      item.description[lang] || item.description.es,
      (item.tags[lang] || item.tags.es || []).join(" "),
      CATEGORIES[item.category].label[lang],
      item.highlight?.[lang] || item.highlight?.es,
      item.appliesTo?.[lang] || item.appliesTo?.es,
      item.address,
      item.city,
      item.email,
    ]
      .filter(Boolean)
      .join(" ")
  );
  cache.set(key, text);
  return text;
};
