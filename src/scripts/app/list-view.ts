import type { SearchItem } from "../../lib/search-index";
import { buildCardHtml } from "../map-card";
import type { LanguageCode } from "../map-i18n";

type ListViewOptions = {
  results: HTMLElement;
  emptyState: HTMLElement | null;
  onCardClick: (id: string) => void;
};

export const createListView = ({ results, emptyState, onCardClick }: ListViewOptions) => {
  const cardFor = (id: string) => results.querySelector<HTMLElement>(`.card[data-id="${CSS.escape(id)}"]`);

  const render = (items: SearchItem[], lang: LanguageCode, distanceOf?: (item: SearchItem) => number | undefined) => {
    results.innerHTML = items.map((item) => buildCardHtml(item, lang, distanceOf?.(item))).join("");
    if (emptyState) emptyState.hidden = items.length > 0;
  };

  const setCardActive = (id: string, active: boolean, { scroll = false } = {}) => {
    const card = cardFor(id);
    if (!card) return;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-current", String(active));
    if (active && scroll) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  results.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-card-action]")) return;
    const id = (target?.closest(".card") as HTMLElement | null)?.dataset.id;
    if (id) onCardClick(id);
  });

  // Close any open "call" menu (multiple phone numbers) when clicking elsewhere.
  document.addEventListener("click", (event) => {
    const target = event.target as Node | null;
    document.querySelectorAll<HTMLDetailsElement>("[data-call-menu]").forEach((menu) => {
      if (!target || menu.contains(target)) return;
      menu.removeAttribute("open");
    });
  });

  /** Brings a card to the top of the list (used after the mobile sheet changes height). */
  const scrollToCard = (id: string) => cardFor(id)?.scrollIntoView({ block: "start", behavior: "smooth" });

  return { render, setCardActive, scrollToCard };
};
