# Pioguia

Aplicacion web para consultar las ventajas del Club Piolet, buscarlas por texto y visualizarlas en mapa.

## Stack

- Astro 5
- TypeScript
- Tailwind CSS 4
- Leaflet
- Astro Content Collections + Zod

## Funcionalidades principales

- Listado de beneficios con busqueda por texto libre.
- Visualizacion de beneficios en mapa con marcador activo sincronizado con la lista.
- Selector de idioma en la interfaz.
- Soporte de contenido multilenguaje (`es`, `ca`, `en`, `fr`, `ru`).
- Ordenacion por proximidad cuando hay ubicacion del usuario disponible.
- Interfaz responsive optimizada para mobile.

## Requisitos

- Node.js 18+ (recomendado Node.js 20+)
- npm

## Instalacion y uso local

```bash
npm install
npm run dev
```

La app se abre por defecto en `http://localhost:4321`.

## Scripts disponibles

- `npm run dev`: entorno local con recarga en caliente.
- `npm run build`: genera salida estatica en `dist/`.
- `npm run preview`: sirve localmente la build generada.

## Configuracion de entorno

En `astro.config.mjs`, la URL publica usa:

- `PUBLIC_SITE_URL` (si esta definida)
- fallback: `http://localhost:4321`

Ejemplo:

```bash
PUBLIC_SITE_URL="https://tu-dominio.com" npm run build
```

## Estructura del proyecto

```text
src/
  components/      # componentes Astro (mapa, UI)
  content/
    benefits/      # beneficios (1 archivo .md por beneficio)
    config.ts      # schema Zod de content collections
  lib/             # indexado y utilidades de busqueda
  pages/           # rutas Astro (index)
  scripts/         # logica cliente (mapa, filtros, i18n UI)
  styles/          # estilos globales (Tailwind + overrides Leaflet)
data/
  docs/            # notas operativas de extraccion/importacion
```

## Como se modela un beneficio

Cada beneficio vive en `src/content/benefits/*.md` con frontmatter validado por `src/content/config.ts`.

Campos clave:

- `id`: identificador unico.
- `title`, `description`, `tags`, `category`: localizados por idioma.
- `address`, `lat`, `lng`: datos geograficos.
- `logo`, `web`, `phone`, `email`: opcionales.
- `languages`: idiomas disponibles para esa entrada.

Guia detallada para edicion y calidad de contenido:

- `docs/CONTENT.md`

## Despliegue

Guia paso a paso para preparar release y publicar:

- `docs/DEPLOY.md`
- `SECURITY.md`

## Checklist recomendada antes de publicar

- `npm run build` sin errores.
- Validar que el mapa carga y que la busqueda devuelve resultados.
- Revisar que el selector de idioma funciona en desktop y mobile.
- Comprobar que no haya IDs duplicados en beneficios.
- Verificar `PUBLIC_SITE_URL` para entorno de produccion.

## Licencia

MIT (`LICENSE`).

## Comunidad

- Guia de contribucion: `CONTRIBUTING.md`
- Codigo de conducta: `CODE_OF_CONDUCT.md`
- Seguridad: `SECURITY.md`
