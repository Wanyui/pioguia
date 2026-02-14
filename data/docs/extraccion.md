# Flujo semimanual PDF → JSON/Content Collections

Objetivo: extraer la guía anual a un formato estructurado para alimentar el mapa.

## Pasos recomendados
1. Exportar una tabla base desde el PDF:
   - Convertir el PDF a texto o tabla (herramienta local).
   - Volcar a un CSV básico con columnas mínimas.
2. Limpiar y completar datos:
   - Normalizar nombres, direcciones y categorías.
   - Añadir etiquetas (keywords) útiles para búsqueda libre.
3. Geocodificar direcciones:
   - Obtener `lat` y `lng` por cada dirección.
   - Revisar manualmente las coordenadas en mapa.
4. Convertir cada fila del CSV a un archivo en `src/content/benefits/`.

## Plantilla CSV sugerida
Ver `data/benefits-template.csv`.

## Recomendaciones de calidad
- Usar siempre `tags` en plural y en minúsculas.
- Mantener `title` y `description` en español; añadir catalán/inglés si existe.
- Añadir `languages` con los idiomas realmente disponibles por entrada.
