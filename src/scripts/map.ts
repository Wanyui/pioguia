import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import type { SearchItem } from "../lib/search-index";

const dataElement = document.getElementById("benefits-data");
const mapElement = document.getElementById("map");
const mapContainer = mapElement?.closest(".map-container") as HTMLElement | null;
const appHeader = document.getElementById("app-header");
const headerInner = document.getElementById("header-inner");
const headerMetaRow = document.getElementById("header-meta-row");
const langControls = document.getElementById("lang-controls");
const mapStyleControls = document.getElementById("map-style-controls");
const pageTitle = document.getElementById("page-title");
const langTrigger = document.getElementById("lang-trigger") as
  | HTMLButtonElement
  | null;
const langTriggerLabel = document.getElementById("lang-trigger-label");
const langMenu = document.getElementById("lang-menu");
const langOptionButtons = document.querySelectorAll<HTMLButtonElement>(
  "[data-lang-option]"
);
const searchInput = document.getElementById("search-input") as
  | HTMLInputElement
  | null;
const langSelect = document.getElementById("lang-select") as
  | HTMLSelectElement
  | null;
const results = document.getElementById("results");
const emptyState = document.getElementById("empty-state");

if (!dataElement || !mapElement || !results) {
  throw new Error("No se encontró el contenedor del mapa o los datos.");
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

let data: SearchItem[] = [];
try {
  const parsedData = JSON.parse(dataElement.textContent ?? "[]");
  data = Array.isArray(parsedData) ? (parsedData as SearchItem[]) : [];
} catch (error) {
  if (import.meta.env.DEV) {
    console.error("No se pudo leer los datos del mapa", error);
  }
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeImageUrl = (value: string | undefined) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(trimmed)) {
    return trimmed;
  }
  return "";
};

type LanguageCode = "es" | "ca" | "en" | "fr" | "ru";

const uiText: Record<
  LanguageCode,
  {
    title: string;
    searchPlaceholder: string;
    emptyState: string;
    locationButton: string;
    locationPopup: string;
    mapStyleOsm: string;
    mapStylePositron: string;
    languageLabel: string;
  }
> = {
  es: {
    title: "Guía de ventajas Piolet",
    searchPlaceholder: "Buscar por palabra clave (ej: desayuno)",
    emptyState: "No se han encontrado resultados.",
    locationButton: "Volver a mi ubicación",
    locationPopup: "Tu ubicación aproximada",
    mapStyleOsm: "OSM",
    mapStylePositron: "Claro",
    languageLabel: "🇪🇸 Español",
  },
  ca: {
    title: "Guia d'avantatges Piolet",
    searchPlaceholder: "Cerca per paraula clau (ex: esmorzar)",
    emptyState: "No s'han trobat resultats.",
    locationButton: "Tornar a la meva ubicació",
    locationPopup: "La teva ubicació aproximada",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clar",
    languageLabel: "🇦🇩 Català",
  },
  en: {
    title: "Piolet Benefits Guide",
    searchPlaceholder: "Search by keyword (e.g. breakfast)",
    emptyState: "No results found.",
    locationButton: "Back to my location",
    locationPopup: "Your approximate location",
    mapStyleOsm: "OSM",
    mapStylePositron: "Light",
    languageLabel: "🇬🇧 English",
  },
  fr: {
    title: "Guide des avantages Piolet",
    searchPlaceholder: "Rechercher par mot-clé (ex : petit-déjeuner)",
    emptyState: "Aucun résultat trouvé.",
    locationButton: "Revenir à ma position",
    locationPopup: "Votre position approximative",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clair",
    languageLabel: "🇫🇷 Français",
  },
  ru: {
    title: "Гид по преимуществам Piolet",
    searchPlaceholder: "Поиск по ключевому слову (напр. завтрак)",
    emptyState: "Ничего не найдено.",
    locationButton: "Вернуться к моему местоположению",
    locationPopup: "Ваше примерное местоположение",
    mapStyleOsm: "OSM",
    mapStylePositron: "Светлая",
    languageLabel: "🇷🇺 Русский",
  },
};

function getLang(): LanguageCode {
  const currentLang = langSelect?.value || document.documentElement.lang || "es";
  if (
    currentLang === "ca" ||
    currentLang === "en" ||
    currentLang === "fr" ||
    currentLang === "ru"
  ) {
    return currentLang;
  }
  return "es";
}

const DEFAULT_CENTER: L.LatLngTuple = [41.75, 2.2];
const DEFAULT_ZOOM = 18;
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 8000,
  maximumAge: 60000,
};

const map = L.map(mapElement).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
let userMarker: L.Marker | null = null;
const baseLayers = {
  osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }),
  positron: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 19,
    }
  ),
};

