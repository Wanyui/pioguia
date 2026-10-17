import L from "leaflet";
import type { SearchItem } from "../../lib/search-index";
import { uiText } from "../map-i18n";
import { escapeHtml } from "../map-utils";
import { getLang, hasValidCoordinates, type LatLng } from "./context";
import { buildPopupHtml } from "./map-popup";

const DEFAULT_CENTER: L.LatLngTuple = [41.75, 2.2];
// Fallback view when there are no benefits with coordinates.
const DEFAULT_ZOOM = 8;
const LOCATION_ZOOM = 18;
const BASE_MAX_ZOOM = 19;
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 8000,
  maximumAge: 60000,
};

export type BaseStyle = "osm" | "positron";
export const isBaseStyle = (value: string | undefined): value is BaseStyle =>
  value === "osm" || value === "positron";

// Colours come from CSS (.pg-marker in index.css) so they follow the design tokens and dark mode.
const defaultMarkerStyle: L.CircleMarkerOptions = {
  radius: 6,
  fillOpacity: 1,
  weight: 2,
  className: "pg-marker",
};
const activeMarkerStyle: L.CircleMarkerOptions = {
  radius: 9,
  fillOpacity: 1,
  weight: 3,
  className: "pg-marker",
};

type MapViewOptions = {
  element: HTMLElement;
  data: SearchItem[];
  onMarkerClick: (id: string) => void;
  onUserLocation: () => void;
};

export const createMapView = ({ element, data, onMarkerClick, onUserLocation }: MapViewOptions) => {
  const map = L.map(element).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  map.setMaxZoom(BASE_MAX_ZOOM);

  // ----- Base layers -----
  const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: BASE_MAX_ZOOM,
  });

  // CARTO's raster Positron now requires an API key; OpenFreeMap serves the same
  // style as free vector tiles. MapLibre is heavy, so it is loaded on first use.
  let positronLayer: L.Layer | null = null;
  const loadPositronLayer = async () => {
    if (!positronLayer) {
      await import("@maplibre/maplibre-gl-leaflet");
      // The plugin's types omit Leaflet's own `attribution` layer option.
      const options: L.LeafletMaplibreGLOptions & L.LayerOptions = {
        style: "https://tiles.openfreemap.org/styles/positron",
        attribution:
          '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; OpenStreetMap contributors',
      };
      positronLayer = L.maplibreGL(options);
    }
    return positronLayer;
  };

  let activeBaseLayer: L.Layer = osmLayer;
  activeBaseLayer.addTo(map);

  let requestedStyle: BaseStyle = "osm";
  const applyBaseLayer = async (style: BaseStyle) => {
    requestedStyle = style;
    let layer: L.Layer;
    try {
      layer = style === "positron" ? await loadPositronLayer() : osmLayer;
    } catch (error) {
      console.error("No se pudo cargar el estilo de mapa.", error);
      return;
    }
    // Ignore a slow load if the user picked another style meanwhile.
    if (requestedStyle !== style || layer === activeBaseLayer) return;
    map.removeLayer(activeBaseLayer);
    activeBaseLayer = layer;
    activeBaseLayer.addTo(map);
  };

  // ----- Benefit markers -----
  const markers = new Map<string, L.CircleMarker>();
  data.forEach((item) => {
    if (!hasValidCoordinates(item)) return;
    const marker = L.circleMarker([item.lat, item.lng], defaultMarkerStyle);
    marker.bindPopup(buildPopupHtml(item), { autoPan: false });
    marker.on("click", () => onMarkerClick(item.id));
    markers.set(item.id, marker);
  });

  const bounds = L.latLngBounds(
    data.filter(hasValidCoordinates).map((item): L.LatLngTuple => [item.lat, item.lng])
  );
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [24, 24] });
  }

  const showOnly = (items: SearchItem[]) => {
    markers.forEach((marker) => map.removeLayer(marker));
    items.forEach((item) => markers.get(item.id)?.addTo(map));
    map.invalidateSize();
  };

  const setMarkerActive = (id: string, active: boolean, { center = false, openPopup = false } = {}) => {
    const marker = markers.get(id);
    if (!marker) return;
    marker.setStyle(active ? activeMarkerStyle : defaultMarkerStyle);
    marker.getElement()?.classList.toggle("is-active", active);
    if (!active) return;
    marker.bringToFront();
    if (center) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 18), { animate: true });
    }
    if (openPopup) marker.openPopup();
  };

  // ----- User location -----
  let userLocation: LatLng | null = null;
  let userMarker: L.Marker | null = null;

  const updateUserLocation = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    userLocation = { lat: latitude, lng: longitude };
    map.setView([latitude, longitude], LOCATION_ZOOM, { animate: true });
    const userIcon = L.icon({
      iconUrl: "/img/marker.png",
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -42],
    });
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([latitude, longitude], { icon: userIcon })
      .addTo(map)
      .bindPopup(uiText[getLang()].locationPopup);
    onUserLocation();
  };

  // High accuracy often times out on desktops without GPS, so retry once with
  // a coarse fix unless the user denied permission.
  const requestUserLocation = (
    onSuccess: PositionCallback,
    onError?: (error: GeolocationPositionError) => void
  ) => {
    const fail = (error: GeolocationPositionError) => {
      if (import.meta.env.DEV) {
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
          enableHighAccuracy: false,
        });
      },
      GEOLOCATION_OPTIONS
    );
  };

  const showLocationError = (error?: GeolocationPositionError) => {
    const text = uiText[getLang()];
    const message =
      error && error.code === error.PERMISSION_DENIED ? text.locationDenied : text.locationUnavailable;
    L.popup().setLatLng(map.getCenter()).setContent(escapeHtml(message)).openOn(map);
  };

  const centerOnUser = () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), LOCATION_ZOOM), {
        animate: true,
      });
      return;
    }
    if (!("geolocation" in navigator)) {
      showLocationError();
      return;
    }
    requestUserLocation(updateUserLocation, showLocationError);
  };

  const LocationControl = L.Control.extend({
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
  new LocationControl({ position: "topleft" }).addTo(map);

  const requestInitialLocation = () => {
    if ("geolocation" in navigator) requestUserLocation(updateUserLocation);
  };

  const setUserPopupText = (text: string) => userMarker?.setPopupContent(text);

  return {
    map,
    applyBaseLayer,
    showOnly,
    setMarkerActive,
    hasMarker: (id: string) => markers.has(id),
    centerOnUser,
    requestInitialLocation,
    setUserPopupText,
    getUserLocation: () => userLocation,
  };
};

export type MapView = ReturnType<typeof createMapView>;
