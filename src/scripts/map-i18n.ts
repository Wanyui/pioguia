export type LanguageCode = "es" | "ca" | "en" | "fr" | "ru";

export const uiText: Record<
  LanguageCode,
  {
    title: string;
    searchPlaceholder: string;
    emptyState: string;
    locationButton: string;
    locationPopup: string;
    locationDenied: string;
    locationUnavailable: string;
    mapStyleOsm: string;
    mapStylePositron: string;
    languageLabel: string;
    searchLabel: string;
    viewList: string;
    viewMap: string;
    mapStyleToggle: string;
    sheetHandle: string;
    resultsOne: string;
    resultsMany: string;
    distanceAway: string;
    filtersLabel: string;
    zoneButton: string;
    clearFilters: string;
    clearSearch: string;
    emptyQuery: string;
    emptyFilters: string;
    close: string;
    directions: string;
    call: string;
    website: string;
    email: string;
    share: string;
    linkCopied: string;
    address: string;
    showCard: string;
    unavailable: string;
  }
> = {
  es: {
    title: "Guía de ventajas Piolet",
    searchPlaceholder: "Buscar por palabra clave (ej: desayuno)",
    emptyState: "No se han encontrado resultados.",
    locationButton: "Volver a mi ubicación",
    locationPopup: "Tu ubicación aproximada",
    locationDenied: "Activa el permiso de ubicación del navegador para ver dónde estás.",
    locationUnavailable: "No se ha podido obtener tu ubicación. Inténtalo de nuevo.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Claro",
    languageLabel: "🇪🇸 Español",
    searchLabel: "Buscar ventajas",
    viewList: "Lista",
    viewMap: "Mapa",
    mapStyleToggle: "Mapa claro",
    sheetHandle: "Ampliar o reducir la lista",
    resultsOne: "1 ventaja",
    resultsMany: "{n} ventajas",
    distanceAway: "a {d}",
    filtersLabel: "Filtros",
    zoneButton: "Zona",
    clearFilters: "Quitar filtros",
    clearSearch: "Borrar búsqueda",
    emptyQuery: "Vaya, no hay «{q}» por aquí. Prueba con otra palabra o quita los filtros.",
    emptyFilters: "Vaya, no hay ventajas con estos filtros.",
    close: "Cerrar",
    directions: "Cómo llegar",
    call: "Llamar",
    website: "Web",
    email: "Email",
    share: "Compartir",
    linkCopied: "Enlace copiado",
    address: "Dirección",
    showCard: "Presenta tu carnet del Club Piolet.",
    unavailable: "Esta ventaja ya no está disponible.",
  },
  ca: {
    title: "Guia d'avantatges Piolet",
    searchPlaceholder: "Cerca per paraula clau (ex: esmorzar)",
    emptyState: "No s'han trobat resultats.",
    locationButton: "Tornar a la meva ubicació",
    locationPopup: "La teva ubicació aproximada",
    locationDenied: "Activa el permís d'ubicació del navegador per veure on ets.",
    locationUnavailable: "No s'ha pogut obtenir la teva ubicació. Torna-ho a provar.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clar",
    languageLabel: "🇦🇩 Català",
    searchLabel: "Cerca avantatges",
    viewList: "Llista",
    viewMap: "Mapa",
    mapStyleToggle: "Mapa clar",
    sheetHandle: "Amplia o redueix la llista",
    resultsOne: "1 avantatge",
    resultsMany: "{n} avantatges",
    distanceAway: "a {d}",
    filtersLabel: "Filtres",
    zoneButton: "Zona",
    clearFilters: "Treu els filtres",
    clearSearch: "Esborra la cerca",
    emptyQuery: "Vaja, no hi ha «{q}» per aquí. Prova una altra paraula o treu els filtres.",
    emptyFilters: "Vaja, no hi ha avantatges amb aquests filtres.",
    close: "Tanca",
    directions: "Com arribar-hi",
    call: "Truca",
    website: "Web",
    email: "Correu",
    share: "Comparteix",
    linkCopied: "Enllaç copiat",
    address: "Adreça",
    showCard: "Presenta el teu carnet del Club Piolet.",
    unavailable: "Aquest avantatge ja no està disponible.",
  },
  en: {
    title: "Piolet Benefits Guide",
    searchPlaceholder: "Search by keyword (e.g. breakfast)",
    emptyState: "No results found.",
    locationButton: "Back to my location",
    locationPopup: "Your approximate location",
    locationDenied: "Allow location access in your browser to see where you are.",
    locationUnavailable: "Your location could not be determined. Please try again.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Light",
    languageLabel: "🇬🇧 English",
    searchLabel: "Search benefits",
    viewList: "List",
    viewMap: "Map",
    mapStyleToggle: "Light map",
    sheetHandle: "Expand or collapse the list",
    resultsOne: "1 benefit",
    resultsMany: "{n} benefits",
    distanceAway: "{d} away",
    filtersLabel: "Filters",
    zoneButton: "Area",
    clearFilters: "Clear filters",
    clearSearch: "Clear search",
    emptyQuery: "Oh, there's no “{q}” around here. Try another word or clear the filters.",
    emptyFilters: "Oh, there are no benefits with these filters.",
    close: "Close",
    directions: "Directions",
    call: "Call",
    website: "Website",
    email: "Email",
    share: "Share",
    linkCopied: "Link copied",
    address: "Address",
    showCard: "Show your Club Piolet card.",
    unavailable: "This benefit is no longer available.",
  },
  fr: {
    title: "Guide des avantages Piolet",
    searchPlaceholder: "Rechercher par mot-clé (ex : petit-déjeuner)",
    emptyState: "Aucun résultat trouvé.",
    locationButton: "Revenir à ma position",
    locationPopup: "Votre position approximative",
    locationDenied: "Autorisez la localisation dans votre navigateur pour voir où vous êtes.",
    locationUnavailable: "Impossible d'obtenir votre position. Veuillez réessayer.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Clair",
    languageLabel: "🇫🇷 Français",
    searchLabel: "Rechercher des avantages",
    viewList: "Liste",
    viewMap: "Carte",
    mapStyleToggle: "Carte claire",
    sheetHandle: "Agrandir ou réduire la liste",
    resultsOne: "1 avantage",
    resultsMany: "{n} avantages",
    distanceAway: "à {d}",
    filtersLabel: "Filtres",
    zoneButton: "Zone",
    clearFilters: "Effacer les filtres",
    clearSearch: "Effacer la recherche",
    emptyQuery: "Mince, pas de « {q} » par ici. Essaie un autre mot ou enlève les filtres.",
    emptyFilters: "Mince, aucun avantage avec ces filtres.",
    close: "Fermer",
    directions: "Itinéraire",
    call: "Appeler",
    website: "Site web",
    email: "E-mail",
    share: "Partager",
    linkCopied: "Lien copié",
    address: "Adresse",
    showCard: "Présente ta carte du Club Piolet.",
    unavailable: "Cet avantage n'est plus disponible.",
  },
  ru: {
    title: "Гид по преимуществам Piolet",
    searchPlaceholder: "Поиск по ключевому слову (напр. завтрак)",
    emptyState: "Ничего не найдено.",
    locationButton: "Вернуться к моему местоположению",
    locationPopup: "Ваше примерное местоположение",
    locationDenied: "Разрешите доступ к местоположению в браузере, чтобы увидеть, где вы находитесь.",
    locationUnavailable: "Не удалось определить ваше местоположение. Попробуйте ещё раз.",
    mapStyleOsm: "OSM",
    mapStylePositron: "Светлая",
    languageLabel: "🇷🇺 Русский",
    searchLabel: "Искать предложения",
    viewList: "Список",
    viewMap: "Карта",
    mapStyleToggle: "Светлая карта",
    sheetHandle: "Развернуть или свернуть список",
    resultsOne: "Предложений: 1",
    resultsMany: "Предложений: {n}",
    distanceAway: "{d} от тебя",
    filtersLabel: "Фильтры",
    zoneButton: "Район",
    clearFilters: "Сбросить фильтры",
    clearSearch: "Очистить поиск",
    emptyQuery: "Хм, «{q}» здесь нет. Попробуй другое слово или сбрось фильтры.",
    emptyFilters: "Хм, с этими фильтрами ничего нет.",
    close: "Закрыть",
    directions: "Маршрут",
    call: "Позвонить",
    website: "Сайт",
    email: "Почта",
    share: "Поделиться",
    linkCopied: "Ссылка скопирована",
    address: "Адрес",
    showCard: "Покажи свою карту Club Piolet.",
    unavailable: "Это предложение больше недоступно.",
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

