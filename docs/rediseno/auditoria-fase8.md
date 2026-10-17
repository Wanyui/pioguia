# Auditoría de la fase 8 — Web Interface Guidelines

> Revisión con la skill `web-design-guidelines` (reglas fijadas, commit 434b7f9) sobre
> `src/components/App.astro`, `src/styles/*.css` y `src/scripts/**/*.ts` de la rama `feature/nuevo-diseno`.
> Estado: hallazgos corregidos en la fase 8 (2026-10-18), con la salvedad anotada en `translate="no"`.

## src/components/App.astro

- App.astro:63 - `theme-color` es el acento; debe coincidir con el fondo (claro #f4f3ef / oscuro #121614) → **grave**
- App.astro:98 - `role="listbox"` con `<button>` sin `role="option"` → ARIA inválido para lectores de pantalla → **grave**
- App.astro:81 - el input de búsqueda no tiene `name` ni `enterkeyhint="search"` → menor
- App.astro:86, 202, 212 - "Pioguia" y "Club Piolet" sin `translate="no"` (el traductor del navegador los rompe) → menor
  (Corregido solo para la marca "Pioguia" del buscador; "Club Piolet" va dentro de frases traducidas y se deja así.)

## src/styles

- components.css / layout.css - no hay `touch-action: manipulation` ni `-webkit-tap-highlight-color` intencionado → menor
- layout.css:255 - cabecera flotante sin `env(safe-area-inset-top)` (muesca del iPhone en horizontal / PWA) → menor
- components.css:258, layout.css:382 - transiciones de la flecha de "Zona" y de la hoja de detalle sin variante `prefers-reduced-motion` → menor
- components.css - los chips no tienen estado `hover` → menor
- index.css:55-200 - estilos `.popup-*` sin uso desde la fase 5 (código muerto) → limpieza

## src/scripts

- map-card.ts:20 - `<img>` del logo sin `width`/`height` (riesgo de saltos de maquetación) → **grave**
- map-card.ts:8-12 - formato de distancia a mano; usar `Intl.NumberFormat` → menor
- app/map-view.ts:148, 164, 247 - animaciones de zoom del mapa sin respetar `prefers-reduced-motion` → **grave**
- list-view.ts - lista de 82 elementos sin `content-visibility` (regla de >50) → menor

## Pasan

- Botones solo con icono con `aria-label` (✕, capas, ubicación, asa, cerrar detalle/aviso)
- Foco visible global con `:focus-visible`; `outline: none` del input solo con sustituto `:focus-within`
- Enlace para saltar al contenido, jerarquía h1 (panel) → h2 (detalle, "Acerca de")
- `aria-live` en el contador de resultados; aviso con `role="status"`
- Gestos (arrastrar la hoja, deslizar el detalle) con alternativa de toque y teclado (asa, Lista | Mapa, ✕, Esc)
- `Intl.DateTimeFormat` para la fecha de revisión; idioma detectado con `navigator.languages`
- `overscroll-behavior: contain` en hoja y detalle; `color-scheme: light dark`
- Sin `user-scalable=no`, sin `transition: all`, sin `autoFocus`

## Hallazgos extra de las pruebas con teclado

- Tras los filtros, el Tab entraba en el mapa y recorría 82 marcadores antes de llegar a la lista → **grave**.
  Arreglado: la lista va antes que el mapa en el orden del documento y los marcadores no son tabulables
  (la lista ofrece lo mismo).

## Rendimiento (móvil, 4G simulado 1,6 Mbps / 150 ms, CPU ×4, sin caché)

| | Producción actual | Rediseño |
|---|---|---|
| HTML por página | — | 521 KB → **202 KB** (gzip 80 → 45 KB) |
| JavaScript inicial (gzip) | — | 95 → **56 KB** |
| Transferido en la carga | 1.586 KB | **408 KB** |
| LCP (tesela del mapa) | 11,0 s | **2,8–3,3 s** (servidor local sin compresión) |

Cambios: índice de búsqueda generado en el navegador (antes 254 KB repetidos en cada página), JSON-LD de la
portada como lista de enlaces, bundle minificado, `modulepreload` del chunk de Leaflet y `preconnect` a OSM.
