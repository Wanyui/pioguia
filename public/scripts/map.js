import {
  __toESM,
  require_leaflet_src
} from "./chunks/chunk-46Z6VM5V.js";

// src/scripts/map.ts
var import_leaflet = __toESM(require_leaflet_src(), 1);

// node_modules/leaflet/dist/images/marker-icon.png
var marker_icon_default = "./assets/marker-icon-2V3QKKVC.png";

// node_modules/leaflet/dist/images/marker-icon-2x.png
var marker_icon_2x_default = "./assets/marker-icon-2x-SP63CLEO.png";

// node_modules/leaflet/dist/images/marker-shadow.png
var marker_shadow_default = "./assets/marker-shadow-MEXDWUU7.png";

// src/scripts/map-utils.ts
var normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
var truncateText = (value, maxChars) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 1)).trimEnd()}\u2026`;
};
var escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var sanitizeImageUrl = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return "";
};
var sanitizeExternalUrl = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
};
var splitPhoneNumbers = (value) => {
  if (!value) return [];
  return Array.from(
    new Set(
      value.split(/\s*(?:\/|,|;|\||\by\b|\bi\b|\band\b)\s*/i).map((part) => part.trim()).filter(Boolean)
    )
  );
};
var normalizePhoneForTel = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.length === 6) return `+376${digits}`;
  return digits;
};
var formatPhoneLabel = (value) => {
  const tel = normalizePhoneForTel(value);
  if (!tel) return "";
  if (tel.startsWith("+376") && tel.length === 10) {
    return `+376 ${tel.slice(4, 7)} ${tel.slice(7)}`;
  }
  return tel.startsWith("+") ? tel : value.trim();
};

// src/scripts/map-card.ts
var buildCardHtml = (item, lang) => {
  const title = escapeHtml(item.title[lang] || item.title.es);
  const rawDescription = item.description[lang] || item.description.es || "";
  const description = escapeHtml(truncateText(rawDescription, 250));
  const tags = (item.tags[lang] || item.tags.es || []).map(escapeHtml);
  const safeLogoUrl = sanitizeImageUrl(item.logo);
  const safeMapsUrl = sanitizeExternalUrl(item.googleMapsUrl);
  const safeWebUrl = sanitizeExternalUrl(item.web);
  const phoneNumbers = splitPhoneNumbers(item.phone);
  const hasLogo = Boolean(safeLogoUrl);
  const logo = hasLogo ? `<img class="card-logo h-16 w-24 rounded-lg border border-slate-200 bg-white object-contain p-1" src="${safeLogoUrl}" alt="${title}">` : "";
  const mapLink = safeMapsUrl ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="${safeMapsUrl}" target="_blank" rel="noopener noreferrer" data-map-link data-card-action aria-label="Abrir en Google Maps" title="Abrir en Google Maps"><img src="/img/Google_Maps_icon_(2020).svg" alt="" aria-hidden="true" class="h-3.5 w-3.5 object-contain" /></a>` : "";
  const webLink = safeWebUrl ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="${safeWebUrl}" target="_blank" rel="noopener noreferrer" data-web-link data-card-action aria-label="Abrir sitio web" title="Abrir sitio web"><svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757a4.5 4.5 0 0 1-6.364 0m1.061-5.303a4.5 4.5 0 0 1 0 6.364l-1.757 1.757a4.5 4.5 0 1 1-6.364-6.364l1.757-1.757a4.5 4.5 0 0 1 6.364 0"></path></svg></a>` : "";
  const phoneEntries = phoneNumbers.map((phone) => ({ tel: normalizePhoneForTel(phone), label: formatPhoneLabel(phone) })).filter((phone) => Boolean(phone.tel && phone.label));
  const phoneIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a.75.75 0 0 0 .75-.75V16.88a.75.75 0 0 0-.57-.73l-4.42-1.01a.75.75 0 0 0-.78.29l-.97 1.29a12.12 12.12 0 0 1-5.96-5.96l1.29-.97a.75.75 0 0 0 .29-.78L7.1 4.57a.75.75 0 0 0-.73-.57H3a.75.75 0 0 0-.75.75v2Z"></path></svg>';
  const callLinks = phoneEntries.length === 1 ? `<a class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50" href="tel:${phoneEntries[0]?.tel}" data-call-link data-card-action aria-label="Llamar al beneficio (${escapeHtml(phoneEntries[0]?.label || "")})" title="Llamar ${escapeHtml(phoneEntries[0]?.label || "")}">${phoneIcon}</a>` : phoneEntries.length > 1 ? `<details class="relative" data-call-menu data-card-action><summary class="inline-flex h-7 w-7 shrink-0 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 [&::-webkit-details-marker]:hidden" data-card-action aria-label="Mostrar telefonos" title="Mostrar telefonos">${phoneIcon}</summary><div class="absolute bottom-full left-0 z-20 mb-1 grid min-w-[11rem] gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">${phoneEntries.map((phone) => `<a class="rounded-md px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100" href="tel:${phone.tel}" data-call-link data-card-action title="Llamar ${escapeHtml(phone.label)}">${escapeHtml(phone.label)}</a>`).join("")}</div></details>` : "";
  const actionLinks = `${mapLink}${callLinks}${webLink}`;
  const logoColumn = hasLogo ? `<div class="card-media grid content-between justify-items-start gap-2">${logo}<div class="card-actions flex w-full items-center justify-start gap-2">${actionLinks}</div></div>` : "";
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