let activeBaseLayer: L.TileLayer = baseLayers.osm;
activeBaseLayer.addTo(map);
map.setMaxZoom(19);

let userLocation: { lat: number; lng: number } | null = null;

const hasValidCoordinates = (item: Pick<SearchItem, "lat" | "lng">) =>
  Number.isFinite(item.lat) &&
  Number.isFinite(item.lng) &&
  !(item.lat === 0 && item.lng === 0);

const toRad = (value: number) => (value * Math.PI) / 180;
const distanceKm = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const centerOnUser = () => {
  if (userLocation) {
    map.setView([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 18), {
      animate: true,
    });
    return;
  }
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      userLocation = { lat: latitude, lng: longitude };
      map.setView([latitude, longitude], Math.max(map.getZoom(), DEFAULT_ZOOM), {
        animate: true,
      });
    },
    (error) => {
      if (import.meta.env.DEV) {
        console.warn("Geolocation error:", error.message);
      }
    },
    GEOLOCATION_OPTIONS
  );
};

const updateUserLocation = (position: GeolocationPosition) => {
  const { latitude, longitude } = position.coords;
  userLocation = { lat: latitude, lng: longitude };
  map.setView([latitude, longitude], DEFAULT_ZOOM, { animate: true });
  const userIcon = L.icon({
    iconUrl: "/img/marker.png",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -42],
  });
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  userMarker = L.marker([latitude, longitude], { icon: userIcon })
    .addTo(map)
    .bindPopup(uiText[getLang()].locationPopup);
  applyFilter();
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    updateUserLocation,
    (error) => {
      if (import.meta.env.DEV) {
        console.warn("Geolocation error:", error.message);
      }
    },
    GEOLOCATION_OPTIONS
  );
}

const locationControl = L.Control.extend({
  onAdd() {
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control leaflet-control-zoom leaflet-control-custom-location"
    );
    const button = L.DomUtil.create("a", "leaflet-control-zoom-in", container);
    button.href = "#";
    button.title = uiText[getLang()].locationButton;
    button.setAttribute("aria-label", uiText[getLang()].locationButton);
    button.textContent = "◎";

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(button, "click", (event) => {
      L.DomEvent.preventDefault(event);
      centerOnUser();
    });

    return container;
  },
});

const locationControlInstance = new locationControl({ position: "topleft" });
locationControlInstance.addTo(map);

let activeId: string | null = null;
const defaultMarkerStyle: L.CircleMarkerOptions = {
  radius: 6,
  color: "#15803d",
  fillColor: "#22c55e",
  fillOpacity: 0.9,
  weight: 2,
};
const activeMarkerStyle: L.CircleMarkerOptions = {
  radius: 9,
  color: "#1d4ed8",
  fillColor: "#60a5fa",
  fillOpacity: 1,
  weight: 3,
};

