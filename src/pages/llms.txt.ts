import { benefitPath, loadBenefits } from "../lib/benefits";
import { CATEGORIES, CATEGORY_KEYS } from "../lib/categories";
import { GUIDE } from "../lib/guide";

export const prerender = true;

/** Plain-text summary for AI assistants (llmstxt.org): what the site is and every benefit, by category. */
export const GET = async ({ site }: { site?: URL }) => {
  const origin = site?.origin ?? "http://localhost:4321";
  const items = await loadBenefits();

  const sections = CATEGORY_KEYS.map((key) => {
    const lines = items
      .filter((item) => item.category === key)
      .map((item) => {
        const place = item.city && !item.title.es.includes(item.city) ? ` (${item.city})` : "";
        const deal = [item.highlight?.es, item.appliesTo?.es].filter(Boolean).join(", ");
        return `- [${item.title.es}${place}](${origin}${benefitPath(item.slug)})${deal ? `: ${deal}` : ""}`;
      });
    return lines.length ? `## ${CATEGORIES[key].label.es}\n\n${lines.join("\n")}` : "";
  }).filter(Boolean);

  const body = `# Pioguia

> Web no oficial e independiente con las ventajas de la guía ${GUIDE.edition} del Club Piolet (Andorra): descuentos y entradas gratis para socios, en una lista con búsqueda y un mapa. Para usar una ventaja hay que enseñar el carnet del Club Piolet.

- Fuente de los datos: [Club Piolet](${GUIDE.sourceUrl})
- Última revisión: ${GUIDE.reviewed}
- Idiomas: español, català, English, français, русский

${sections.join("\n\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
