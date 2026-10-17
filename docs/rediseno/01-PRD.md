# PRD — Rediseño de Pioguia

> Documento de requisitos de producto del rediseño (rama `feature/nuevo-diseno`).
> Estado: **aprobado** (2026-10-17). Las decisiones están en la sección 9.

## 1. Contexto

Pioguia es una **web independiente y no oficial** que hace accesible la guía anual de ventajas del
Club Piolet. Hoy la única forma de consultar esas ventajas es descargar el PDF desde la web del club.
Pioguia extrae ese contenido y lo convierte en un buscador con mapa: 82 beneficios
(63 en la guía 2026, algunos con varias sedes) en Andorra, Cataluña y Teruel. Es una web
estática (Astro) desplegada en Vercel. Tiene una sola página con buscador, selector de idioma (5 idiomas),
un listado de tarjetas y un mapa sincronizado.

Funciona, pero tiene limitaciones:

- **Aspecto genérico**: tarjetas amarillas iguales, sin jerarquía ni identidad de Club Piolet.
- **Encontrar es difícil si no sabes qué buscar**: solo hay búsqueda por texto, sin filtros
  por categoría ni por parroquia o zona.
- **Información incompleta en la tarjeta**: la descripción se corta a 3 líneas y no hay vista
  de detalle con dirección, horarios ni condiciones completas.
- **Móvil mejorable**: lista y mapa compiten por la pantalla; al tocar una tarjeta la página salta al mapa.
- **No recuerda nada**: siempre abre en español, sin detectar el idioma del navegador, y no
  se puede compartir el enlace a un beneficio concreto.
- **Logos**: 54 de 82 beneficios no tienen logo (se muestra el escudo de la parroquia o un hueco).

## 2. Objetivos

1. Que un socio encuentre **en menos de 30 segundos** una ventaja relevante para él: cerca,
   del tipo que busca y en su idioma.
2. Que la web tenga **identidad propia (Pioguia)** y deje de parecer una plantilla, dejando claro que
   **no es la web oficial** del Club Piolet.
3. Que funcione **perfecta en móvil**, que es el uso principal (no hay analítica; es el supuesto acordado).
4. Que sea **accesible** (WCAG 2.2 AA) y rápida en conexiones lentas.
5. Mantener el flujo de trabajo actual: el contenido se sigue editando en `src/content/benefits/*.md`
   y la revisión anual de la guía no cambia.

### No objetivos

- No hay cuentas de usuario, login ni backend: la web sigue siendo estática.
- No se gestiona el carnet de socio ni se valida la pertenencia al club.
- No se cambia la fuente de datos: no habrá CMS ni base de datos.
- No se rehace el mapa con otra tecnología: Leaflet, OSM y OpenFreeMap se quedan.

## 3. Usuarios

Público general: la web es libre y abierta a cualquiera. Para disfrutar de las ventajas hace falta el
carnet de socio del Club Piolet, pero no para consultarlas.

| Perfil | Necesidad | Contexto |
|---|---|---|
| **Familia socia en Andorra** (principal) | "¿Qué puedo hacer este finde con los niños y dónde me hacen descuento?" | Móvil, en casa o por la calle, catalán o castellano |
| **Familia de viaje o excursión** | "Vamos a Barcelona, Roses o Teruel: ¿qué ventajas hay por allí?" | Móvil, planificando |
| **Socio en el punto de venta** | "¿Qué descuento me hacen aquí y qué tengo que enseñar?" | Móvil, delante del mostrador, con prisa |
| **Familia residente extranjera** | Lo mismo, en francés, inglés o ruso | Móvil o escritorio |
| **Curioso o futuro socio** | "¿Qué ventajas tiene ser del Club Piolet?" | Móvil o escritorio, sin carnet todavía |

## 4. Alcance funcional

Prioridades: **P0** imprescindible para lanzar el rediseño · **P1** muy recomendable · **P2** opcional o futuro.

### 4.1 Se mantiene (con nuevo diseño)

| Función | Prioridad |
|---|---|
| Listado de todos los beneficios | P0 |
| Búsqueda por texto en el idioma activo | P0 |
| Mapa con un marcador por beneficio, sincronizado con el listado (marcador activo) | P0 |
| 5 idiomas (es, ca, en, fr, ru) con fallback a español | P0 |
| "Cerca de mí": ubicación del usuario, su icono en el mapa y orden por distancia | P0 |
| Acciones rápidas: abrir en Google Maps, llamar y web | P0 |
| Estilos de mapa OSM / Claro (se mantienen los dos) | P0 |

### 4.2 Se mejora o se añade