const setActive = (
  id: string | null,
  {
    center = false,
    openPopup = false,
    scroll = false,
  }: { center?: boolean; openPopup?: boolean; scroll?: boolean } = {}
) => {
  if (activeId) {
    const previousMarker = markers.get(activeId);
    if (previousMarker) previousMarker.setStyle(defaultMarkerStyle);
    const previousCard = results?.querySelector(`.card[data-id="${activeId}"]`);
    previousCard?.classList.remove("is-active");
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
    if (scroll) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
};

const markers = new Map<string, L.CircleMarker>();
data.forEach((item) => {
  if (!hasValidCoordinates(item)) return;
  const marker = L.circleMarker([item.lat, item.lng], defaultMarkerStyle);
  const safeLogoUrl = sanitizeImageUrl(item.logo);
  const popupLogo = safeLogoUrl
    ? `<img class="popup-logo" src="${safeLogoUrl}" alt="${escapeHtml(item.title.es)}">`
    : "";
  marker.bindPopup(
    `<div class="popup-content">${popupLogo}<strong>${escapeHtml(item.title.es)}</strong><br/>${escapeHtml(item.address)}</div>`,
    { autoPan: false }
  );
  marker.on("click", () => {
    setActive(item.id, { openPopup: true, scroll: true });
  });
  markers.set(item.id, marker);
});

const updateUiText = (lang: LanguageCode) => {
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

  const locationControlButton = document.querySelector<HTMLAnchorElement>(
    ".leaflet-control-custom-location .leaflet-control-zoom-in"
  );
  if (locationControlButton) {
    locationControlButton.title = text.locationButton;
    locationControlButton.setAttribute("aria-label", text.locationButton);
  }

  const osmLabel = document.querySelector<HTMLElement>(
    '.map-style-button[data-style="osm"] .map-style-label'
  );
  const positronLabel = document.querySelector<HTMLElement>(
    '.map-style-button[data-style="positron"] .map-style-label'
  );
  if (osmLabel) osmLabel.textContent = text.mapStyleOsm;
  if (positronLabel) positronLabel.textContent = text.mapStylePositron;

  if (userMarker) {
    userMarker.setPopupContent(text.locationPopup);
  }
};

const setLanguage = (lang: LanguageCode) => {
  if (langSelect) langSelect.value = lang;
  document.documentElement.lang = lang;
  updateUiText(lang);
  applyFilter();
};

const renderList = (items: SearchItem[]) => {
  if (!results) return;
  results.innerHTML = items
    .map((item) => {
      const lang = getLang();
      const title = escapeHtml(item.title[lang] || item.title.es);
      const description = escapeHtml(item.description[lang] || item.description.es || "");
      const tags = (item.tags[lang] || item.tags.es || []).map(escapeHtml);
      const address = escapeHtml(item.address);
      const safeLogoUrl = sanitizeImageUrl(item.logo);
      const hasLogo = Boolean(safeLogoUrl);
      const logo = hasLogo
        ? `<img class="card-logo h-16 w-24 rounded-lg border border-slate-200 bg-white object-contain p-1" src="${safeLogoUrl}" alt="${title}">`
        : "";
      return `
        <li class="card ${hasLogo ? "" : "no-logo"} group relative grid gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${hasLogo ? "grid-cols-[96px_minmax(0,1fr)]" : "grid-cols-1"}" data-id="${item.id}">
          ${logo}
          <div class="card-content grid gap-1">
            <h3 class="line-clamp-2 text-sm font-semibold text-slate-900">${title}</h3>
            <p class="line-clamp-3 text-xs leading-relaxed text-slate-700">${description}</p>
            <div class="card-meta mt-1 grid gap-1">
              <div class="meta text-[11px] text-slate-500">${address}</div>
              <div class="meta text-[11px] text-slate-500">${tags.join(", ")}</div>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
};

const focusOnMarker = (id: string) => {
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

const updateMap = (items: SearchItem[]) => {
  markers.forEach((marker) => map.removeLayer(marker));
  items.forEach((item) => {
    const marker = markers.get(item.id);
    if (marker) marker.addTo(map);
  });
  map.invalidateSize();
};

const applyFilter = () => {
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
      const distA = hasValidCoordinates(a)
        ? distanceKm(origin, { lat: a.lat, lng: a.lng })
        : Number.POSITIVE_INFINITY;
      const distB = hasValidCoordinates(b)
        ? distanceKm(origin, { lat: b.lat, lng: b.lng })
        : Number.POSITIVE_INFINITY;
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
      const lang = button.dataset.langOption as LanguageCode | undefined;
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
        languageOptions[
          (currentIndex - 1 + languageOptions.length) % languageOptions.length
        ]?.focus();
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
    const target = event.target as Node;
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

const MOBILE_BREAKPOINT = "(max-width: 900px)";
const HEADER_COMPACT_ENTER_Y = 12;
const HEADER_COMPACT_EXIT_Y = 2;
let isHeaderCompact = false;

const applyHeaderCompactClasses = (shouldCompact: boolean) => {
  if (
    !appHeader ||
    !headerInner ||
    !headerMetaRow ||
    !langControls ||
    !mapStyleControls
  ) {
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

const updateHeaderCompactMode = () => {
  const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
  if (!isMobile) {
    applyHeaderCompactClasses(false);
    return;
  }
  const y = window.scrollY;
  // Keep compact mode stable while scrolling; only restore full header near top.
  const shouldCompact =
    (!isHeaderCompact && y > HEADER_COMPACT_ENTER_Y) ||
    (isHeaderCompact && y > HEADER_COMPACT_EXIT_Y);
  applyHeaderCompactClasses(shouldCompact);
};

window.addEventListener("scroll", updateHeaderCompactMode, { passive: true });
window.addEventListener("resize", updateHeaderCompactMode);
updateHeaderCompactMode();

results.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  const card = target?.closest(".card") as HTMLElement | null;
  const id = card?.dataset?.id;
  if (id) focusOnMarker(id);
});

const styleButtons = document.querySelectorAll<HTMLButtonElement>(
  ".map-style-button"
);
const applyBaseLayer = (style: keyof typeof baseLayers) => {
  map.removeLayer(activeBaseLayer);
  activeBaseLayer = baseLayers[style];
  activeBaseLayer.addTo(map);
  const maxZoom = activeBaseLayer.options.maxZoom ?? 18;
  map.setMaxZoom(maxZoom);
  if (map.getZoom() > maxZoom) {
    map.setZoom(maxZoom);
  }
};

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style as keyof typeof baseLayers | undefined;
    if (!style || !(style in baseLayers)) return;
    applyBaseLayer(style);
    styleButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

setLanguage(getLang());

requestAnimationFrame(() => {
  map.invalidateSize();
});
