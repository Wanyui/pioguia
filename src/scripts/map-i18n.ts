export type LanguageCode = "es" | "ca" | "en" | "fr" | "ru";

export const uiText: Record<
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

export const resolveLanguage = (currentLang: string | null | undefined): LanguageCode => {
  if (
    currentLang === "ca" ||
    currentLang === "en" ||
    currentLang === "fr" ||
    currentLang === "ru"
  ) {
    return currentLang;
  }
  return "es";
};

