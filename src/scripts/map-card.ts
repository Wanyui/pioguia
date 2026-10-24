import { CATEGORIES } from "../lib/categories";
import type { SearchItem } from "../lib/search-index";
import { icon } from "../icons";
import { uiText, type LanguageCode } from "./map-i18n";
import { escapeHtml, sanitizeImageUrl } from "./map-utils";

/** "350 m" / "1,2 km" (decimal separator per language). */
export const formatDistance = (km: number, lang: LanguageCode) => {
  if (km < 1) return `${new Intl.NumberFormat(lang).format(Math.max(10, Math.round((km * 1000) / 10) * 10))} m`;
  const digits = km < 10 ? 1 : 0;
  return `${new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(km)} km`;
};

/** Logo, parish shield or (fallback) the category icon on a tinted tile. */
export const buildLogoHtml = (item: SearchItem) => {
  const category = CATEGORIES[item.category];
  const logoUrl = sanitizeImageUrl(item.logo);
  if (logoUrl) {
    const dark = item.logoBackground === "dark" ? " card-logo--dark" : "";
    return `<span class="card-logo${dark}"><img src="${logoUrl}" alt="" width="36" height="36" loading="lazy" decoding="async"></span>`;
  }
  return `<span class="card-logo card-logo--icon" style="--cat: var(${category.color})" aria-hidden="true">${icon(category.icon)}</span>`;
};

export const buildCardHtml = (item: SearchItem, lang: LanguageCode, distanceKm?: number) => {
  const category = CATEGORIES[item.category];
  const title = escapeHtml(item.title[lang] || item.title.es);
  const highlight = item.highlight ? escapeHtml(item.highlight[lang] || item.highlight.es) : "";
  const appliesTo = item.appliesTo ? escapeHtml(item.appliesTo[lang] || item.appliesTo.es) : "";
  const where =
    distanceKm !== undefined && Number.isFinite(distanceKm)
      ? escapeHtml(uiText[lang].distanceAway.replace("{d}", formatDistance(distanceKm, lang)))
      : escapeHtml(item.city ?? "");

  const tag = highlight
    ? `<span class="card-tag"><span class="tag">${highlight}</span>${appliesTo ? `<span class="tag-who">${appliesTo}</span>` : ""}</span>`
    : "";

  return `
    <li>
      <button type="button" class="card" data-id="${escapeHtml(item.id)}">
        ${buildLogoHtml(item)}
        <span class="card-main">
          <span class="card-name">${title}</span>
          <span class="card-meta">
            <span class="card-cat" style="--cat-text: var(${category.color}-text)">${icon(category.icon)}${escapeHtml(category.label[lang])}</span>
            ${where ? `<span aria-hidden="true">·</span><span class="card-where">${where}</span>` : ""}
          </span>
        </span>
        ${tag}
      </button>
    </li>
  `;
};
