# Flujos de usuario — Rediseño de Pioguia

> Recorrido del usuario y qué pasa exactamente en cada interacción.
> Estado: **aprobado** (2026-10-17). Va con [01-PRD.md](01-PRD.md); las prioridades (P0, P1, P2) son las mismas.
> Cada flujo indica **Hoy**, cómo funciona ahora, y **Propuesta**, cómo debería funcionar tras el rediseño.

## 0. Estructura de la pantalla

| | Escritorio (≥ 900 px) | Móvil (< 900 px) |
|---|---|---|
| Cabecera | Marca, buscador, idioma | Marca, buscador e idioma (compactos) |
| Filtros | Fila de chips: categorías y zona | Fila de chips con scroll horizontal |
| Pie | Aviso "Web no oficial · Fuente: guía 2026 del Club Piolet (PDF)" con enlace | Igual |
| Contenido | Lista (izquierda) + mapa (derecha), siempre visibles | **Una vista cada vez: Lista o Mapa**, con un conmutador fijo abajo |
| Detalle | Panel lateral sobre la lista | Hoja inferior deslizable sobre el mapa o la lista |

Estado de la página: búsqueda, filtros, beneficio abierto, vista lista o mapa en móvil e idioma.
Cada beneficio tiene su página propia `/beneficio/<id>` (P1), que abre el detalle y se puede compartir.

---

## F1 · Primera visita y exploración (P0)

**Hoy:** abre en español, con el mapa centrado en todos los beneficios y la lista en orden alfabético.
Pide la ubicación nada más cargar.

**Propuesta:**
1. Se carga la página. El idioma se elige así: el guardado en `localStorage` → si no hay, el del
   navegador, si es uno de los 5 → si no, español.
2. Se muestra la lista completa y el mapa encuadrando todos los beneficios.
3. **No** se pide la ubicación al cargar. Solo cuando el usuario pulsa "Cerca de mí" (F4).
   Así se evita un permiso intrusivo de entrada.
4. Arriba se ve un contador ("82 ventajas") y los chips de filtro.

## F2 · Buscar por texto (P0)

**Hoy:** se filtra al escribir, en el idioma activo; la lista y los marcadores se actualizan.

**Propuesta:**
1. El usuario escribe en el buscador. Se filtra al instante, con un pequeño retardo para no
   recalcular en cada tecla, y sin distinguir acentos ni mayúsculas, igual que ahora.
2. Se combina con los filtros activos (F3): resultado = texto ∩ categoría ∩ zona.
3. El contador se actualiza ("12 ventajas") y se anuncia a lectores de pantalla (`aria-live`).
4. El mapa reencuadra los resultados solo si el usuario no lo ha movido a mano desde la última búsqueda.
5. Si no hay resultados, ver F8.1.
6. Botón ✕ para limpiar y tecla Esc para borrar.

## F3 · Filtrar por categoría y zona (P0)

**Hoy:** no existe.

**Propuesta:**
1. Chips de categoría con un icono y el número de resultados. Hoy hay 6: Deportes (23), Ocio (22),
   Tiendas (17, antes "Moda"), Educación (13), Servicios (4), Restauración (3).
2. Chips de zona: cada parroquia de Andorra y "Fuera de Andorra".
3. Tocar un chip lo activa o lo desactiva. Varios chips de una misma familia suman (OR) y
   familias distintas se combinan (AND).
4. Hay un botón "Quitar filtros" cuando hay alguno activo.
5. La lista, el mapa y el contador se actualizan igual que en F2.

## F4 · "Cerca de mí" (P0)

**Hoy:** pide la ubicación al cargar y, si la consigue, ordena la lista por distancia y pone tu icono.
Con el botón ◎ se vuelve a centrar en ti. Si falla, avisa con un mensaje (arreglado en 2026-10).

**Propuesta:**
1. El usuario pulsa "Cerca de mí", en la cabecera o en el mapa.
2. El navegador pide permiso.
   - **Concedido** → aparece el icono del usuario en el mapa, que se centra en él con un zoom de barrio.
     La lista pasa a ordenarse por distancia y cada tarjeta muestra los km ("a 1,2 km").
     Aparece un indicador "Ordenado por cercanía · ✕" para volver al orden alfabético.
   - **Denegado o error** → ver F8.2. La lista sigue en orden alfabético.
3. La ubicación no se guarda ni se envía a ningún sitio.

## F5 · Ver el detalle de un beneficio y contactar (P0)

**Hoy:** tocar una tarjeta resalta su marcador y abre el popup. En móvil, la página se desplaza hasta el mapa.
La descripción se corta y no hay vista completa. Los botones de mapa, teléfono y web están en la tarjeta.