| Función | Prioridad | Notas |
|---|---|---|
| **Vista de detalle de un beneficio** con la descripción completa, dirección, todos los teléfonos, web, email, cómo llegar y condiciones | P0 | Panel lateral en escritorio y hoja inferior en móvil |
| **Filtros por categoría** (Deportes, Ocio, Tiendas, Educación, Servicios, Restauración) | P0 | Las categorías ya existen en los datos; "Moda" pasa a llamarse **Tiendas** |
| **Filtro por zona**: parroquias de Andorra y "Fuera de Andorra" | P0 | Con público general (también gente de fuera o de viaje), la zona es clave. Se deriva del campo `city` |
| **Aviso "web no oficial"** con enlace a la fuente (PDF y web del Club Piolet) y fecha de la guía | P0 | En el pie y en "Acerca de" |
| **Móvil: alternar lista ↔ mapa** sin saltos de scroll | P0 | |
| **Recordar el idioma** elegido y detectar el del navegador la primera vez | P1 | En `localStorage`, sin cookies de terceros |
| **Página propia por beneficio** (`/beneficio/<id>`), compartible e indexable por Google | P1 | Útil para WhatsApp y redes |
| **Estado vacío útil** ("Sin resultados para «x»" + quitar filtros) | P0 | |
| **Logos**: sin logo, en Andorra se mantiene el **escudo de la parroquia** (indica dónde está); fuera de Andorra, icono de categoría en vez de un hueco | P0 | Conseguir los logos reales es tarea de contenido, aparte |
| Indicar **novedades 2026** (beneficios nuevos o reactivados) | P2 | Se puede derivar de las marcas `Beneficio 2026-N` |
| Mostrar el **código QR** de la guía en los beneficios que lo piden (Marineland, Aquàrium…) | Fase 2 | El QR solo está impreso en el PDF; se mostraría su imagen en el detalle para poder usarlo desde la web. Pendiente desde la revisión 2026 |
| **Vigencia**: avisar si una ventaja tiene fecha de fin (p. ej. "hasta 31/12/2026") | P2 | Hoy solo está en el texto |
| Favoritos (botón ♡ y lista "Mis favoritos") guardados solo en el dispositivo | Fase 2 | Sin cuentas ni envío de datos |

## 5. Requisitos no funcionales

- **Sin dependencias de terceros en tiempo de ejecución**: fuentes, iconos e imágenes alojados en el propio
  proyecto, sin CDNs. Única excepción aceptada: las teselas del mapa (OSM y OpenFreeMap).
- **Rendimiento**: LCP < 2,5 s en móvil 4G. El JavaScript inicial no debe crecer respecto al actual
  (MapLibre sigue cargándose solo al elegir "Claro").
- **Accesibilidad**: WCAG 2.2 AA (contraste, foco visible, navegación por teclado, objetivos táctiles de
  ≥ 24 px, lectores de pantalla), auditada con `web-design-guidelines`.
- **Responsive**: desde 320 px de ancho hasta escritorio grande; se prueba con Playwright en Chrome,
  Firefox, WebKit (Safari) y emulación de móvil.
- **Privacidad**: la ubicación nunca sale del dispositivo; sin analítica de terceros.
- **SEO básico**: título, descripción, Open Graph y JSON-LD como ahora, y una URL por beneficio si se aprueba.
- **Contenido**: el esquema de `src/content/config.ts` puede ampliarse (p. ej. `validUntil`), pero sin
  romper los 82 archivos existentes.

## 6. Diseño (resumen; el detalle irá en `04-DESIGN.md`)

- Identidad propia de **Pioguia**: cercana, familiar, de Andorra y de montaña, con calidez.
  **No imita la marca del Club Piolet** (logo, colores ni tipografía oficiales) para no parecer la web
  oficial. El nombre "Club Piolet" se usa solo para describir la fuente.
- Referencias a estudiar: Airbnb (listado más mapa) en `~/.claude/design-md`, sin copiar su identidad.
- Proceso previsto: entrevista `brand-discovery` (opcional) → `design-system` (tokens y DESIGN.md) →
  `design-taste-frontend` / `redesign-existing-projects` → auditoría con `web-design-guidelines` → pruebas con `playwright-cli`.

## 7. Criterios de aceptación del lanzamiento

- [ ] Todas las funciones P0 implementadas en los 5 idiomas.
- [ ] Los 82 beneficios se ven, se buscan, se filtran y aparecen en el mapa.
- [ ] Sin errores en consola ni recursos 404 (incluidos los logos).
- [ ] Auditoría de accesibilidad sin incidencias graves.
- [ ] Probado en móvil (iPhone y Android emulados) y en escritorio.
- [ ] Preview de Vercel revisado y aprobado por ti antes de fusionar en `main`.

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| Muchos beneficios sin logo hacen que el diseño se vea vacío | Respaldo visual por categoría y campaña para pedir logos |
| Más funciones implican más JavaScript y una web más lenta | Presupuesto de rendimiento y carga diferida |
| Romper la sincronización lista ↔ mapa, que hoy funciona | Pruebas con Playwright de los flujos clave |
| Textos largos en ruso o francés que rompen el diseño | Probar cada pantalla en los 5 idiomas |
| Que se confunda con la web oficial del Club Piolet | Identidad propia, aviso visible "web no oficial" y enlace a la fuente |
| Datos desactualizados respecto al PDF | Mostrar la edición de la guía ("Guía 2026") y la fecha de la última revisión |

## 9. Decisiones tomadas

| Pregunta | Decisión |
|---|---|
| Público | General y abierto; no hace falta ser socio para consultar |
| Relación con Club Piolet | Web independiente y no oficial; la fuente es el PDF público del club |
| Estilos de mapa | Se mantienen los dos (OSM y Claro) |
| Categoría "Moda" | Pasa a llamarse "Tiendas" |
| Manual de marca | No aplica: Pioguia tendrá identidad propia |
| Favoritos y QR | Se dejan para una fase posterior (fase 2) |
| Enlace por beneficio | Página propia `/beneficio/<id>` (mejor para SEO) |
| Dispositivo principal | Móvil |
| Logo de respaldo | Escudo de la parroquia en Andorra; icono de categoría fuera de Andorra |
| Proceso de identidad | Entrevista `brand-discovery` antes del DESIGN.md |

## 10. Preguntas abiertas

Ninguna por ahora.
