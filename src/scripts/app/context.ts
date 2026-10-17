import type { SearchItem } from "../../lib/search-index";
import { resolveLanguage, type LanguageCode } from "../map-i18n";

export type LatLng = { lat: number; lng: number };

export const MOBILE_QUERY = "(max-width: 900px)";

export const readBenefits = (element: HTMLElement): SearchItem[] => {
  try {
    const parsed = JSON.parse(element.textContent ?? "[]");
    return Array.isArray(parsed) ? (parsed as SearchItem[]) : [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("No se pudo leer los datos del mapa", error);
    }
    return [];
  }
};

export const getLang = (): LanguageCode => {
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement | null;
  return resolveLanguage(langSelect?.value || document.documentElement.lang || "es");
};

export const hasValidCoordinates = (item: Pick<SearchItem, "lat" | "lng">) =>
  Number.isFinite(item.lat) && Number.isFinite(item.lng) && !(item.lat === 0 && item.lng === 0);

const toRad = (value: number) => (value * Math.PI) / 180;

export const distanceKm = (from: LatLng, to: LatLng) => {
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
