import L from "leaflet";
import { CATEGORIES } from "../../lib/categories";
import type { SearchItem } from "../../lib/search-index";
import { icon } from "../../icons";
import { uiText } from "../map-i18n";
import { escapeHtml } from "../map-utils";
import { distanceKm, getLang, hasValidCoordinates, type LatLng } from "./context";
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

/** Circular marker with the category colour and icon (styles in components.css). */
const markerIcon = (item: SearchItem) => {
  const category = CATEGORIES[item.category];
  return L.divIcon({
    className: "pg-marker-icon",
    html: `<span class="pg-marker" style="--cat: var(${category.color})">${icon(category.icon)}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
};

type MapViewOptions = {
  element: HTMLElement;
  data: SearchItem[];
  onMarkerClick: (id: string) => void;
  onUserLocation: () => void;
  /** Pixels of map hidden at the bottom (mobile sheet), so framing keeps things visible. */
  bottomInset?: () => number;
};

export const createMapView = ({ element, data, onMarkerClick, onUserLocation, bottomInset = () => 0 }: MapViewOptions) => {
  const map = L.map(element, { zoomControl: false }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  L.control.zoom({ position: "bottomright" }).addTo(map);
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
  const markers = new Map<string, L.Marker>();
  data.forEach((item) => {
    if (!hasValidCoordinates(item)) return;
    const marker = L.marker([item.lat, item.lng], {
      icon: markerIcon(item),
      title: item.title.es,
      alt: item.title.es,
      riseOnHover: true,
    });
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

  /** Centres a point, shifted up by `offsetY` px so it stays visible above the mobile sheet. */
  const centerOn = (latLng: L.LatLngExpression, zoom: number, offsetY = 0) => {
    const point = map.project(latLng, zoom).add([0, offsetY / 2]);
    map.setView(map.unproject(point, zoom), zoom, { animate: true });
  };

  const setMarkerActive = (
    id: string,
    active: boolean,
    { center = false, openPopup = false, offsetY = 0 } = {}
  ) => {
    const marker = markers.get(id);
    if (!marker) return;
    marker.getElement()?.querySelector(".pg-marker")?.classList.toggle("is-active", active);
    marker.setZIndexOffset(active ? 1000 : 0);
    if (!active) return;
    if (center) centerOn(marker.getLatLng(), Math.max(map.getZoom(), 17), offsetY);
    if (openPopup) marker.openPopup();
  };

  // ----- User location -----
  let userLocation: LatLng | null = null;
  let userMarker: L.Marker | null = null;

  const updateUserLocation = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    userLocation = { lat: latitude, lng: longitude };
    frameUserAndNearest();
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

  /** Frames the user together with the 3 closest benefits, above the mobile sheet. */
  const frameUserAndNearest = () => {
    if (!userLocation) return;
    const origin = userLocation;
    const nearest = data
      .filter(hasValidCoordinates)
      .map((item) => ({ item, d: distanceKm(origin, item) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map(({ item }): L.LatLngTuple => [item.lat, item.lng]);
    const frame = L.latLngBounds([[origin.lat, origin.lng], ...nearest]);
    map.fitBounds(frame, {
      paddingTopLeft: [32, 80],
      paddingBottomRight: [64, bottomInset() + 32],
      maxZoom: LOCATION_ZOOM - 1,
      animate: true,
    });
  };

  const showLocationError = (error?: GeolocationPositionError) => {
    const text = uiText[getLang()];
    const message =
      error && error.code === error.PERMISSION_DENIED ? text.locationDenied : text.locationUnavailable;
    L.popup().setLatLng(map.getCenter()).setContent(escapeHtml(message)).openOn(map);
  };

  const centerOnUser = () => {
    if (userLocation) {
      frameUserAndNearest();
      return;
    }
    if (!("geolocation" in navigator)) {
      showLocationError();
      return;
    }
    requestUserLocation(updateUserLocation, showLocationError);
  };


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