// src/scripts/map-card-state.ts
var toggleCardExpandedContent = (card, expanded) => {
  const description = card?.querySelector(".card-description");
  if (description instanceof HTMLElement) {
    description.classList.toggle("line-clamp-3", !expanded);
    description.classList.toggle("line-clamp-none", expanded);
    if (expanded) {
      description.style.display = "block";
      description.style.overflow = "visible";
      description.style.removeProperty("-webkit-line-clamp");
      description.style.removeProperty("-webkit-box-orient");
    } else {
      description.style.removeProperty("display");
      description.style.removeProperty("overflow");
      description.style.removeProperty("-webkit-line-clamp");
      description.style.removeProperty("-webkit-box-orient");
    }
  }
  const tags = card?.querySelector(".card-tags");
  if (tags instanceof HTMLElement) {
    tags.classList.toggle("truncate", !expanded);
    tags.classList.toggle("whitespace-normal", expanded);
  }
};
var animateCardResize = (card, expanded) => {
  if (!(card instanceof HTMLElement)) {
    toggleCardExpandedContent(card, expanded);
    return;
  }
  const startHeight = card.getBoundingClientRect().height;
  toggleCardExpandedContent(card, expanded);
  const endHeight = card.getBoundingClientRect().height;
  if (Math.abs(endHeight - startHeight) < 1) return;
  card.style.height = `${startHeight}px`;
  card.style.overflow = "hidden";
  card.style.transition = "height 220ms ease";
  requestAnimationFrame(() => {
    card.style.height = `${endHeight}px`;
  });
  const onEnd = () => {
    card.style.removeProperty("height");
    card.style.removeProperty("overflow");
    card.style.removeProperty("transition");
    card.removeEventListener("transitionend", onEnd);
  };
  card.addEventListener("transitionend", onEnd);
};

