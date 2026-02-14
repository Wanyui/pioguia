# Deploy y publicacion

Esta guia resume el flujo recomendado para publicar Pioguia en GitHub y desplegarla como sitio estatico.

## 1) Verificacion local

```bash
npm install
npm run build
npm run preview
```

Validar en `preview`:

- carga general de la pagina
- mapa visible y funcional
- busqueda de beneficios
- selector de idioma
- comportamiento mobile

## 2) Configurar URL publica

Pioguia usa `PUBLIC_SITE_URL` para metadata y enlaces canonicos.

Ejemplo:

```bash
PUBLIC_SITE_URL="https://tu-dominio.com" npm run build
```

Tambien puedes definirla en el entorno del proveedor de hosting.

## 3) Subir proyecto a GitHub

Si aun no existe repositorio:

```bash
git init
git add .
git commit -m "chore: initial release"
git branch -M main
git remote add origin <url-del-repo>
git push -u origin main
```

## 4) Opciones de despliegue

Pioguia genera salida estatica en `dist/`, por lo que puedes usar:

- GitHub Pages
- Netlify
- Vercel (modo static)
- Cloudflare Pages

Comando de build:

```bash
npm run build
```

Directorio de salida:

```text
dist
```

## 5) Checklist final de release

- `npm run build` OK
- sin errores visibles en consola del navegador
- URLs de logos correctas o fallback de logo activo
- coordenadas revisadas en beneficios nuevos
- idioma por defecto y selector validados

## Notas

- Si en desarrollo local aparece un error de cache de Astro/Vite, reiniciar `npm run dev`.
- Cuando cambies masivamente contenido en `src/content/benefits`, conviene hacer una build completa antes de publicar.
