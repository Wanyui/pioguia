# Módulo 50 — Voz y tono

> Estado: **completado** (2026-10-17). Marcos: espectro de voz, matriz de tono por tipo de contenido.

## Raw

### Textos que gustan o no (pruebas A/B con textos reales de la interfaz)

- **Prueba 1** (búsqueda "pizza" sin resultados):
  - A: "No se han encontrado resultados para tu búsqueda." (neutro e institucional)
  - B: "No hay «pizza» por aquí. Prueba con otra palabra o quita los filtros." (claro y útil)
  - C: "¡Ups! 🍕 No hay pizza esta vez… pero no te rindas, ¡hay muchas más cosas por descubrir!" (juguetón y efusivo)
  - R: "no puede ser un intermedio entre B y C?"
  - Intermedios propuestos: D "No hay pizza por aquí 🍕 Prueba con otra palabra o quita los filtros." /
    E "Vaya, no hay «pizza» por aquí. Prueba con otra palabra o quita los filtros."
  - R: "La E" → **calidez con palabras (interjección suave), sin emojis**.
- **Prueba 2** (ventaja de Dinópolis en la tarjeta):
  - A: "15% de descuento para el socio y tres acompañantes"
  - B: "−15% para ti y 3 acompañantes"
  - C: "**−15%** · tú + 3 acompañantes" (descuento como etiqueta destacada y el resto pequeño)
  - R: "C, clarísimo" → **dato primero, en formato etiqueta, y contexto mínimo**. Se confirma el **tuteo**.

### Siempre / nunca

- Siempre: tutear; ir al grano; dar una salida útil (qué hacer a continuación).
- Nunca: emojis en la interfaz; exclamaciones; tono de cupón o publicidad; párrafos donde basta una etiqueta.

## Synthesis

### Espectro de voz

| Eje | 1 | 2 | 3 | 4 | 5 | Notas |
|---|---|---|---|---|---|---|
| Formal ←→ Casual | | | | ● | | Tuteo, natural, sin jerga |
| Serio ←→ Juguetón | | ● | | | | Calidez sí; bromas, emojis y exclamaciones no |
| Distante ←→ Cálido | | | | ● | | "Vaya…", "por aquí", "tú" |
| Convencional ←→ Irreverente | | ● | | | | Claro y correcto |
| Mínimo ←→ Expresivo | ● | | | | | Etiquetas y frases cortas |

### Declaración de voz

Pioguia habla como **un amigo que conoce la ciudad**: te tutea, va al grano y te da el dato que necesitas
(cuánto descuento, a qué distancia, qué hacer ahora) en el menor número de palabras. Es cálido sin ser
efusivo: puede decir "vaya" cuando algo no sale, pero nunca usa emojis, exclamaciones ni tono de oferta.
Si hay un problema, explica qué pasa y qué puedes hacer. La decisión siempre es tuya.

### Matriz de tono por contexto

| Contexto | Tono | Ejemplo |
|---|---|---|
| Etiqueta de ventaja (tarjeta) | Dato puro, en formato etiqueta | **−15%** · tú + 3 acompañantes · **2x1** · **Gratis** · menores de 10 |
| Distancia y zona | Dato puro | a 1,2 km · Escaldes-Engordany |
| Botones | Verbo directo, en 1-2 palabras | Cómo llegar · Llamar · Web · Compartir · Cerca de mí |
| Sin resultados | Cálido y con salida | "Vaya, no hay «pizza» por aquí. Prueba con otra palabra o quita los filtros." |
| Error de ubicación | Calmado, explica y da solución | "No vemos tu ubicación. Actívala en el navegador para ver lo que tienes cerca." |
| Aviso de web no oficial | Honesto y neutro | "Web no oficial. Datos de la guía 2026 del Club Piolet." |
| Condiciones (detalle) | Claro, en frases cortas o lista | "Presenta el carnet de socio. No acumulable con otras ofertas." |

### Tres comprobaciones para cada texto

1. ¿Se entiende de un vistazo en la calle, en una o dos líneas como mucho?
2. ¿Suena a un amigo (tuteo y cálido) y no a un cupón ni a un comunicado oficial?
3. ¿Dice qué hacer después o deja la decisión al usuario, sin empujar?

### Consecuencias para el producto

- Hace falta un campo **"ventaja corta"** por beneficio y por idioma ("−15%", "2x1", "Gratis") y otro de
  **"a quién aplica"** ("tú + 3 acompañantes"). Se pueden extraer de forma semiautomática de las descripciones.
- Hay que revisar los textos de la interfaz en los 5 idiomas con esta voz. En catalán y francés, el tuteo
  equivale a "tu"; en ruso, a "ты", aunque ❓ en ruso para una web pública suele usarse "вы" (validar).

### Tensiones con el módulo 40

- Ninguna: "amigo" y "sin adornos" encajan con una calidez breve.
