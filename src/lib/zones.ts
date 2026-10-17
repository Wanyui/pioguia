import type { Localized } from "./search-index";

/** Andorran parishes, plus everything outside Andorra. Order = display order of the filter. */
export const ZONE_KEYS = [
  "andorra-la-vella",
  "escaldes-engordany",
  "encamp",
  "canillo",
  "ordino",
  "la-massana",
  "sant-julia-de-loria",
  "fuera",
] as const;

export type ZoneKey = (typeof ZONE_KEYS)[number];

const parish = (name: string): Required<Localized<string>> => ({ es: name, ca: name, en: name, fr: name, ru: name });

export const ZONES: Record<ZoneKey, { label: Required<Localized<string>>; shield?: string }> = {
  "andorra-la-vella": { label: parish("Andorra la Vella"), shield: "/img/escuts/andorra-la-vella.png" },
  "escaldes-engordany": { label: parish("Escaldes-Engordany"), shield: "/img/escuts/escaldes-engordany.png" },
  encamp: { label: parish("Encamp"), shield: "/img/escuts/encamp.png" },
  canillo: { label: parish("Canillo"), shield: "/img/escuts/canillo.png" },
  ordino: { label: parish("Ordino"), shield: "/img/escuts/ordino.png" },
  "la-massana": { label: parish("La Massana"), shield: "/img/escuts/la-massana.png" },
  "sant-julia-de-loria": { label: parish("Sant Julià de Lòria"), shield: "/img/escuts/sant-julia-de-loria.png" },
  fuera: {
    label: {
      es: "Fuera de Andorra",
      ca: "Fora d'Andorra",
      en: "Outside Andorra",
      fr: "Hors d'Andorre",
      ru: "За пределами Андорры",
    },
  },
};

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

// Towns that belong to a parish but are listed under their own name.
const TOWN_TO_PARISH: Record<string, ZoneKey> = {
  "pas de la casa": "encamp",
  soldeu: "canillo",
  "el tarter": "canillo",
  arinsal: "la-massana",
  llorts: "ordino",
  "la cortinada": "ordino",
  "santa coloma": "andorra-la-vella",
};

/** Parish of a benefit from its `city` field; anything not recognised is "fuera". */
export const zoneOf = (city: string | undefined): ZoneKey => {
  if (!city) return "fuera";
  const value = normalize(city);
  const direct = ZONE_KEYS.find((key) => key !== "fuera" && normalize(ZONES[key].label.es) === value);
  return direct ?? TOWN_TO_PARISH[value] ?? "fuera";
};
