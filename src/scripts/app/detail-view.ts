import { CATEGORIES } from "../../lib/categories";
import type { SearchItem } from "../../lib/search-index";
import { ZONES } from "../../lib/zones";
import { icon } from "../../icons";
import { buildLogoHtml, formatDistance } from "../map-card";
import { uiText, type LanguageCode } from "../map-i18n";
import {
  escapeHtml,
  formatPhoneLabel,
  normalizePhoneForTel,
  sanitizeExternalUrl,
  splitPhoneNumbers,
} from "../map-utils";

export const directionsUrl = (item: SearchItem) =>
  sanitizeExternalUrl(item.googleMapsUrl) ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.lat},${item.lng}`)}`;

const row = (href: string, iconName: Parameters<typeof icon>[0], label: string, external = false) =>
  `<a class="detail-row" href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${icon(iconName)}<span>${label}</span>${icon("chevronRight", "icon detail-chevron")}</a>`;

/** HTML for the detail panel of one benefit (docs/rediseno/04-DESIGN.md §5.7). */
export const buildDetailHtml = (item: SearchItem, lang: LanguageCode, distanceKm?: number) => {
  const text = uiText[lang];
  const category = CATEGORIES[item.category];
  const zone = ZONES[item.zone];
  const title = escapeHtml(item.title[lang] || item.title.es);
  const description = escapeHtml(item.description[lang] || item.description.es);
  const highlight = item.highlight ? escapeHtml(item.highlight[lang] || item.highlight.es) : "";
  const appliesTo = item.appliesTo ? escapeHtml(item.appliesTo[lang] || item.appliesTo.es) : "";
  const phones = splitPhoneNumbers(item.phone)
    .map((phone) => ({ tel: normalizePhoneForTel(phone), label: phone.trim() || formatPhoneLabel(phone) }))
    .filter((phone) => phone.tel && phone.label);
  const web = sanitizeExternalUrl(item.web);
  const email = item.email && /^[^\s@<>"]+@[^\s@<>"]+$/.test(item.email) ? item.email : "";
  const distance =
    distanceKm !== undefined && Number.isFinite(distanceKm)
      ? `<span class="detail-distance">${escapeHtml(text.distanceAway.replace("{d}", formatDistance(distanceKm, lang)))}</span>`
      : "";

  const callButton = phones[0]
    ? `<a class="btn btn-secondary" href="tel:${phones[0].tel}">${icon("phone")}<span>${escapeHtml(text.call)}</span></a>`
    : "";

  const contactRows = [
    ...phones.map((phone) => row(`tel:${phone.tel}`, "phone", escapeHtml(phone.label))),
    web ? row(web, "globe", escapeHtml(web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")), true) : "",
    email ? row(`mailto:${encodeURIComponent(email).replace("%40", "@")}`, "mail", escapeHtml(email)) : "",
  ].join("");

  return `
    <header class="detail-head">
      ${buildLogoHtml(item, title).replace('class="card-logo', 'class="card-logo detail-logo')}
      <div class="detail-titles">
        <h2 id="detail-title" class="detail-title">${title}</h2>
        <p class="detail-meta">
          <span class="card-cat" style="--cat-text: var(${category.color}-text)">${icon(category.icon)}${escapeHtml(category.label[lang])}</span>
          <span aria-hidden="true">·</span>
          <span class="detail-zone">${zone.shield ? `<img src="${zone.shield}" alt="" width="16" height="16">` : ""}${escapeHtml(item.city || zone.label[lang])}</span>
        </p>
      </div>
      <button type="button" class="detail-close" data-detail-close aria-label="${escapeHtml(text.close)}">${icon("x")}</button>
    </header>

    ${highlight ? `<div class="detail-offer"><span class="tag tag-xl">${highlight}</span>${appliesTo ? `<span class="detail-applies">${appliesTo}</span>` : ""}</div>` : ""}

    <div class="detail-actions">
      <a class="btn btn-primary" href="${directionsUrl(item)}" target="_blank" rel="noopener noreferrer">${icon("navigation")}<span>${escapeHtml(text.directions)}</span></a>
      ${callButton}
    </div>

    <p class="detail-place">${icon("mapPin")}<span>${escapeHtml(item.address)}</span>${distance}</p>

    <p class="detail-description">${description}</p>
    <p class="detail-reminder">${escapeHtml(text.showCard)}</p>

    ${contactRows ? `<nav class="detail-contact" aria-label="${escapeHtml(text.call)}">${contactRows}</nav>` : ""}

    <button type="button" class="btn btn-ghost detail-share" data-detail-share>${icon("share2")}<span>${escapeHtml(text.share)}</span></button>
  `;
};
