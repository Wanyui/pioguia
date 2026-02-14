---
name: ui-modernization
description: Rediseño moderno de interfaz para Pioguia usando Tailwind CSS con estándares altos de calidad, accesibilidad y mantenibilidad
---

# UI Modernization (Pioguia)

Skill específica para modernizar la interfaz de `Pioguia` usando **Tailwind CSS** sin romper la funcionalidad existente.

## Objetivo

Aplicar una mejora visual completa y consistente en:
- `src/pages/index.astro`
- `src/components/*.astro`
- elementos renderizados desde `src/scripts/map.ts`

Priorizando:
- claridad visual
- jerarquía tipográfica
- espaciado consistente
- responsive mobile-first
- accesibilidad
- mantenibilidad a largo plazo

## Principios de diseño

1. **Minimalismo útil**
   - Reducir ruido visual.
   - Destacar acciones y contenido principal (filtros, lista, mapa).

2. **Jerarquía clara**
   - Escala tipográfica definida para `h1`, títulos de tarjeta, metadata y texto secundario.
   - Contraste suficiente entre niveles de información.

3. **Sistema de espaciado**
   - Usar una escala consistente (ej. 4/8/12/16/24/32).
   - Evitar márgenes y paddings arbitrarios.

4. **Color y estado**
   - Paleta base neutra + color de acento.
   - Estados visuales claros: hover, focus, active, selected, disabled.

5. **Componentes coherentes**
   - Inputs, botones, selectores y tarjetas con lenguaje visual unificado.
   - Bordes, radios, sombras y transiciones consistentes.

6. **Accesibilidad**
   - Contraste AA en textos y controles.
   - `:focus-visible` claro en elementos interactivos.
   - No depender solo del color para comunicar estado.

7. **Calidad senior**
   - Utilizar componentes y utilidades reutilizables.
   - Evitar duplicación de clases y lógica visual.
   - Priorizar legibilidad del markup y coherencia del sistema visual.

## Flujo de trabajo obligatorio

1. **Auditoría rápida**
   - Identificar problemas visuales actuales (densidad, contraste, alineación, responsive).

2. **Cambios por fases**
   - Fase 1: diseño del sistema visual en Tailwind (tokens en `tailwind.config.*`).
   - Fase 2: layout principal (header, sidebar, mapa).
   - Fase 3: componentes (cards, controles, botones de mapa, empty state).
   - Fase 4: polish (hover/focus/active, micro-interacciones).

3. **No romper funcionalidad**
   - Mantener comportamiento existente: búsqueda, idioma, marcador activo, estilos de mapa.

4. **Validación**
   - Comprobar que no hay regresiones visuales graves en desktop y mobile.
   - Ejecutar build/lints al finalizar cambios sustanciales.
   - Revisar consistencia de clases Tailwind y posibles simplificaciones.

## Guía técnica (Tailwind)

- Instalar y configurar Tailwind para Astro siguiendo la vía oficial.
- Definir tokens de diseño en Tailwind:
  - colores de marca y neutros
  - tipografía (font family y escala)
  - spacing
  - border radius
  - shadows
  - breakpoints
- Usar utilidades Tailwind en componentes y páginas.
- Extraer patrones repetidos en componentes reutilizables cuando convenga.
- Evitar clases demasiado largas cuando puedan agruparse con componentes o utilidades semánticas.
- Mantener CSS adicional al mínimo (solo casos no cubiertos por Tailwind o Leaflet).
- Conservar compatibilidad visual y funcional con Leaflet.

## Estándares obligatorios

- Código limpio y legible (sin clases caóticas ni duplicación innecesaria).
- Accesibilidad básica en todos los componentes interactivos.
- Responsive correcto en mobile, tablet y desktop.
- Performance razonable: evitar estilos innecesarios o sobrecarga visual.
- Consistencia visual total entre estados (`default`, `hover`, `focus`, `active`, `disabled`).
- Sin regressions funcionales (búsqueda, filtros, idioma, marcador activo, estilos de mapa).

## Checklist de salida

- [ ] Interfaz más moderna y consistente.
- [ ] Componentes clave rediseñados (header, filtros, cards, mapa).
- [ ] Tailwind instalado y configurado correctamente en el proyecto.
- [ ] Tokens de diseño definidos en configuración de Tailwind.
- [ ] Responsive correcto (`<=900px` y desktop).
- [ ] Estados interactivos accesibles.
- [ ] Build y lints sin errores.