**Propuesta:**
1. El usuario toca una tarjeta o un marcador.
2. Se abre el **detalle**: un panel lateral en escritorio o una hoja inferior a media altura en móvil, con:
   - logo (o su respaldo), nombre, categoría y zona;
   - **la ventaja** destacada (p. ej. "2x1", "10%", "Gratis");
   - la descripción completa y las condiciones ("Presentar carnet de socio");
   - la dirección y "Cómo llegar" (Google Maps);
   - los teléfonos (todos, cada uno se puede pulsar), web y email;
   - la distancia, si se conoce la ubicación;
   - un botón "Compartir" (F6).
3. El marcador se resalta y el mapa se centra en él, sin cambiar de vista en móvil.
4. Para cerrar: botón ✕, tecla Esc, deslizar hacia abajo o tocar fuera. El foco vuelve a la tarjeta de origen.
5. Las acciones rápidas (mapa, llamar, web) siguen disponibles en la tarjeta, sin abrir el detalle.

## F6 · Compartir un beneficio (P1)

**Hoy:** no existe.

**Propuesta:**
1. En el detalle, el usuario pulsa "Compartir".
2. En móvil se abre el menú nativo para compartir (Web Share API); en escritorio se copia el enlace
   y aparece un aviso "Enlace copiado".
3. El enlace es la página propia del beneficio (`/beneficio/<id>`). Quien lo abre ve ese beneficio en el detalle (F5) y Google puede indexarlo.

## F7 · Móvil: alternar lista ↔ mapa (P0)

**Hoy:** la lista y el mapa están uno debajo del otro. Al tocar una tarjeta la página salta al mapa
y se pierde la posición en la lista.

**Propuesta:**
1. Un conmutador fijo abajo con dos opciones: **Lista** | **Mapa**.
2. Los filtros y la búsqueda se mantienen al cambiar de vista.
3. En la vista Mapa, tocar un marcador abre la hoja de detalle (F5) sin salir del mapa.
4. Al volver a la Lista se conserva la posición de scroll.

## F8 · Estados especiales

### F8.1 Sin resultados (P0)
"No hay ventajas para «piscina» con los filtros actuales", con dos botones: **Quitar filtros** y **Borrar búsqueda**.

### F8.2 Ubicación no disponible (P0)
- Permiso denegado → "Activa el permiso de ubicación del navegador para ver lo que tienes cerca"
  (ya existe en 5 idiomas).
- Error o tiempo agotado → "No se ha podido obtener tu ubicación. Inténtalo de nuevo" (ya existe).
- Ninguno de los dos casos bloquea el resto de la web.

### F8.3 El mapa no carga (P1)
Si las teselas fallan, la lista sigue funcionando y el mapa muestra un aviso discreto.
El estilo "Claro" vuelve a OSM si OpenFreeMap no responde.

### F8.4 Beneficio sin logo, teléfono o web (P0)
Se ocultan las acciones que no tienen dato. Sin logo: en Andorra se muestra el **escudo de la parroquia**
(así se sabe dónde está); fuera de Andorra, el icono de su categoría. Nunca un hueco vacío.

### F8.5 Enlace compartido a un beneficio archivado o inexistente (P1)
Se muestra la página normal con el aviso "Esta ventaja ya no está disponible".

## F10 · Saber de dónde salen los datos (P0)

**Hoy:** no se indica que la web sea no oficial ni de dónde salen los datos.

**Propuesta:**
1. En el pie, siempre visible al final de la lista: "Web no oficial. Datos de la guía 2026 del
   Club Piolet" con un enlace a la web oficial del club, donde está el PDF.
2. Un enlace "Acerca de" abre un panel corto que explica qué es Pioguia, que es independiente,
   cuándo se revisaron los datos por última vez y cómo avisar de un error.
3. Para disfrutar de cualquier ventaja hace falta el carnet de socio: se recuerda en el detalle (F5).

## F9 · Cambiar de idioma (P0)

**Hoy:** el menú cambia los textos de la interfaz y del contenido; no se recuerda.

**Propuesta:**
1. Menú con las 5 opciones, cada una en su propio idioma (Català, Español, English, Français, Русский).
2. Al cambiar: se traducen la interfaz y el contenido, se mantienen la búsqueda, los filtros y el
   beneficio abierto, y se guarda la elección en `localStorage`.
3. Se actualiza `<html lang>` para los lectores de pantalla.

---

## Navegación por teclado (P0)

- Tab recorre: buscador → idioma → chips → "Cerca de mí" → tarjetas → mapa.
- Enter o Espacio sobre una tarjeta abre el detalle; Esc lo cierra y devuelve el foco a la tarjeta.
- Enlace "Saltar al listado" al principio de la página.
- El foco siempre es visible.

## Preguntas abiertas

Ninguna por ahora. Las decisiones están en [01-PRD.md](01-PRD.md#9-decisiones-tomadas).
