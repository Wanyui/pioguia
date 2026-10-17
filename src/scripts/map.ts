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
const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const sheet = setupSheet();

let activeId: string | null = null;

/** Height of the mobile sheet covering the map, so centred markers stay visible above it. */
const sheetOffset = () => sheet.currentHeight();

const setActive = (
  id: string | null,
  { center = false, openPopup = false, scroll = false } = {}
) => {
  if (activeId) {
    mapView.setMarkerActive(activeId, false);
    listView.setCardActive(activeId, false);
  }
  activeId = id;
  if (!id) return;
  mapView.setMarkerActive(id, true, { center, openPopup, offsetY: sheetOffset() });
  listView.setCardActive(id, true, { scroll });
};

const listView = createListView({
  results,
  emptyState,
  onCardClick: (id) => {
    // On mobile, picking a card from the full list goes back to the map to show it.
    if (sheet.isMobile() && sheet.getSnap() === "full") {
      sheet.setSnap("half");
      // Wait for the sheet to shrink, then keep the chosen card in view.
      window.setTimeout(() => listView.scrollToCard(id), 240);
    }
    if (!mapView.hasMarker(id)) {
      setActive(id, { scroll: true });
      return;
    }
    setActive(id, { center: true, openPopup: true, scroll: true });
  },
});

const mapView = createMapView({
  element: mapElement,
  data,
  onMarkerClick: (id) => {
    if (sheet.isMobile() && sheet.getSnap() === "peek") sheet.setSnap("half");
    setActive(id, { openPopup: true, scroll: true });
  },
  onUserLocation: () => applyFilter(),
  bottomInset: () => sheetOffset(),
});

const applyFilter = () => {
  const query = normalize(searchInput?.value ?? "");
  const lang = getLang();
  const filtered: SearchItem[] = data.filter((item) => {
    if (!query) return true;
    const text = item.text?.[lang] || item.text?.all || "";
    return text.includes(query);
  });
  const origin = mapView.getUserLocation();
  const distanceOf = (item: SearchItem) =>
    origin && hasValidCoordinates(item) ? distanceKm(origin, item) : undefined;
  if (origin) {
    filtered.sort((a, b) => (distanceOf(a) ?? Infinity) - (distanceOf(b) ?? Infinity));
  }
  listView.render(filtered, lang, distanceOf);
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

const updateUiText = (lang: LanguageCode) => {
  const text = uiText[lang];
  const pageTitle = document.getElementById("page-title");
  const langTriggerLabel = document.getElementById("lang-trigger-label");
  if (pageTitle) pageTitle.textContent = text.title;
  if (searchInput) searchInput.placeholder = text.searchPlaceholder;
  if (emptyState) emptyState.textContent = text.emptyState;
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
};

setupLanguageMenu(setLanguage);
searchInput?.addEventListener("input", applyFilter);

const layersButton = document.getElementById("layers-button");
layersButton?.addEventListener("click", () => {
  const light = layersButton.getAttribute("aria-pressed") !== "true";
  layersButton.setAttribute("aria-pressed", String(light));
  void mapView.applyBaseLayer(light ? "positron" : "osm");
});
document.getElementById("locate-button")?.addEventListener("click", () => mapView.centerOnUser());

mapView.requestInitialLocation();
setLanguage(getLang());
requestAnimationFrame(() => mapView.map.invalidateSize());
