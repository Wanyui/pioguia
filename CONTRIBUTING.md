# Contributing

Gracias por tu interes en mejorar Pioguia.

## Requisitos

- Node.js 18+
- npm

## Entorno local

```bash
npm install
npm run dev
```

## Flujo recomendado

1. Crea una rama desde `main`.
2. Aplica cambios pequenos y autocontenidos.
3. Ejecuta validaciones antes de abrir PR:

```bash
npm run build
```

4. Abre Pull Request describiendo:
   - objetivo del cambio
   - impacto esperado
   - pasos de prueba

## Convenciones

- Mantener compatibilidad con Astro + TypeScript.
- No introducir secretos ni credenciales en el repositorio.
- Mantener el contenido de `src/content/benefits/` alineado con `src/content/config.ts`.
- Seguir mensajes de commit claros (se recomienda Conventional Commits).

## Cambios de contenido

Para altas/edicion de beneficios, seguir:

- `docs/CONTENT.md`

## Codigo de conducta

Al participar, aceptas el `CODE_OF_CONDUCT.md`.
