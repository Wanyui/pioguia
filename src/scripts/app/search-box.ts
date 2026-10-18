import { MOBILE_QUERY } from "./context";

/**
 * Mobile: the search box is folded into a magnifier and unfolds over the filter row.
 * While folded with a query, the query shows as a «chip» ✕ and the magnifier gets a dot.
 * Desktop: the box is always open and none of this applies.
 */
export const setupSearchBox = (input: HTMLInputElement | null, onClear: () => void) => {
  const top = document.getElementById("app-header");
  const toggle = document.getElementById("search-toggle");
  const closeButton = document.getElementById("search-close");
  const queryChip = document.getElementById("query-chip");
  const queryChipLabel = document.getElementById("query-chip-label");
  const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

  const syncQueryChip = () => {
    const query = input?.value.trim() ?? "";
    const folded = !top?.classList.contains("is-searching");
    if (queryChip && queryChipLabel) {
      queryChip.hidden = !(isMobile() && folded && query);
      queryChipLabel.textContent = `«${query}»`;
    }
    toggle?.classList.toggle("has-query", Boolean(query));
  };

  const open = () => {
    top?.classList.add("is-searching");
    toggle?.setAttribute("aria-expanded", "true");
    syncQueryChip();
    input?.focus();
  };

  const close = () => {
    if (!top?.classList.contains("is-searching")) return;
    top.classList.remove("is-searching");
    toggle?.setAttribute("aria-expanded", "false");
    syncQueryChip();
  };

  const clear = () => {
    if (input) input.value = "";
    onClear();
    syncQueryChip();
  };

  toggle?.addEventListener("click", open);
  // ✕ inside the open box: clear and fold. Pointerdown runs before the input's blur.
  closeButton?.addEventListener("pointerdown", (event) => event.preventDefault());
  closeButton?.addEventListener("click", () => {
    clear();
    close();
    toggle?.focus();
  });
  queryChip?.addEventListener("click", clear);

  input?.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobile()) {
      close();
      toggle?.focus();
    }
    if (event.key === "Enter") input.blur();
  });
  // Folding on blur (keyboard dismissed, tap on the map or list) brings the filters back.
  input?.addEventListener("blur", () => {
    if (isMobile()) window.setTimeout(close, 120);
  });
  input?.addEventListener("input", syncQueryChip);
  window.addEventListener("resize", syncQueryChip);

  syncQueryChip();
  return { syncQueryChip };
};
