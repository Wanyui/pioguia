# Plan de implementación — Rediseño de Pioguia

> Secuencia de construcción del rediseño en la rama `feature/nuevo-diseno`.
> Se basa en [01-PRD](01-PRD.md), [03-FLUJOS](03-FLUJOS.md), [04-DESIGN](04-DESIGN.md) y el [brandbook](marca/modules/90_SYNTHESIS.md).
> Estado: **borrador para revisar**.

## Cómo trabajamos

- **Una fase = uno o varios commits en la rama**, y al final de cada fase la web funciona. Nada se rompe a medias.
- **Verificación en cada fase**: `npm run build` + capturas con `playwright-cli` en móvil (390 px) y escritorio
  (1280 px), en claro y oscuro. Las capturas se te enseñan antes de seguir.
- **Preview online**: al terminar la fase 3, propongo subir la rama a GitHub para que Vercel genere una URL de
  preview. Producción (`main`) no se toca hasta la fase 9.
- **Sin dependencias nuevas en tiempo de ejecución**: fuentes, iconos e imágenes dentro del proyecto. Las únicas
  dependencias npm nuevas son de build, si hacen falta.
- **Sin framework nuevo**: seguimos con Astro + TypeScript sin librerías de UI, como ahora. El JavaScript del cliente
  se divide en módulos pequeños en lugar de un `map.ts` de 600 líneas.

## Resumen

| Fase | Qué | Tamaño | Depende de |
|---|---|---|---|
| 0 | Cimientos: tokens, fuente, iconos y tema claro/oscuro | S | — |
| 1 | Datos: "Tiendas", etiqueta corta y "a quién aplica" | M | — |
| 2 | Estructura: mapa protagonista, hoja inferior y Lista \| Mapa | L | 0 |
| 3 | Tarjetas y marcadores nuevos | M | 0, 1, 2 |
| 4 | Filtros por categoría y zona + estado vacío | M | 2, 3 |
| 5 | Detalle y página propia por beneficio | L | 3 |
| 6 | "Cerca de mí" bajo demanda e idioma recordado | S | 3 |
| 7 | Textos con la nueva voz, aviso y "Acerca de" | M | 2-6 |
| 8 | Calidad: accesibilidad, navegadores y rendimiento | M | todo |
| 9 | Lanzamiento: preview, revisión y fusión en `main` | S | 8 |

Las fases 0 y 1 son independientes entre sí y pueden ir en paralelo.

---

## Fase 0 · Cimientos (S)

- Tokens de `04-DESIGN.md` como variables CSS en `src/styles/tokens.css`, enlazadas con `@theme` de Tailwind 4
  (`bg-surface`, `text-muted`, `bg-accent`…). Tema oscuro con `prefers-color-scheme`.
- **Rubik** auto-alojada: `@fontsource-variable/rubik` como dependencia de build y archivos `woff2` (latin,
  latin-ext y cyrillic) servidos desde el propio sitio.
- **Iconos Lucide**: copiar los ~20 SVG necesarios a `src/icons/` con un helper para insertarlos en línea.
  Licencia ISC anotada.
- Mapa de categorías (clave → nombre en 5 idiomas, icono y colores) en `src/lib/categories.ts`.
- **Hecho cuando**: la web actual se ve igual pero con Rubik y los tokens; el modo oscuro del sistema la cambia de tema.

## Fase 1 · Datos (M)

- Esquema (`src/content/config.ts`):
  - `category` pasa a ser una **clave** (`deportes`, `ocio`, `tiendas`, `educacion`, `servicios`,
    `restauracion`), con los nombres traducidos en `categories.ts`. Así "Moda" → "Tiendas" se cambia en un solo sitio.
  - Nuevos campos localizados opcionales: `highlight` ("−15%", "2x1", "Gratis") y `appliesTo`
    ("tú + 3 acompañantes", "3–13 años").
- Script de extracción semiautomática que propone `highlight` y `appliesTo` para los 82 beneficios a partir de la
  descripción. **Lo revisas tú** en una tabla antes de aplicarlo.
- Actualizar `docs/CONTENT.md` con los campos nuevos.
- **Hecho cuando**: el build valida los 82 archivos y todos tienen categoría por clave y `highlight` revisado en los 5 idiomas.

## Fase 2 · Estructura (L)

- Reorganizar `index.astro` en componentes: `SearchBar`, `FilterChips`, `MapView`, `ResultsSheet`,
  `ViewToggle`, `MapControls`.
- **Móvil**: mapa a pantalla completa, buscador y chips flotando arriba, hoja inferior con 3 alturas y conmutador
  Lista | Mapa abajo. Sin saltos de scroll.
- **Escritorio**: columna de 400 px a la izquierda y mapa a la derecha.
- Dividir `map.ts` en módulos: `state.ts` (búsqueda, filtros, selección, vista), `map-view.ts`, `list-view.ts`, `sheet.ts`.
- **Hecho cuando**: búsqueda, idioma, lista ↔ mapa sincronizados y "Cerca de mí" funcionan como hoy con la nueva estructura.

## Fase 3 · Tarjetas y marcadores (M)

