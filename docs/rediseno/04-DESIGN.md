---
version: 1.0
name: Pioguia — Bosc
description: >
  Guía de ventajas cerca de ti, con el mapa como protagonista. Dirección "Bosc": Rubik (redondeada y
  amable), verde pino como único acento, neutros cálidos de piedra, marcadores circulares de color por
  categoría con icono blanco y etiqueta de descuento sólida. Inspirada en el orden de Geocaching:
  mucha información, poco ruido. Claro u oscuro según el dispositivo.

colors:
  light:
    bg: "#f4f3ef"
    surface: "#ffffff"
    soft: "#eef1ec"
    ink: "#17201b"
    muted: "#5d6a63"
    line: "#e3e6e1"
    accent: "#1d7a4f"
    on-accent: "#ffffff"
    focus: "#1d7a4f"
    me: "#2a7bf6"
  dark:
    bg: "#121614"
    surface: "#1d2320"
    soft: "#26302b"
    ink: "#eef3ef"
    muted: "#9aa8a0"
    line: "#2c3530"
    accent: "#4cc38a"
    on-accent: "#0b1a12"
    focus: "#4cc38a"
    me: "#5b9cff"
  category:
    deportes:     { base: "#0e7c86", dark-text: "#3fb8c1", icon: "mountain-snow" }
    ocio:         { base: "#6d4ad6", dark-text: "#a08cf2", icon: "ferris-wheel" }
    tiendas:      { base: "#c2387a", dark-text: "#ec74a8", icon: "shopping-bag" }
    educacion:    { base: "#a8661a", dark-text: "#dda04a", icon: "landmark" }
    servicios:    { base: "#3e6fb0", dark-text: "#7aa5e6", icon: "concierge-bell" }
    restauracion: { base: "#d0561f", dark-text: "#f28b57", icon: "utensils" }

typography:
  family: "Rubik"        # variable 300–900, OFL, auto-alojada (latin, latin-ext, cyrillic)
  fallback: "system-ui, -apple-system, 'Segoe UI', sans-serif"
  scale:
    title:   { size: 20px, weight: 700, line: 1.2 }
    heading: { size: 17px, weight: 600, line: 1.25 }
    name:    { size: 15px, weight: 600, line: 1.2 }
    body:    { size: 15px, weight: 400, line: 1.45 }
    meta:    { size: 13px, weight: 400, line: 1.35 }
    small:   { size: 12px, weight: 400, line: 1.3 }
    tag:     { size: 15px, weight: 800, line: 1 }
    tag-xl:  { size: 22px, weight: 800, line: 1 }

rounded:
  sm: 8px      # etiqueta de descuento
  md: 14px     # logos, botones flotantes, tarjetas en escritorio
  lg: 22px     # hoja inferior
  pill: 999px  # buscador, chips, conmutador

spacing: [4, 8, 12, 16, 20, 24, 32]   # px; ritmo base 4

shadow:
  float: "0 2px 10px rgba(20,30,25,.14)"
  sheet: "0 -6px 24px rgba(0,0,0,.12)"
  marker: "0 0 0 3px var(--surface), 0 2px 6px rgba(0,0,0,.3)"

breakpoints:
  mobile: "< 900px"
  desktop: ">= 900px"
---

# DESIGN.md — Pioguia (dirección "Bosc")

> Sistema visual del rediseño. Sale del [brandbook](marca/modules/90_SYNTHESIS.md), el [PRD](01-PRD.md) y
> los [flujos](03-FLUJOS.md). Prototipo de referencia: [comparativa de direcciones](prototipos/direcciones-claro.png) del 2026-10-17 (opción A; [versión oscura](prototipos/direcciones-oscuro.png)).

## 1. Principios

1. **El mapa manda.** En móvil, el mapa ocupa la pantalla y todo lo demás flota encima (Geocaching).
2. **Ordenado aunque haya mucha información.** Jerarquía estricta: **descuento** y **distancia** →
   nombre → categoría o zona → el resto, en el detalle. Lo contrario de "todo grita igual".
3. **Se distingue sin leer.** Cada beneficio lleva icono y color de categoría, y su logo o escudo de parroquia.
   Un niño tiene que poder señalar "ese".
4. **Un solo acento.** El verde pino es para acciones y estado activo. Los colores de categoría sirven solo
   para identificar, nunca para llamar la atención.
