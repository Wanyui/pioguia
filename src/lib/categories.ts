import type { IconName } from "../icons";
import type { Localized } from "./search-index";

export const CATEGORY_KEYS = [
  "deportes",
  "ocio",
  "tiendas",
  "educacion",
  "servicios",
  "restauracion",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

type Category = {
  label: Required<Localized<string>>;
  icon: IconName;
  /** Tailwind/CSS colour token suffix: --pg-cat-<key> (marker fill) and --pg-cat-<key>-text. */
  color: `--pg-cat-${CategoryKey}`;
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  deportes: {
    label: { es: "Deportes", ca: "Esports", en: "Sports", fr: "Sports", ru: "Спорт" },
    icon: "mountainSnow",
    color: "--pg-cat-deportes",
  },
  ocio: {
    label: { es: "Ocio", ca: "Oci", en: "Leisure", fr: "Loisirs", ru: "Досуг" },
    icon: "ferrisWheel",
    color: "--pg-cat-ocio",
  },
  tiendas: {
    label: { es: "Tiendas", ca: "Botigues", en: "Shops", fr: "Boutiques", ru: "Магазины" },
    icon: "shoppingBag",
    color: "--pg-cat-tiendas",
  },
  educacion: {
    label: { es: "Educación", ca: "Educació", en: "Education", fr: "Éducation", ru: "Образование" },
    icon: "landmark",
    color: "--pg-cat-educacion",
  },
  servicios: {
    label: { es: "Servicios", ca: "Serveis", en: "Services", fr: "Services", ru: "Услуги" },
    icon: "conciergeBell",
    color: "--pg-cat-servicios",
  },
  restauracion: {
    label: { es: "Restauración", ca: "Restauració", en: "Dining", fr: "Restauration", ru: "Рестораны" },
    icon: "utensils",
    color: "--pg-cat-restauracion",
  },
};

// Content still stores the Spanish label (phase 1 of the redesign moves it to a key).
const LEGACY_LABELS: Record<string, CategoryKey> = {
  Deportes: "deportes",
  Ocio: "ocio",
  Moda: "tiendas",
  Tiendas: "tiendas",
  Tecnología: "tiendas",
  Educación: "educacion",
  Servicios: "servicios",
  Restauración: "restauracion",
};

export const categoryKeyFromLabel = (label: string | undefined): CategoryKey | undefined =>
  label ? LEGACY_LABELS[label.trim()] : undefined;