// src/scripts/map-i18n.ts
var uiText = {
  es: {
    title: "Gu\xEDa de ventajas Piolet",
    searchPlaceholder: "Buscar por palabra clave (ej: desayuno)",
    emptyState: "No se han encontrado resultados.",
    locationButton: "Volver a mi ubicaci\xF3n",
    locationPopup: "Tu ubicaci\xF3n aproximada",
    locationDenied: "Activa el permiso de ubicaci\xF3n del navegador para ver d\xF3nde est\xE1s.",
    locationUnavailable: "No se ha podido obtener tu ubicaci\xF3n. Int\xE9ntalo de nuevo.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Claro",
    languageLabel: "\u{1F1EA}\u{1F1F8} Espa\xF1ol"
  },
  ca: {
    title: "Guia d'avantatges Piolet",
    searchPlaceholder: "Cerca per paraula clau (ex: esmorzar)",
    emptyState: "No s'han trobat resultats.",
    locationButton: "Tornar a la meva ubicaci\xF3",
    locationPopup: "La teva ubicaci\xF3 aproximada",
    locationDenied: "Activa el perm\xEDs d'ubicaci\xF3 del navegador per veure on ets.",
    locationUnavailable: "No s'ha pogut obtenir la teva ubicaci\xF3. Torna-ho a provar.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clar",
    languageLabel: "\u{1F1E6}\u{1F1E9} Catal\xE0"
  },
  en: {
    title: "Piolet Benefits Guide",
    searchPlaceholder: "Search by keyword (e.g. breakfast)",
    emptyState: "No results found.",
    locationButton: "Back to my location",
    locationPopup: "Your approximate location",
    locationDenied: "Allow location access in your browser to see where you are.",
    locationUnavailable: "Your location could not be determined. Please try again.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Light",
    languageLabel: "\u{1F1EC}\u{1F1E7} English"
  },
  fr: {
    title: "Guide des avantages Piolet",
    searchPlaceholder: "Rechercher par mot-cl\xE9 (ex : petit-d\xE9jeuner)",
    emptyState: "Aucun r\xE9sultat trouv\xE9.",
    locationButton: "Revenir \xE0 ma position",
    locationPopup: "Votre position approximative",
    locationDenied: "Autorisez la localisation dans votre navigateur pour voir o\xF9 vous \xEAtes.",
    locationUnavailable: "Impossible d'obtenir votre position. Veuillez r\xE9essayer.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clair",
    languageLabel: "\u{1F1EB}\u{1F1F7} Fran\xE7ais"
  },
  ru: {
    title: "\u0413\u0438\u0434 \u043F\u043E \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430\u043C Piolet",
    searchPlaceholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u043C\u0443 \u0441\u043B\u043E\u0432\u0443 (\u043D\u0430\u043F\u0440. \u0437\u0430\u0432\u0442\u0440\u0430\u043A)",
    emptyState: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.",
    locationButton: "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043C\u043E\u0435\u043C\u0443 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044E",
    locationPopup: "\u0412\u0430\u0448\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
    locationDenied: "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u044E \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u0433\u0434\u0435 \u0432\u044B \u043D\u0430\u0445\u043E\u0434\u0438\u0442\u0435\u0441\u044C.",
    locationUnavailable: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0432\u0430\u0448\u0435 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",
    mapStyleOsm: "OSM",
    mapStylePositron: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F",
    languageLabel: "\u{1F1F7}\u{1F1FA} \u0420\u0443\u0441\u0441\u043A\u0438\u0439"
  }
};
var resolveLanguage = (currentLang) => {
  if (currentLang === "ca" || currentLang === "en" || currentLang === "fr" || currentLang === "ru") {
    return currentLang;
  }
  return "es";
};

