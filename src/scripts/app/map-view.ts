import L from "leaflet";
import { CATEGORIES } from "../../lib/categories";
import type { SearchItem } from "../../lib/search-index";
import { icon } from "../../icons";
import { uiText } from "../map-i18n";
import { distanceKm, getLang, hasValidCoordinates, type LatLng } from "./context";

const DEFAULT_CENTER: L.LatLngTuple = [41.75, 2.2];
// Fallback view when there are no benefits with coordinates.
const DEFAULT_ZOOM = 8;
const LOCATION_ZOOM = 18;
const BASE_MAX_ZOOM = 19;
// Coarse (Wi-Fi / network) location first: fast and enough for "what's near me". GPS-level
// accuracy can take the whole timeout on computers without GPS, so it is only the retry.
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
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
  /** Location could not be obtained: "denied" (permission) or "unavailable" (error, timeout, unsupported). */
  onLocationError: (reason: "denied" | "unavailable") => void;
  /** Pixels of map hidden at the bottom (mobile sheet), so framing keeps things visible. */
  bottomInset?: () => number;
};

export const createMapView = ({
  element,
  data,
  onMarkerClick,
  onUserLocation,
  onLocationError,
  bottomInset = () => 0,
}: MapViewOptions) => {
  const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const map = L.map(element, {
    zoomControl: false,
    zoomAnimation: animate,
    fadeAnimation: animate,
    markerZoomAnimation: animate,
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
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
      // The list offers the same benefits; 82 tab stops on the map would trap keyboard users.
      keyboard: false,
    });
    marker.on("click", () => onMarkerClick(item.id));
    markers.set(item.id, marker);
  });

  const bounds = L.latLngBounds(
    data.filter(hasValidCoordinates).map((item): L.LatLngTuple => [item.lat, item.lng])
  );
  if (bounds.isValid()) {
    // Instant: an animated first fit would swallow a centring requested right after load.
    map.fitBounds(bounds, { padding: [24, 24], animate: false });
  }

  // Track whether the user moved the map by hand, so filtering does not fight them.
  let programmatic = false;
  let userMoved = false;
  const asProgram = (move: () => void) => {
    programmatic = true;
    move();
    window.setTimeout(() => (programmatic = false), 450);
  };
  map.on("dragstart zoomstart", () => {
    if (!programmatic) userMoved = true;
  });

  /** Re-frames the map on the given results unless the user has moved it since the last reset. */
  const fitResults = (items: SearchItem[]) => {
    if (userMoved) return;
    const points = items.filter(hasValidCoordinates).map((item): L.LatLngTuple => [item.lat, item.lng]);
    if (points.length === 0) return;
    asProgram(() => {
      if (points.length === 1) {
        centerOn(points[0]!, Math.max(map.getZoom(), 15), bottomInset());
      } else {
        map.fitBounds(L.latLngBounds(points), {
          paddingTopLeft: [32, 120],
          paddingBottomRight: [64, bottomInset() + 32],
          maxZoom: 16,
          animate,
        });
      }
    });
  };

  const showOnly = (items: SearchItem[]) => {
    markers.forEach((marker) => map.removeLayer(marker));
    items.forEach((item) => markers.get(item.id)?.addTo(map));
    map.invalidateSize();
  };

  /** Centres a point, shifted up by `offsetY` px so it stays visible above the mobile sheet. */
  function centerOn(latLng: L.LatLngExpression, zoom: number, offsetY = 0) {
    const point = map.project(latLng, zoom).add([0, offsetY / 2]);
    programmatic = true;
    map.setView(map.unproject(point, zoom), zoom, { animate });
    window.setTimeout(() => (programmatic = false), 450);
  }

  const setMarkerActive = (
    id: string,
    active: boolean,
    { center = false, offsetY = 0 } = {}
  ) => {
    const marker = markers.get(id);
    if (!marker) return;
    marker.getElement()?.querySelector(".pg-marker")?.classList.toggle("is-active", active);
    marker.setZIndexOffset(active ? 1000 : 0);
    if (!active) return;
    if (center) centerOn(marker.getLatLng(), Math.max(map.getZoom(), 17), offsetY);
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

  // If the coarse fix fails (and permission was not denied), retry once asking for high accuracy.
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
          enableHighAccuracy: true,
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
    programmatic = true;
    window.setTimeout(() => (programmatic = false), 450);
    map.fitBounds(frame, {
      paddingTopLeft: [32, 80],
      paddingBottomRight: [64, bottomInset() + 32],
      maxZoom: LOCATION_ZOOM - 1,
      animate,
    });
  };

  const reportError = (error?: GeolocationPositionError) =>
    onLocationError(error && error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");

  const centerOnUser = () => {
    if (userLocation) {
      frameUserAndNearest();
      return;
    }
    if (!("geolocation" in navigator)) {
      reportError();
      return;
    }
    requestUserLocation(updateUserLocation, reportError);
  };



  const setUserPopupText = (text: string) => userMarker?.setPopupContent(text);

  return {
    map,
    applyBaseLayer,
    showOnly,
    fitResults,
    resetUserMoved: () => (userMoved = false),
    setMarkerActive,
    hasMarker: (id: string) => markers.has(id),
    centerOnUser,
    setUserPopupText,
    getUserLocation: () => userLocation,
  };
};

export type MapView = ReturnType<typeof createMapView>;
