// Client entry point (bundled to public/scripts/map.js). Wires data, map, list and controls.
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import type { SearchItem } from "../lib/search-index";
import { uiText, type LanguageCode } from "./map-i18n";
import { normalize } from "./map-utils";
import { distanceKm, getLang, hasValidCoordinates, readBenefits } from "./app/context";
import { setupLanguageMenu } from "./app/language-menu";
import { setupDetail } from "./app/detail";
import { matchesFilters, setupFilters } from "./app/filters";
import { createListView } from "./app/list-view";
import { createMapView } from "./app/map-view";
import { setupSheet } from "./app/sheet";

const dataElement = document.getElementById("benefits-data");
const mapElement = document.getElementById("map");
const results = document.getElementById("results");
if (!dataElement || !mapElement || !results) {
  throw new Error("No se encontró el contenedor del mapa o los datos.");
}

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const data = readBenefits(dataElement);
const byId = new Map(data.map((item) => [item.id, item]));
const bySlug = new Map(data.map((item) => [item.slug, item]));
const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const sheet = setupSheet();

let activeId: string | null = null;

/** Height of the mobile sheet covering the map, so centred markers stay visible above it. */
/**
 * Vertical shift for centred markers on mobile: covered bottom (sheet or detail) minus covered top
 * (floating search and filters), so the marker lands in the middle of the free area.
 */
const sheetOffset = () => {
  if (!sheet.isMobile()) return 0;
  const detail = document.getElementById("detail");
  const bottom = detail && !detail.hidden ? detail.getBoundingClientRect().height : sheet.currentHeight();
  const top = document.getElementById("app-header")?.getBoundingClientRect().bottom ?? 0;
  return bottom - top;
};

const setActive = (id: string | null, { center = false, scroll = false } = {}) => {
  if (activeId) {
    mapView.setMarkerActive(activeId, false);
    listView.setCardActive(activeId, false);
  }
  activeId = id;
  if (!id) return;
  mapView.setMarkerActive(id, true, { center, offsetY: sheetOffset() });
  listView.setCardActive(id, true, { scroll });
};

const listView = createListView({
  results,
  emptyState,
  onCardClick: (id) => {
    const item = byId.get(id);
    if (item) detail.open(item.slug);
  },
});

const mapView = createMapView({
  element: mapElement,
  data,
  onMarkerClick: (id) => {
    const item = byId.get(id);
    if (item) detail.open(item.slug);
  },
  onUserLocation: () => applyFilter(),
  bottomInset: () => sheetOffset(),
});

const filters = setupFilters(() => applyFilter({ refit: true }));

const distanceTo = (item: SearchItem) => {
  const origin = mapView.getUserLocation();
  return origin && hasValidCoordinates(item) ? distanceKm(origin, item) : undefined;
};

const notice = document.getElementById("notice");
let noticeTimer = 0;
const showNotice = (message: string) => {
  const textElement = document.getElementById("notice-text");
  if (!notice || !textElement) return;
  textElement.textContent = message;
  notice.hidden = false;
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => (notice.hidden = true), 6000);
};
document.getElementById("notice-close")?.addEventListener("click", () => notice && (notice.hidden = true));

const detail = setupDetail({
  bySlug,
  distanceOf: distanceTo,
  showNotice,
  onOpen: (item) => {
    setActive(item.id, { center: mapView.hasMarker(item.id), scroll: true });
  },
  onClose: () => setActive(null),
});
const emptyMessage = document.getElementById("empty-message");