// src/scripts/map.ts
var dataElement = document.getElementById("benefits-data");
var mapElement = document.getElementById("map");
var mapContainer = mapElement?.closest(".map-container");
var appHeader = document.getElementById("app-header");
var headerInner = document.getElementById("header-inner");
var headerMetaRow = document.getElementById("header-meta-row");
var langControls = document.getElementById("lang-controls");
var mapStyleControls = document.getElementById("map-style-controls");
var pageTitle = document.getElementById("page-title");
var langTrigger = document.getElementById("lang-trigger");
var langTriggerLabel = document.getElementById("lang-trigger-label");
var langMenu = document.getElementById("lang-menu");
var langOptionButtons = document.querySelectorAll(
  "[data-lang-option]"
);
var searchInput = document.getElementById("search-input");
var langSelect = document.getElementById("lang-select");
var results = document.getElementById("results");
var emptyState = document.getElementById("empty-state");
if (!dataElement || !mapElement || !results) {
  throw new Error("No se encontr\xF3 el contenedor del mapa o los datos.");
}
import_leaflet.default.Icon.Default.mergeOptions({
  iconRetinaUrl: marker_icon_2x_default,
  iconUrl: marker_icon_default,
  shadowUrl: marker_shadow_default
});
var data = [];
try {
  const parsedData = JSON.parse(dataElement.textContent ?? "[]");
  data = Array.isArray(parsedData) ? parsedData : [];
} catch (error) {
  if (false) {
    console.error("No se pudo leer los datos del mapa", error);
  }
}
function getLang() {
  return resolveLanguage(langSelect?.value || document.documentElement.lang || "es");
}
var DEFAULT_CENTER = [41.75, 2.2];
var DEFAULT_ZOOM = 8;
var LOCATION_ZOOM = 18;
var GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 8e3,
  maximumAge: 6e4
};
var map = import_leaflet.default.map(mapElement).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
var userMarker = null;
var BASE_MAX_ZOOM = 19;
var osmLayer = import_leaflet.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: BASE_MAX_ZOOM
});
var positronLayer = null;
var loadPositronLayer = async () => {
  if (!positronLayer) {
    await import("./chunks/leaflet-maplibre-gl-32ZQ2DGD.js");
    const options = {
      style: "https://tiles.openfreemap.org/styles/positron",
      attribution: '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; OpenStreetMap contributors'
    };
    positronLayer = import_leaflet.default.maplibreGL(options);
  }
  return positronLayer;
};
var isBaseStyle = (value) => value === "osm" || value === "positron";
var activeBaseLayer = osmLayer;
activeBaseLayer.addTo(map);
map.setMaxZoom(BASE_MAX_ZOOM);
var userLocation = null;
var hasValidCoordinates = (item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && !(item.lat === 0 && item.lng === 0);
var benefitBounds = import_leaflet.default.latLngBounds(
  data.filter(hasValidCoordinates).map((item) => [item.lat, item.lng])
);
if (benefitBounds.isValid()) {
  map.fitBounds(benefitBounds, { padding: [24, 24] });
}
var toRad = (value) => value * Math.PI / 180;
var distanceKm = (from, to) => {
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
var updateUserLocation = (position) => {
  const { latitude, longitude } = position.coords;
  userLocation = { lat: latitude, lng: longitude };
  map.setView([latitude, longitude], LOCATION_ZOOM, { animate: true });
  const userIcon = import_leaflet.default.icon({
    iconUrl: "/img/marker.png",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -42]
  });
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  userMarker = import_leaflet.default.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup(uiText[getLang()].locationPopup);
  applyFilter();
};
var requestUserLocation = (onSuccess, onError) => {
  const fail = (error) => {
    if (false) {
      console.warn("Geolocation error:", error.message);
    }
    onError?.(error);
  };
  navigator.geolocation.getCurrentPosition(
    onSuccess,
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        fail(error);
        return;
      }
      navigator.geolocation.getCurrentPosition(onSuccess, fail, {
        ...GEOLOCATION_OPTIONS,
        enableHighAccuracy: false
      });
    },
    GEOLOCATION_OPTIONS
  );
};
var showLocationError = (error) => {
  const text = uiText[getLang()];
  const message = error && error.code === error.PERMISSION_DENIED ? text.locationDenied : text.locationUnavailable;
  import_leaflet.default.popup().setLatLng(map.getCenter()).setContent(escapeHtml(message)).openOn(map);
};
var centerOnUser = () => {
  if (userLocation) {
    map.setView([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), LOCATION_ZOOM), {
      animate: true
    });
    return;
  }
  if (!("geolocation" in navigator)) {
    showLocationError();
    return;
  }
  requestUserLocation(updateUserLocation, showLocationError);
};
if ("geolocation" in navigator) {
  requestUserLocation(updateUserLocation);
}
var locationControl = import_leaflet.default.Control.extend({
  onAdd() {
    const container = import_leaflet.default.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control leaflet-control-zoom leaflet-control-custom-location"
    );
    const button = import_leaflet.default.DomUtil.create("a", "leaflet-control-zoom-in", container);
    button.href = "#";
    button.title = uiText[getLang()].locationButton;
    button.setAttribute("aria-label", uiText[getLang()].locationButton);
    button.textContent = "\u25CE";
    import_leaflet.default.DomEvent.disableClickPropagation(container);
    import_leaflet.default.DomEvent.on(button, "click", (event) => {
      import_leaflet.default.DomEvent.preventDefault(event);
      centerOnUser();
    });
    return container;
  }
});
var locationControlInstance = new locationControl({ position: "topleft" });
locationControlInstance.addTo(map);
var activeId = null;
var defaultMarkerStyle = {
  radius: 6,
  color: "#15803d",
  fillColor: "#22c55e",
  fillOpacity: 0.9,
  weight: 2
};
var activeMarkerStyle = {
  radius: 9,
  color: "#1d4ed8",
  fillColor: "#60a5fa",
  fillOpacity: 1,
  weight: 3
};
var setActive = (id, {
  center = false,
  openPopup = false,
  scroll = false
} = {}) => {
  if (activeId) {
    const previousMarker = markers.get(activeId);
    if (previousMarker) previousMarker.setStyle(defaultMarkerStyle);
    const previousCard = results?.querySelector(`.card[data-id="${activeId}"]`);
    previousCard?.classList.remove("is-active");
    animateCardResize(previousCard ?? null, false);
  }
  activeId = id;
  if (!id) return;
  const marker = markers.get(id);
  if (marker) {
    marker.setStyle(activeMarkerStyle);
    marker.bringToFront();
    if (center) {
      const targetZoom = Math.max(map.getZoom(), 18);
      map.setView(marker.getLatLng(), targetZoom, { animate: true });
    }
    if (openPopup) marker.openPopup();
  }
  const card = results?.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    card.classList.add("is-active");
    animateCardResize(card, true);
    if (scroll) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
};
var markers = /* @__PURE__ */ new Map();
var buildPopupActionsHtml = (item) => {
  const safeMapsUrl = sanitizeExternalUrl(item.googleMapsUrl);
  const safeWebUrl = sanitizeExternalUrl(item.web);
  const phoneNumbers = splitPhoneNumbers(item.phone);
  const phoneEntries = phoneNumbers.map((phone) => ({ tel: normalizePhoneForTel(phone), label: formatPhoneLabel(phone) })).filter((phone) => Boolean(phone.tel && phone.label));
  const mapLink = safeMapsUrl ? `<a class="popup-action" href="${safeMapsUrl}" target="_blank" rel="noopener noreferrer" data-card-action aria-label="Abrir en Google Maps" title="Abrir en Google Maps"><img src="/img/Google_Maps_icon_(2020).svg" alt="" aria-hidden="true" class="popup-action-icon" /></a>` : "";
  const webLink = safeWebUrl ? `<a class="popup-action" href="${safeWebUrl}" target="_blank" rel="noopener noreferrer" data-card-action aria-label="Abrir sitio web" title="Abrir sitio web"><svg viewBox="0 0 24 24" aria-hidden="true" class="popup-action-icon" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757a4.5 4.5 0 0 1-6.364 0m1.061-5.303a4.5 4.5 0 0 1 0 6.364l-1.757 1.757a4.5 4.5 0 1 1-6.364-6.364l1.757-1.757a4.5 4.5 0 0 1 6.364 0"></path></svg></a>` : "";
  const phoneIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="popup-action-icon" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a.75.75 0 0 0 .75-.75V16.88a.75.75 0 0 0-.57-.73l-4.42-1.01a.75.75 0 0 0-.78.29l-.97 1.29a12.12 12.12 0 0 1-5.96-5.96l1.29-.97a.75.75 0 0 0 .29-.78L7.1 4.57a.75.75 0 0 0-.73-.57H3a.75.75 0 0 0-.75.75v2Z"></path></svg>';
  const callLinks = phoneEntries.length === 1 ? `<a class="popup-action" href="tel:${phoneEntries[0]?.tel}" data-card-action aria-label="Llamar (${escapeHtml(phoneEntries[0]?.label || "")})" title="Llamar ${escapeHtml(phoneEntries[0]?.label || "")}">${phoneIcon}</a>` : phoneEntries.length > 1 ? `<details class="popup-action-details" data-call-menu data-card-action><summary class="popup-action" data-card-action aria-label="Mostrar telefonos" title="Mostrar telefonos">${phoneIcon}</summary><div class="popup-action-menu">${phoneEntries.map((phone) => `<a class="popup-action-menu-item" href="tel:${phone.tel}" data-card-action title="Llamar ${escapeHtml(phone.label)}">${escapeHtml(phone.label)}</a>`).join("")}</div></details>` : "";
  return `${mapLink}${callLinks}${webLink}`;
};
var buildPopupHtml = (item) => {
  const safeLogoUrl = sanitizeImageUrl(item.logo);
  const title = escapeHtml(item.title.es);
  const address = escapeHtml(item.address);
  const logoCell = safeLogoUrl ? `<img class="popup-logo-cell" src="${safeLogoUrl}" alt="${title}">` : `<div class="popup-logo-cell popup-logo-cell--placeholder" aria-hidden="true"></div>`;
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
data.forEach((item) => {
  if (!hasValidCoordinates(item)) return;
  const marker = import_leaflet.default.circleMarker([item.lat, item.lng], defaultMarkerStyle);
  marker.bindPopup(
    buildPopupHtml(item),
    { autoPan: false }
  );
  marker.on("click", () => {
    setActive(item.id, { openPopup: true, scroll: true });
  });
  markers.set(item.id, marker);
});
var updateUiText = (lang) => {
  const text = uiText[lang];
  if (pageTitle) pageTitle.textContent = text.title;
  if (searchInput) searchInput.placeholder = text.searchPlaceholder;
  if (emptyState) emptyState.textContent = text.emptyState;
  if (langTriggerLabel) langTriggerLabel.textContent = text.languageLabel;
  langOptionButtons.forEach((button) => {
    const isSelected = button.dataset.langOption === lang;
    button.classList.toggle("bg-sky-100", isSelected);
    button.classList.toggle("text-sky-700", isSelected);
    button.classList.toggle("font-semibold", isSelected);
  });
  const locationControlButton = document.querySelector(
    ".leaflet-control-custom-location .leaflet-control-zoom-in"
  );
  if (locationControlButton) {
    locationControlButton.title = text.locationButton;
    locationControlButton.setAttribute("aria-label", text.locationButton);
  }
  const osmLabel = document.querySelector(
    '.map-style-button[data-style="osm"] .map-style-label'
  );
  const positronLabel = document.querySelector(
    '.map-style-button[data-style="positron"] .map-style-label'
  );
  if (osmLabel) osmLabel.textContent = text.mapStyleOsm;
  if (positronLabel) positronLabel.textContent = text.mapStylePositron;
  if (userMarker) {
    userMarker.setPopupContent(text.locationPopup);
  }
};
var setLanguage = (lang) => {
  if (langSelect) langSelect.value = lang;
  document.documentElement.lang = lang;
  updateUiText(lang);
  applyFilter();
};
var renderList = (items) => {
  if (!results) return;
  const lang = getLang();
  results.innerHTML = items.map((item) => buildCardHtml(item, lang)).join("");
};
var focusOnMarker = (id) => {
  const shouldBringMapIntoView = window.matchMedia("(max-width: 900px)").matches;
  if (shouldBringMapIntoView) {
    mapContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (!markers.has(id)) {
    setActive(id, { scroll: true });
    return;
  }
  setActive(id, { center: true, openPopup: true, scroll: true });
};
var updateMap = (items) => {
  markers.forEach((marker) => map.removeLayer(marker));
  items.forEach((item) => {
    const marker = markers.get(item.id);
    if (marker) marker.addTo(map);
  });
  map.invalidateSize();
};
var applyFilter = () => {
  const query = normalize(searchInput?.value ?? "");
  const lang = getLang();
  const filtered = data.filter((item) => {
    if (!query) return true;
    const text = item.text?.[lang] || item.text?.all || "";
    return text.includes(query);
  });
  if (userLocation) {
    const origin = userLocation;
    filtered.sort((a, b) => {
      const distA = hasValidCoordinates(a) ? distanceKm(origin, { lat: a.lat, lng: a.lng }) : Number.POSITIVE_INFINITY;
      const distB = hasValidCoordinates(b) ? distanceKm(origin, { lat: b.lat, lng: b.lng }) : Number.POSITIVE_INFINITY;
      return distA - distB;
    });
  }
  renderList(filtered);
  updateMap(filtered);
  if (activeId && !filtered.some((item) => item.id === activeId)) {
    setActive(null);
  } else if (activeId) {
    setActive(activeId);
  }
  if (emptyState) emptyState.hidden = filtered.length > 0;
};
if (searchInput) searchInput.addEventListener("input", applyFilter);
if (langSelect) {
  langSelect.addEventListener("change", () => {
    setLanguage(getLang());
  });
}
if (langTrigger && langMenu) {
  const languageOptions = Array.from(langOptionButtons);
  const closeLanguageMenu = () => {
    langMenu.classList.add("hidden");
    langTrigger.setAttribute("aria-expanded", "false");
  };
  const openLanguageMenu = () => {
    langMenu.classList.remove("hidden");
    langTrigger.setAttribute("aria-expanded", "true");
  };
  langTrigger.addEventListener("click", () => {
    const isOpen = !langMenu.classList.contains("hidden");
    if (isOpen) {
      closeLanguageMenu();
      return;
    }
    openLanguageMenu();
  });
  langOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.langOption;
      if (!lang) return;
      setLanguage(lang);
      closeLanguageMenu();
    });
    button.addEventListener("keydown", (event) => {
      const currentIndex = languageOptions.indexOf(button);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        languageOptions[(currentIndex + 1) % languageOptions.length]?.focus();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        languageOptions[(currentIndex - 1 + languageOptions.length) % languageOptions.length]?.focus();
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        languageOptions[0]?.focus();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        languageOptions[languageOptions.length - 1]?.focus();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeLanguageMenu();
        langTrigger.focus();
      }
    });
  });
  langTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const isOpen = !langMenu.classList.contains("hidden");
      if (isOpen) {
        closeLanguageMenu();
        return;
      }
      openLanguageMenu();
      languageOptions[0]?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openLanguageMenu();
      languageOptions[0]?.focus();
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!langMenu.contains(target) && !langTrigger.contains(target)) {
      closeLanguageMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !langMenu.classList.contains("hidden")) {
      closeLanguageMenu();
      langTrigger.focus();
    }
  });
}
var MOBILE_BREAKPOINT = "(max-width: 900px)";
var HEADER_COMPACT_ENTER_Y = 12;
var HEADER_COMPACT_EXIT_Y = 2;
var isHeaderCompact = false;
var applyHeaderCompactClasses = (shouldCompact) => {
  if (!appHeader || !headerInner || !headerMetaRow || !langControls || !mapStyleControls) {
    return;
  }
  if (isHeaderCompact === shouldCompact) return;
  isHeaderCompact = shouldCompact;
  appHeader.classList.toggle("header-compact", shouldCompact);
  headerInner.classList.toggle("py-3", !shouldCompact);
  headerInner.classList.toggle("py-2", shouldCompact);
  headerMetaRow.classList.toggle("hidden", shouldCompact);
  langControls.classList.toggle("hidden", shouldCompact);
  mapStyleControls.classList.toggle("hidden", shouldCompact);
  mapStyleControls.classList.toggle("inline-flex", !shouldCompact);
  if (shouldCompact && langMenu && langTrigger) {
    langMenu.classList.add("hidden");
    langTrigger.setAttribute("aria-expanded", "false");
  }
};
var updateHeaderCompactMode = () => {
  const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
  if (!isMobile) {
    applyHeaderCompactClasses(false);
    return;
  }
  const y = window.scrollY;
  const shouldCompact = !isHeaderCompact && y > HEADER_COMPACT_ENTER_Y || isHeaderCompact && y > HEADER_COMPACT_EXIT_Y;
  applyHeaderCompactClasses(shouldCompact);
};
window.addEventListener("scroll", updateHeaderCompactMode, { passive: true });
window.addEventListener("resize", updateHeaderCompactMode);
updateHeaderCompactMode();
results.addEventListener("click", (event) => {
  const target = event.target;
  if (target?.closest("[data-card-action]")) return;
  const card = target?.closest(".card");
  const id = card?.dataset?.id;
  if (id) focusOnMarker(id);
});
document.addEventListener("click", (event) => {
  const target = event.target;
  const callMenus = document.querySelectorAll("[data-call-menu]");
  callMenus.forEach((menu) => {
    if (!target || menu.contains(target)) return;
    menu.removeAttribute("open");
  });
});
var styleButtons = document.querySelectorAll(
  ".map-style-button"
);
var requestedStyle = "osm";
var applyBaseLayer = async (style) => {
  requestedStyle = style;
  let layer;
  try {
    layer = style === "positron" ? await loadPositronLayer() : osmLayer;
  } catch (error) {
    console.error("No se pudo cargar el estilo de mapa.", error);
    return;
  }
  if (requestedStyle !== style || layer === activeBaseLayer) return;
  map.removeLayer(activeBaseLayer);
  activeBaseLayer = layer;
  activeBaseLayer.addTo(map);
};
styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style;
    if (!isBaseStyle(style)) return;
    void applyBaseLayer(style);
    styleButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});
setLanguage(getLang());
requestAnimationFrame(() => {
  map.invalidateSize();
});
