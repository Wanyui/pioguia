# Guia de contenido (beneficios)

Esta guia define como crear y mantener beneficios en `src/content/benefits/`.

## Regla base

- 1 archivo `.md` por beneficio y ubicacion.
- Si una marca tiene varias ubicaciones, crear un beneficio por ubicacion.
- Mantener consistencia entre nombre de archivo e `id`.

## Plantilla minima recomendada

```md
---
id: "benefit-ejemplo-ciudad"
title:
  es: "Nombre beneficio"
description:
  es: "Descripcion corta de la ventaja."
tags:
  es: ["tag1", "tag2"]
address: "Direccion completa"
lat: 0
lng: 0
logo: "/img/*"
languages: ["es", "ca", "en", "fr", "ru"]
---
```

## Buenas practicas

- `id` unico y estable (no reutilizar IDs).
- `id` alineado con el slug de archivo:
  - archivo: `rossell-andorra-la-vella.md`
  - id: `benefit-rossell-andorra-la-vella`
- `tags` en minusculas y orientadas a busqueda.
- Direccion lo mas completa posible.
- Revisar manualmente coordenadas antes de publicacion.

## Idiomas

Idiomas soportados por schema:

- `es` (obligatorio)
- `ca`
- `en`
- `fr`
- `ru`

Si no hay traduccion en algun idioma, se puede dejar sin ese campo y la UI aplicara fallback.

## Logos

- Si no hay logo definitivo: `logo: "/img/*"` (placeholder operativo).
- Si hay logo final, ubicar archivo en `public/img/` y referenciar con ruta absoluta:
  - `logo: "/img/nombre-logo.png"`

## Flujo sugerido para altas/actualizaciones

1. Crear o editar archivo en `src/content/benefits/`.
2. Validar frontmatter y formato.
3. Ejecutar build:

```bash
npm run build
```

4. Revisar en navegador:
   - aparece en lista
   - aparece en mapa (si `lat/lng` validos)
   - responde en busqueda

## Errores comunes

- ID duplicado entre beneficios.
- `id` que no coincide con el archivo.
- Coordenadas `0,0` olvidadas al publicar.
- Ruta de logo que no existe en `public/img/`.
