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
import { distanceKm, getLang, hasValidCoordinates, MOBILE_QUERY, readBenefits } from "./app/context";
import { setupCompactHeader } from "./app/header";
import { setupLanguageMenu } from "./app/language-menu";
import { createListView } from "./app/list-view";
import { createMapView, isBaseStyle } from "./app/map-view";

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
const mapContainer = mapElement.closest(".map-container") as HTMLElement | null;

let activeId: string | null = null;

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
  mapView.setMarkerActive(id, true, { center, openPopup });
  listView.setCardActive(id, true, { scroll });
};

const listView = createListView({
  results,
  emptyState,
  onCardClick: (id) => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      mapContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  onMarkerClick: (id) => setActive(id, { openPopup: true, scroll: true }),
  onUserLocation: () => applyFilter(),
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
  if (origin) {
    const distance = (item: SearchItem) =>
      hasValidCoordinates(item) ? distanceKm(origin, item) : Number.POSITIVE_INFINITY;
    filtered.sort((a, b) => distance(a) - distance(b));
  }
  listView.render(filtered, lang);
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

  const locationButton = document.querySelector<HTMLAnchorElement>(
    ".leaflet-control-custom-location .leaflet-control-zoom-in"
  );
  if (locationButton) {
    locationButton.title = text.locationButton;
    locationButton.setAttribute("aria-label", text.locationButton);
  }

  const osmLabel = document.querySelector<HTMLElement>('.map-style-button[data-style="osm"] .map-style-label');
  const positronLabel = document.querySelector<HTMLElement>(
    '.map-style-button[data-style="positron"] .map-style-label'
  );
  if (osmLabel) osmLabel.textContent = text.mapStyleOsm;
  if (positronLabel) positronLabel.textContent = text.mapStylePositron;

  mapView.setUserPopupText(text.locationPopup);
};

const setLanguage = (lang: LanguageCode) => {
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement | null;
  if (langSelect) langSelect.value = lang;
  document.documentElement.lang = lang;
  updateUiText(lang);
  applyFilter();
};

const languageMenu = setupLanguageMenu(setLanguage);
setupCompactHeader(() => languageMenu.close());
searchInput?.addEventListener("input", applyFilter);

const styleButtons = document.querySelectorAll<HTMLButtonElement>(".map-style-button");
styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const style = button.dataset.style;
    if (!isBaseStyle(style)) return;
    void mapView.applyBaseLayer(style);
    styleButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

mapView.requestInitialLocation();
setLanguage(getLang());
requestAnimationFrame(() => mapView.map.invalidateSize());