const applyFilter = ({ refit = false } = {}) => {
  const rawQuery = searchInput?.value.trim() ?? "";
  const query = normalize(rawQuery);
  const lang = getLang();
  const textMatches: SearchItem[] = data.filter((item) => {
    if (!query) return true;
    const text = item.text?.[lang] || item.text?.all || "";
    return text.includes(query);
  });
  filters.updateCounts(textMatches);
  const filtered = textMatches.filter((item) => matchesFilters(item, filters.state));
  if (!query && !filters.isActive()) mapView.resetUserMoved();
  const origin = mapView.getUserLocation();
  const distanceOf = (item: SearchItem) =>
    origin && hasValidCoordinates(item) ? distanceKm(origin, item) : undefined;
  if (origin) {
    filtered.sort((a, b) => (distanceOf(a) ?? Infinity) - (distanceOf(b) ?? Infinity));
  }
  listView.render(filtered, lang, distanceOf);
  updateEmptyState(filtered.length === 0, rawQuery, lang);
  if (refit && filtered.length > 0 && filtered.length < data.length) mapView.fitResults(filtered);
  if (resultsCount) {
    const text = uiText[lang];
    resultsCount.textContent =
      filtered.length === 1 ? text.resultsOne : text.resultsMany.replace("{n}", String(filtered.length));
  }
  mapView.showOnly(filtered);
  if (activeId && !filtered.some((item) => item.id === activeId)) {
    setActive(null);
  } else if (activeId) {
    setActive(activeId);
  }
};

const updateEmptyState = (isEmpty: boolean, rawQuery: string, lang: LanguageCode) => {
  if (!isEmpty || !emptyMessage) return;
  const text = uiText[lang];
  emptyMessage.textContent = rawQuery ? text.emptyQuery.replace("{q}", rawQuery) : text.emptyFilters;
  document.querySelectorAll<HTMLElement>("[data-empty-action]").forEach((button) => {
    button.hidden = button.dataset.emptyAction === "filters" ? !filters.isActive() : !rawQuery;
  });
};

document.querySelectorAll<HTMLElement>("[data-empty-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.emptyAction === "filters") {
      filters.clear();
    } else if (searchInput) {
      searchInput.value = "";
      applyFilter({ refit: true });
      searchInput.focus();
    }
  });
});

const updateUiText = (lang: LanguageCode) => {
  const text = uiText[lang];
  const pageTitle = document.getElementById("page-title");
  const langTriggerLabel = document.getElementById("lang-trigger-label");
  if (pageTitle) pageTitle.textContent = text.title;
  if (searchInput) searchInput.placeholder = text.searchPlaceholder;
  filters.updateLabels(lang);
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as keyof typeof text;
    if (typeof text[key] === "string") element.textContent = text[key];
  });
  document.getElementById("filters")?.setAttribute("aria-label", text.filtersLabel);
  if (langTriggerLabel) langTriggerLabel.textContent = text.languageLabel;
  document.querySelectorAll<HTMLButtonElement>("[data-lang-option]").forEach((button) => {
    const isSelected = button.dataset.langOption === lang;
    button.classList.toggle("bg-soft", isSelected);
    button.classList.toggle("text-accent", isSelected);
    button.classList.toggle("font-semibold", isSelected);
  });

  const setLabel = (element: Element | null, label: string) => {
    element?.setAttribute("aria-label", label);
    element?.setAttribute("title", label);
  };
  setLabel(searchInput, text.searchLabel);
  setLabel(document.getElementById("locate-button"), text.locationButton);
  setLabel(document.getElementById("layers-button"), text.mapStyleToggle);
  setLabel(document.getElementById("sheet-handle"), text.sheetHandle);
  document.querySelectorAll<HTMLElement>("[data-view-button]").forEach((button) => {
    const label = button.querySelector(".view-label");
    if (label) label.textContent = button.dataset.viewButton === "list" ? text.viewList : text.viewMap;
  });

  mapView.setUserPopupText(text.locationPopup);
};

const setLanguage = (lang: LanguageCode) => {
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement | null;
  if (langSelect) langSelect.value = lang;
  document.documentElement.lang = lang;
  updateUiText(lang);
  applyFilter();
  detail.render();
};

setupLanguageMenu(setLanguage);
let searchTimer = 0;
searchInput?.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => applyFilter({ refit: true }), 150);
});

const layersButton = document.getElementById("layers-button");
layersButton?.addEventListener("click", () => {
  const light = layersButton.getAttribute("aria-pressed") !== "true";
  layersButton.setAttribute("aria-pressed", String(light));
  void mapView.applyBaseLayer(light ? "positron" : "osm");
});
document.getElementById("locate-button")?.addEventListener("click", () => mapView.centerOnUser());

mapView.requestInitialLocation();
setLanguage(getLang());
// Size the map first; centring on a benefit before that gets cancelled.
requestAnimationFrame(() => {
  mapView.map.invalidateSize();
  detail.openInitial();
});