5. **Sin adornos.** Nada de degradados, ilustraciones de relleno, animaciones de scroll, badges de "nuevo" por
   todas partes ni banners.

## 2. Color

- Los tokens están en el frontmatter. Se implementan como **variables CSS** en `:root`. El tema oscuro se aplica
  con `@media (prefers-color-scheme: dark)`, según el dispositivo y sin interruptor manual.
- **Contraste comprobado (WCAG 2.2 AA):**
  - Texto: ink/surface 16,7:1 (claro) · 14,2:1 (oscuro); muted/surface 5,7:1 · 6,5:1; acento como
    texto 5,3:1 · 7,2:1.
  - Etiqueta de descuento: blanco sobre el acento 5,3:1 (claro) · tinta oscura sobre el acento 8,1:1 (oscuro).
  - Marcadores: icono blanco sobre el color base de categoría ≥ 4,2:1 (las 6 categorías).
  - Iconos de categoría sobre superficie: en claro, el color base (≥ 4,2:1); en oscuro, `dark-text` (≥ 5,7:1).
- **El color nunca es la única señal**: la categoría siempre lleva icono y, donde hay espacio, su nombre.
- Mapa en tema oscuro: las teselas OSM se oscurecen con un filtro CSS (`brightness .7, contrast 1.1,
  saturate .6`). El estilo "Claro" (OpenFreeMap Positron) se queda como opción en el selector de capas.

## 3. Tipografía

- **Rubik** variable (300–900), licencia OFL, **auto-alojada** en `public/fonts/` con los subconjuntos `latin`,
  `latin-ext` (catalán) y `cyrillic` (ruso). `font-display: swap`. Nada de Google Fonts ni CDNs.
- Los pesos se usan con intención: 400 para texto, 600 para nombres y títulos, 800 solo para la etiqueta de descuento.
- Tamaño mínimo 12 px (solo metadatos secundarios). El texto de lectura empieza en 15 px.
- Números tabulares (`font-variant-numeric: tabular-nums`) en distancias y precios.

## 4. Iconografía

- **Lucide** (licencia ISC). Los SVG se copian al proyecto (`src/icons/`) y se insertan en línea, sin CDN.
- Trazo de 2 px, 16 px en la interfaz y 13 px dentro de marcadores y chips.
- Iconos de categoría: Deportes `mountain-snow` · Ocio `ferris-wheel` · Tiendas `shopping-bag` ·
  Educación `landmark` · Servicios `concierge-bell` · Restauración `utensils`.
- Interfaz: `search`, `sliders-horizontal`, `locate-fixed`, `layers`, `list`, `map`, `phone`, `navigation`,
  `globe`, `x`, `chevron-right`, `share-2`.

## 5. Componentes

### 5.1 Buscador (flotante, arriba)
Píldora de 46 px de alto, fondo `surface` con sombra `float`. Icono de lupa, placeholder "Buscar ventajas…"
y la marca "Pioguia" en verde a la derecha. Al escribir aparece ✕ para limpiar.

### 5.2 Chips de filtro
Píldoras de 34 px con scroll horizontal. Llevan un círculo de 22 px con el icono (color de categoría + icono blanco)
y el texto. El primero es **"Cerca de mí"**. Activo: fondo `ink` y texto `bg`. Se muestra el contador cuando hay filtros.

### 5.3 Marcador del mapa
Círculo de 30 px con el color base de la categoría, icono blanco de 13 px y aro de 3 px del color `surface`.
- **Activo**: 38 px, aro del acento y elevado por encima del resto.
- **Usuario**: punto azul (`me`) de 16 px con halo.
- Con mucha densidad (zoom bajo): ❓ agrupar en clústeres con número (decidir en la implementación).

### 5.4 Hoja inferior (móvil)
Radio `lg` arriba y asa de 38×5 px. Tres alturas: **mínima** (título y conteo), **media** (2-3 tarjetas, por
defecto) y **completa** (lista). Cabecera: "Cerca de ti" o "Resultados" + "Ordenado por cercanía · N".

### 5.5 Tarjeta de beneficio
Rejilla `46px | 1fr | auto`:
- **Logo** 46×46 con radio `md` y fondo `soft`: el logo real, o el **escudo de la parroquia** (Andorra), o el
  icono de categoría (fuera de Andorra).
