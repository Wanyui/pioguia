import type { SearchItem } from "../lib/search-index";
import type { LanguageCode } from "./map-i18n";
import {
  escapeHtml,
  formatPhoneLabel,
  normalizePhoneForTel,
  sanitizeExternalUrl,
  sanitizeImageUrl,
  splitPhoneNumbers,
  truncateText,
} from "./map-utils";

export const buildCardHtml = (item: SearchItem, lang: LanguageCode) => {
  const title = escapeHtml(item.title[lang] || item.title.es);
  const rawDescription = item.description[lang] || item.description.es || "";
  const description = escapeHtml(truncateText(rawDescription, 250));
  const tags = (item.tags[lang] || item.tags.es || []).map(escapeHtml);
  const safeLogoUrl = sanitizeImageUrl(item.logo);
  const safeMapsUrl = sanitizeExternalUrl(item.googleMapsUrl);
  const safeWebUrl = sanitizeExternalUrl(item.web);
  const phoneNumbers = splitPhoneNumbers(item.phone);
  const hasLogo = Boolean(safeLogoUrl);
  const logo = hasLogo
    ? `<img class="card-logo h-16 w-24 rounded-lg border border-slate-200 bg-white object-contain p-1" src="${safeLogoUrl}" alt="${title}">`
    : "";
  const mapLink = safeMapsUrl
    ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="${safeMapsUrl}" target="_blank" rel="noopener noreferrer" data-map-link data-card-action aria-label="Abrir en Google Maps" title="Abrir en Google Maps"><img src="/img/Google_Maps_icon_(2020).svg" alt="" aria-hidden="true" class="h-3.5 w-3.5 object-contain" /></a>`
    : "";
  const webLink = safeWebUrl
    ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="${safeWebUrl}" target="_blank" rel="noopener noreferrer" data-web-link data-card-action aria-label="Abrir sitio web" title="Abrir sitio web"><svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757a4.5 4.5 0 0 1-6.364 0m1.061-5.303a4.5 4.5 0 0 1 0 6.364l-1.757 1.757a4.5 4.5 0 1 1-6.364-6.364l1.757-1.757a4.5 4.5 0 0 1 6.364 0"></path></svg></a>`
    : "";
  const phoneEntries = phoneNumbers
    .map((phone) => ({ tel: normalizePhoneForTel(phone), label: formatPhoneLabel(phone) }))
    .filter((phone) => Boolean(phone.tel && phone.label));
  const phoneIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a.75.75 0 0 0 .75-.75V16.88a.75.75 0 0 0-.57-.73l-4.42-1.01a.75.75 0 0 0-.78.29l-.97 1.29a12.12 12.12 0 0 1-5.96-5.96l1.29-.97a.75.75 0 0 0 .29-.78L7.1 4.57a.75.75 0 0 0-.73-.57H3a.75.75 0 0 0-.75.75v2Z"></path></svg>';
  const callLinks =
    phoneEntries.length === 1
      ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="tel:${phoneEntries[0]?.tel}" data-call-link data-card-action aria-label="Llamar al beneficio (${escapeHtml(phoneEntries[0]?.label || "")})" title="Llamar ${escapeHtml(phoneEntries[0]?.label || "")}">${phoneIcon}</a>`
      : phoneEntries.length > 1
        ? `<details class="relative" data-call-menu data-card-action><summary class="inline-flex h-7 w-7 shrink-0 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 [&::-webkit-details-marker]:hidden" data-card-action aria-label="Mostrar telefonos" title="Mostrar telefonos">${phoneIcon}</summary><div class="absolute bottom-full left-0 z-20 mb-1 grid min-w-[11rem] gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">${phoneEntries
            .map((phone) => `<a class="rounded-md px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100" href="tel:${phone.tel}" data-call-link data-card-action title="Llamar ${escapeHtml(phone.label)}">${escapeHtml(phone.label)}</a>`)
            .join("")}</div></details>`
        : "";
  const actionLinks = `${mapLink}${callLinks}${webLink}`;
  const logoColumn = hasLogo
    ? `<div class="card-media grid content-between justify-items-start gap-2">${logo}<div class="card-actions flex w-full items-center justify-start gap-2">${actionLinks}</div></div>`
    : "";
  return `
    <li class="card ${hasLogo ? "" : "no-logo"} group relative grid gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${hasLogo ? "grid-cols-[96px_minmax(0,1fr)]" : "grid-cols-1"}" data-id="${item.id}">
      ${logoColumn}
      <div class="card-content grid min-w-0 gap-1">
        <h3 class="line-clamp-2 text-sm font-semibold text-slate-900">${title}</h3>
        <p class="card-description line-clamp-3 text-xs leading-relaxed text-slate-700">${description}</p>
        <div class="card-meta mt-1 grid min-w-0 gap-1">
          <div class="meta flex min-w-0 items-center justify-between gap-2 text-[11px] text-slate-500">
            <span class="card-tags truncate">${tags.join(", ")}</span>
            ${hasLogo ? "" : actionLinks}
          </div>
        </div>
      </div>
    </li>
  `;
};

