import type { SearchItem } from "../../lib/search-index";
import {
  escapeHtml,
  formatPhoneLabel,
  normalizePhoneForTel,
  sanitizeExternalUrl,
  sanitizeImageUrl,
  splitPhoneNumbers,
} from "../map-utils";

const buildPopupActionsHtml = (item: SearchItem) => {
  const safeMapsUrl = sanitizeExternalUrl(item.googleMapsUrl);
  const safeWebUrl = sanitizeExternalUrl(item.web);
  const phoneEntries = splitPhoneNumbers(item.phone)
    .map((phone) => ({ tel: normalizePhoneForTel(phone), label: formatPhoneLabel(phone) }))
    .filter((phone) => Boolean(phone.tel && phone.label));

  const mapLink = safeMapsUrl
    ? `<a class="popup-action" href="${safeMapsUrl}" target="_blank" rel="noopener noreferrer" data-card-action aria-label="Abrir en Google Maps" title="Abrir en Google Maps"><img src="/img/Google_Maps_icon_(2020).svg" alt="" aria-hidden="true" class="popup-action-icon" /></a>`
    : "";

  const webLink = safeWebUrl
    ? `<a class="popup-action" href="${safeWebUrl}" target="_blank" rel="noopener noreferrer" data-card-action aria-label="Abrir sitio web" title="Abrir sitio web"><svg viewBox="0 0 24 24" aria-hidden="true" class="popup-action-icon" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757a4.5 4.5 0 0 1-6.364 0m1.061-5.303a4.5 4.5 0 0 1 0 6.364l-1.757 1.757a4.5 4.5 0 1 1-6.364-6.364l1.757-1.757a4.5 4.5 0 0 1 6.364 0"></path></svg></a>`
    : "";

  const phoneIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true" class="popup-action-icon" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a.75.75 0 0 0 .75-.75V16.88a.75.75 0 0 0-.57-.73l-4.42-1.01a.75.75 0 0 0-.78.29l-.97 1.29a12.12 12.12 0 0 1-5.96-5.96l1.29-.97a.75.75 0 0 0 .29-.78L7.1 4.57a.75.75 0 0 0-.73-.57H3a.75.75 0 0 0-.75.75v2Z"></path></svg>';

  const callLinks =
    phoneEntries.length === 1
      ? `<a class="popup-action" href="tel:${phoneEntries[0]?.tel}" data-card-action aria-label="Llamar (${escapeHtml(phoneEntries[0]?.label || "")})" title="Llamar ${escapeHtml(phoneEntries[0]?.label || "")}">${phoneIcon}</a>`
      : phoneEntries.length > 1
        ? `<details class="popup-action-details" data-call-menu data-card-action><summary class="popup-action" data-card-action aria-label="Mostrar telefonos" title="Mostrar telefonos">${phoneIcon}</summary><div class="popup-action-menu">${phoneEntries
            .map((phone) => `<a class="popup-action-menu-item" href="tel:${phone.tel}" data-card-action title="Llamar ${escapeHtml(phone.label)}">${escapeHtml(phone.label)}</a>`)
            .join("")}</div></details>`
        : "";

  return `${mapLink}${callLinks}${webLink}`;
};

export const buildPopupHtml = (item: SearchItem) => {
  const safeLogoUrl = sanitizeImageUrl(item.logo);
  const title = escapeHtml(item.title.es);
  const address = escapeHtml(item.address);
  const logoCell = safeLogoUrl
    ? `<img class="popup-logo-cell" src="${safeLogoUrl}" alt="${title}">`
    : `<div class="popup-logo-cell popup-logo-cell--placeholder" aria-hidden="true"></div>`;
  const actions = buildPopupActionsHtml(item);
  const actionsWrap = actions ? `<div class="popup-actions">${actions}</div>` : "";

  return `<div class="popup-content">
  <div class="popup-grid">
    ${logoCell}
    <div class="popup-title">${title}</div>
    ${actionsWrap}
    <div class="popup-address">${address}</div>
  </div>
</div>`;
};