- Tarjeta nueva: logo, escudo o icono · nombre · categoría + distancia o parroquia · etiqueta de descuento + a quién aplica.
- Marcadores circulares por categoría (30 px) y marcador activo (38 px con aro del acento).
- Respaldo de logo: escudo de la parroquia en Andorra; icono de categoría fuera de Andorra.
- Optimizar imágenes: `public/img` pesa 3,6 MB (`marker.png` ocupa 428 KB para mostrarse a 48 px). Pasar a WebP o SVG y a tamaños reales.
- **Hecho cuando**: las capturas en móvil y escritorio coinciden con la dirección Bosc. → **Propuesta de subir la rama para tener preview**.

## Fase 4 · Filtros y estado vacío (M)

- Chips de categoría con contador y chips de zona (parroquias de Andorra + "Fuera de Andorra"). Lógica: OR dentro
  de un grupo y AND entre grupos, combinada con la búsqueda.
- "Quitar filtros", contador de resultados con `aria-live` y reencuadre del mapa salvo si el usuario lo ha movido a mano.
- Estado vacío con el texto del brandbook.
- **Hecho cuando**: cualquier combinación de texto, categoría y zona da resultados coherentes en lista, mapa y contador.

## Fase 5 · Detalle y páginas por beneficio (L)

- Hoja completa en móvil y panel en escritorio, con la estructura de `04-DESIGN.md §5.7`. Cierre con ✕, Esc o deslizando; el foco vuelve a la tarjeta.
- **Página propia** `/beneficio/<id>` generada en build (`getStaticPaths`) con su título, descripción, Open Graph y
  JSON-LD. Abre la app con ese beneficio en el detalle.
- Botón "Compartir" (Web Share API, o copiar el enlace en escritorio). Añadir las páginas al `sitemap.xml`.
- Beneficio archivado o inexistente: aviso "Esta ventaja ya no está disponible".
- **Hecho cuando**: cada uno de los 82 beneficios tiene URL propia, compartible, y Google puede indexarla.

## Fase 6 · Cerca de mí e idioma (S)

- La ubicación **solo se pide al pulsar** "Cerca de mí" (hoy se pide al cargar). Distancia en cada tarjeta, orden por
  cercanía con indicador "Ordenado por cercanía · ✕".
- Idioma: guardado en `localStorage` → idioma del navegador → español. Se conservan los filtros y el detalle al cambiarlo.
- **Pendiente heredado**: probar el botón ◎ con GPS real tras reiniciar el Mac.
- **Hecho cuando**: sin permiso de ubicación no se pide nada al cargar; con permiso, el orden y las distancias son correctos.

## Fase 7 · Textos, aviso y "Acerca de" (M)

- Reescribir todos los textos de la interfaz con la voz del brandbook en los 5 idiomas (tuteo, también en ruso).
- Pie "Web no oficial · Guía 2026 del Club Piolet" con enlace a la fuente, y hoja "Acerca de" con el texto personal y la fecha de revisión.
- Lema en el título y en la meta description: "Las ventajas del Club Piolet, fáciles de encontrar".
- **Hecho cuando**: no queda ningún texto de la interfaz antigua y todo pasa las 3 comprobaciones de voz.

## Fase 8 · Calidad (M)

- Auditoría con `web-design-guidelines` y corrección de todo lo grave.
- Pruebas con `playwright-cli` de los flujos F1-F10 en Chrome, Firefox y WebKit, con emulación de iPhone y Android, en claro y oscuro y en los 5 idiomas (francés y ruso para textos largos).
- Rendimiento: el JavaScript inicial no supera al de hoy (map.js ~31 KB + chunk de Leaflet); MapLibre sigue diferido; LCP < 2,5 s en 4G simulado.
- Sin errores en consola ni 404.
- **Hecho cuando**: todo lo anterior está en verde y documentado.

## Fase 9 · Lanzamiento (S)

- Revisas la preview de Vercel de la rama.
- Pull request `feature/nuevo-diseno` → `main` con el resumen y las capturas.
- Fusionar con tu OK y comprobar el deploy de producción con Playwright.
- Antes: subir el arreglo pendiente del escudo de Sant Julià (ya está en `main` local).

## Fase 2 del producto (después del lanzamiento)

Favoritos en el dispositivo · QR de la guía en el detalle · marcar "Nuevo en 2026" · aviso de vigencia ("hasta 31/12/2026") · clústeres de marcadores si hacen falta.

## Riesgos y cómo los cubrimos

| Riesgo | Mitigación |
|---|---|
| Romper la sincronización lista ↔ mapa al dividir `map.ts` | Fase 2 dedicada solo a reestructurar, comprobando que todo funciona igual |
| `highlight` mal extraído | Revisión manual en tabla antes de aplicar (fase 1) |
| Hoja inferior con gestos que fallan en algún móvil | Alturas fijas con botones además del gesto; pruebas en WebKit y Android |
| Páginas por beneficio que duplican contenido | Una sola plantilla, URL canónica por beneficio y `noindex` en nada |
| El rediseño se alarga | Cada fase deja la rama funcionando; se puede lanzar tras la 8 sin la "fase 2 del producto" |
