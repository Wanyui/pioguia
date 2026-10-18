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
    nearMe: string;
    sortedByDistance: string;
    stopSorting: string;
    titleNear: string;
    unofficial: string;
    sourceLink: string;
    about: string;
    aboutTitle: string;
    aboutStory: string;
    aboutIndependent: string;
    aboutData: string;
    aboutGuide: string;
    aboutReport: string;
    aboutReportLink: string;
    skipToList: string;
  }
> = {
  es: {
    title: "Ventajas",
    searchPlaceholder: "Buscar ventajas…",
    emptyState: "No se han encontrado resultados.",
    locationButton: "Ver dónde estoy",
    locationPopup: "Estás aquí",
    locationDenied: "No vemos tu ubicación. Actívala en el navegador para ver lo que tienes cerca.",
    locationUnavailable: "Vaya, no hemos podido encontrarte. Inténtalo otra vez.",
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
    nearMe: "Cerca de mí",
    sortedByDistance: "Ordenado por cercanía",
    stopSorting: "Quitar orden por cercanía",
    titleNear: "Cerca de ti",
    unofficial: "Web no oficial",
    sourceLink: "Guía {year} del Club Piolet",
    about: "Acerca de",
    aboutTitle: "Acerca de Pioguia",
    aboutStory: "Pioguia nació para tener las ventajas del Club Piolet siempre a mano en el móvil. La hice para usarla con mi hija, y ahora es para cualquiera: las mismas ventajas, con buscador, en el mapa y a un toque.",
    aboutIndependent: "Es una web independiente y sin publicidad, que complementa la guía oficial del Club Piolet.",
    aboutData: "Datos de la guía {year}, revisados en {date}.",
    aboutGuide: "Ver la guía oficial",
    aboutReport: "¿Ves algún error en una ficha?",
    aboutReportLink: "Avísame en GitHub",
    skipToList: "Ir a la lista",
  },
  ca: {
    title: "Avantatges",
    searchPlaceholder: "Cerca avantatges…",
    emptyState: "No s'han trobat resultats.",
    locationButton: "Veure on soc",
    locationPopup: "Ets aquí",
    locationDenied: "No veiem la teva ubicació. Activa-la al navegador per veure què tens a prop.",
    locationUnavailable: "Vaja, no t'hem pogut trobar. Torna-ho a provar.",
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
    nearMe: "A prop meu",
    sortedByDistance: "Ordenat per proximitat",
    stopSorting: "Treu l'ordre per proximitat",
    titleNear: "A prop teu",
    unofficial: "Web no oficial",
    sourceLink: "Guia {year} del Club Piolet",
    about: "Sobre Pioguia",
    aboutTitle: "Sobre Pioguia",
    aboutStory: "Pioguia va néixer per tenir els avantatges del Club Piolet sempre a mà al mòbil. La vaig fer per fer-la servir amb la meva filla, i ara és per a tothom: els mateixos avantatges, amb cercador, al mapa i a un toc.",
    aboutIndependent: "És una web independent i sense publicitat, que complementa la guia oficial del Club Piolet.",
    aboutData: "Dades de la guia {year}. Última revisió: {date}.",
    aboutGuide: "Veure la guia oficial",
    aboutReport: "Hi veus algun error en una fitxa?",
    aboutReportLink: "Avisa'm a GitHub",
    skipToList: "Ves a la llista",
  },
  en: {
    title: "Benefits",
    searchPlaceholder: "Search benefits…",
    emptyState: "No results found.",
    locationButton: "Show where I am",
    locationPopup: "You're here",
    locationDenied: "We can't see your location. Turn it on in your browser to see what's near you.",
    locationUnavailable: "Oh, we couldn't find you. Try again.",
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
    nearMe: "Near me",
    sortedByDistance: "Sorted by distance",
    stopSorting: "Stop sorting by distance",
    titleNear: "Near you",
    unofficial: "Unofficial site",
    sourceLink: "Club Piolet {year} guide",
    about: "About",
    aboutTitle: "About Pioguia",
    aboutStory: "Pioguia was born to keep the Club Piolet benefits always at hand on your phone. I made it to use with my daughter, and now it's for everyone: the same benefits, searchable, on the map and one tap away.",
    aboutIndependent: "It's an independent, ad-free site that complements the official Club Piolet guide.",
    aboutData: "Data from the {year} guide, reviewed in {date}.",
    aboutGuide: "See the official guide",
    aboutReport: "Spotted a mistake in a benefit?",
    aboutReportLink: "Tell me on GitHub",
    skipToList: "Skip to the list",
  },
  fr: {
    title: "Avantages",
    searchPlaceholder: "Chercher un avantage…",
    emptyState: "Aucun résultat trouvé.",
    locationButton: "Voir où je suis",
    locationPopup: "Tu es ici",
    locationDenied: "On ne voit pas ta position. Active-la dans ton navigateur pour voir ce qu'il y a près de toi.",
    locationUnavailable: "Mince, on n'a pas pu te trouver. Réessaie.",
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
    nearMe: "Près de moi",
    sortedByDistance: "Trié par proximité",
    stopSorting: "Ne plus trier par proximité",
    titleNear: "Près de toi",
    unofficial: "Site non officiel",
    sourceLink: "Guide {year} du Club Piolet",
    about: "À propos",
    aboutTitle: "À propos de Pioguia",
    aboutStory: "Pioguia est né pour avoir les avantages du Club Piolet toujours à portée de main sur le mobile. Je l'ai fait pour l'utiliser avec ma fille, et maintenant il est pour tout le monde : les mêmes avantages, faciles à chercher, sur la carte et en un geste.",
    aboutIndependent: "C'est un site indépendant et sans publicité, qui complète le guide officiel du Club Piolet.",
    aboutData: "Données du guide {year}, revues en {date}.",
    aboutGuide: "Voir le guide officiel",
    aboutReport: "Tu vois une erreur dans une fiche ?",
    aboutReportLink: "Préviens-moi sur GitHub",
    skipToList: "Aller à la liste",
  },
  ru: {
    title: "Предложения",
    searchPlaceholder: "Поиск предложений…",
    emptyState: "Ничего не найдено.",
    locationButton: "Где я",
    locationPopup: "Ты здесь",
    locationDenied: "Не видим, где ты. Включи геолокацию в браузере, чтобы увидеть, что рядом.",
    locationUnavailable: "Хм, не получилось тебя найти. Попробуй ещё раз.",
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
    nearMe: "Рядом со мной",
    sortedByDistance: "По расстоянию",
    stopSorting: "Убрать сортировку по расстоянию",
    titleNear: "Рядом с тобой",
    unofficial: "Неофициальный сайт",
    sourceLink: "Гид Club Piolet {year}",
    about: "О сайте",
    aboutTitle: "О Pioguia",
    aboutStory: "Pioguia появилась, чтобы предложения Club Piolet всегда были под рукой в телефоне. Сначала это был проект для себя и дочки, а теперь он для всех: те же предложения, с поиском, на карте и в одно касание.",
    aboutIndependent: "Это независимый сайт без рекламы, который дополняет официальный гид Club Piolet.",
    aboutData: "Данные гида {year}. Последняя проверка: {date}",
    aboutGuide: "Официальный гид",
    aboutReport: "Видишь ошибку в карточке?",
    aboutReportLink: "Напиши мне на GitHub",
    skipToList: "К списку",
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