- **Centro**: nombre (`name`, 2 líneas como mucho) y una línea `meta` con el icono de categoría en su color +
  la categoría + "·" + la distancia o la parroquia.
- **Derecha**: **etiqueta de descuento** (`tag`, fondo acento, radio `sm`) y debajo, en `small`, a quién
  aplica ("3–13 años", "tú + 3 acompañantes").
- Separadores de 1 px `line`, sin sombras por tarjeta. Al tocarla se abre el detalle.

### 5.6 Etiqueta de descuento
El elemento más visible de la tarjeta. Texto muy corto: "−15%", "2x1", "Gratis", "9 €", "−4 €". Siempre en el
acento. En el detalle se usa `tag-xl`.

### 5.7 Detalle (hoja completa en móvil, panel lateral en escritorio)
Orden: logo, nombre y categoría · **etiqueta XL + a quién aplica** · **2 botones principales grandes**
("Cómo llegar" con fondo acento, "Llamar" con borde) · distancia y zona con escudo · descripción completa ·
condiciones en lista · teléfonos, web y email en filas con chevron · "Compartir". Cierre con ✕ o deslizando.

### 5.8 Conmutador Lista | Mapa (móvil)
Píldora flotante centrada abajo, con fondo `surface` y sombra. Segmento activo con fondo acento y texto `on-accent`.

### 5.9 Botones flotantes del mapa
44×44, radio `md`, fondo `surface` e icono en el acento: **capas** (OSM / Claro) y **centrar en mí**. Columna a la derecha.

### 5.10 Pie, aviso y "Acerca de"
Pie en `small` `muted`: "Web no oficial · Guía 2026 del Club Piolet · Acerca de". El "Acerca de" es una hoja con
el texto personal del brandbook, la fecha de la última revisión y cómo avisar de errores.

### 5.11 Estados
- **Vacío**: icono de lupa grande en `muted` + "Vaya, no hay «x» por aquí. Prueba con otra palabra o quita los
  filtros." + botones "Quitar filtros" y "Borrar búsqueda".
- **Cargando**: esqueletos de tarjeta en `soft` (sin animación brillante; como mucho una opacidad suave).
- **Error de ubicación**: aviso en la hoja con los textos ya definidos en `map-i18n.ts`.

## 6. Escritorio (≥ 900 px)

Columna izquierda de 400 px (buscador, chips y lista con scroll propio) y mapa a la derecha a pantalla completa. El
detalle se abre como panel sobre la lista. Mismos componentes; las tarjetas pueden mostrar 3 líneas de descripción.

## 7. Movimiento

Solo para orientar: hoja y panel con 200 ms `ease-out`; el mapa centra con la animación propia de Leaflet. Con
`prefers-reduced-motion` no hay animaciones. Prohibido animar al hacer scroll.

## 8. Accesibilidad e idiomas

- Objetivos táctiles ≥ 44 px en controles principales (≥ 24 px como mínimo absoluto).
- Foco visible: anillo de 2 px `focus` con 2 px de separación, en todos los elementos interactivos.
- Marcadores accesibles con teclado (o lista equivalente) y nombre accesible "Caldea, Ocio, Gratis, a 280 m".
- Textos en 5 idiomas con la voz del brandbook (tuteo en todos, también "ты"). Hay que probar el diseño con las
  cadenas más largas (francés y ruso).
- `lang` dinámico en `<html>` y anuncio de resultados con `aria-live="polite"`.

## 9. Sí / no

| Sí | No |
|---|---|
| Descuento y distancia lo primero | Párrafos en la tarjeta |
| Un acento verde | Varios colores compitiendo por la atención |
| Icono + color por categoría | Solo color, o tarjetas idénticas |
| Escudo de la parroquia como respaldo | Huecos vacíos |
| Fuentes e iconos en el proyecto | Google Fonts, CDNs de iconos |
| Claro/oscuro según el dispositivo | Interruptor manual o tema fijo |
| "Vaya, no hay…" | "¡Ups! 🍕", exclamaciones, emojis |

## 10. Pendiente para la implementación

- Campos de datos `highlight` (etiqueta corta) y `appliesTo` (a quién aplica) en los 5 idiomas.
- Renombrar la categoría "Moda" → "Tiendas" en el contenido.
- ❓ Clústeres de marcadores con zoom bajo.
- Auditoría final con `web-design-guidelines` y pruebas con `playwright-cli` (Chrome, Firefox, WebKit, móvil).
