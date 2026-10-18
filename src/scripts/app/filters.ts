import { CATEGORIES, type CategoryKey } from "../../lib/categories";
import type { SearchItem } from "../../lib/search-index";
import { ZONES, type ZoneKey } from "../../lib/zones";
import type { LanguageCode } from "../map-i18n";

export type FilterState = { categories: Set<CategoryKey>; zones: Set<ZoneKey> };

/** OR within a group, AND between groups; an empty group does not filter. */
export const matchesFilters = (item: SearchItem, state: FilterState, skip?: "categories" | "zones") =>
  (skip === "categories" || state.categories.size === 0 || state.categories.has(item.category)) &&
  (skip === "zones" || state.zones.size === 0 || state.zones.has(item.zone));

/** Category chips, zone menu and "clear filters". Calls onChange whenever the selection changes. */
export const setupFilters = (onChange: () => void) => {
  const state: FilterState = { categories: new Set(), zones: new Set() };
  const categoryChips = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-category]"));
  const zoneOptions = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-zone]"));
  const zoneTrigger = document.getElementById("zone-trigger") as HTMLButtonElement | null;
  const zonePanel = document.getElementById("zone-panel");
  const zoneCount = document.getElementById("zone-count");
  const clearButton = document.getElementById("clear-filters");

  const isActive = () => state.categories.size > 0 || state.zones.size > 0;
  const chipsRow = document.getElementById("filter-chips");
  const defaultOrder = [...categoryChips];
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Selected categories move right after "near me" and "zone" (in the order they were picked);
   * the rest keep their default order. FLIP animation so the move is easy to follow.
   */
  const reorderChips = () => {
    if (!chipsRow) return;
    const selected = [...state.categories]
      .map((key) => categoryChips.find((chip) => chip.dataset.category === key))
      .filter((chip): chip is HTMLButtonElement => Boolean(chip));
    const ordered = [...selected, ...defaultOrder.filter((chip) => !selected.includes(chip))];
    const before = new Map(ordered.map((chip) => [chip, chip.getBoundingClientRect().left]));
    const anchor = clearButton ?? null;
    ordered.forEach((chip) => chipsRow.insertBefore(chip, anchor));
    if (reduceMotion()) return;
    ordered.forEach((chip) => {
      const dx = (before.get(chip) ?? 0) - chip.getBoundingClientRect().left;
      if (Math.abs(dx) < 1) return;
      chip.animate([{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }], {
        duration: 420,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
    });
  };

  const sync = () => {
    categoryChips.forEach((chip) => {
      chip.setAttribute("aria-pressed", String(state.categories.has(chip.dataset.category as CategoryKey)));
    });
    zoneOptions.forEach((option) => {
      option.setAttribute("aria-pressed", String(state.zones.has(option.dataset.zone as ZoneKey)));
    });
    zoneTrigger?.classList.toggle("has-selection", state.zones.size > 0);
    if (zoneCount) {
      zoneCount.hidden = state.zones.size === 0;
      zoneCount.textContent = String(state.zones.size);
    }
    if (clearButton) clearButton.hidden = !isActive();
  };

  const toggle = <T>(set: Set<T>, value: T) => (set.has(value) ? set.delete(value) : set.add(value));

  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      toggle(state.categories, chip.dataset.category as CategoryKey);
      sync();
      reorderChips();
      // Keep the start of the row in view so the chip that just moved is visible.
      chipsRow?.scrollTo({ left: 0, behavior: reduceMotion() ? "auto" : "smooth" });
      onChange();
    });
  });

  zoneOptions.forEach((option) => {
    option.addEventListener("click", () => {
      toggle(state.zones, option.dataset.zone as ZoneKey);
      sync();
      onChange();
    });
  });

  const setZonePanel = (open: boolean) => {
    if (!zonePanel || !zoneTrigger) return;
    zonePanel.hidden = !open;
    zoneTrigger.setAttribute("aria-expanded", String(open));
    if (open) zoneOptions[0]?.focus();
  };
  zoneTrigger?.addEventListener("click", () => setZonePanel(zonePanel?.hidden ?? false));
  document.addEventListener("click", (event) => {
    const target = event.target as Node;
    if (zonePanel && !zonePanel.hidden && !zonePanel.contains(target) && !zoneTrigger?.contains(target)) {
      setZonePanel(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && zonePanel && !zonePanel.hidden) {
      setZonePanel(false);
      zoneTrigger?.focus();
    }
  });

  const clear = () => {
    state.categories.clear();
    state.zones.clear();
    sync();
    reorderChips();
    onChange();
  };
  clearButton?.addEventListener("click", clear);

  /** Counts per chip: how many results each option would give with the other filters applied. */
  const updateCounts = (pool: SearchItem[]) => {
    const byCategory = new Map<CategoryKey, number>();
    const byZone = new Map<ZoneKey, number>();
    pool.forEach((item) => {
      if (matchesFilters(item, state, "categories")) {
        byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1);
      }
      if (matchesFilters(item, state, "zones")) {
        byZone.set(item.zone, (byZone.get(item.zone) ?? 0) + 1);
      }
    });
    categoryChips.forEach((chip) => {
      const n = byCategory.get(chip.dataset.category as CategoryKey) ?? 0;
      const count = chip.querySelector(".chip-count");
      if (count) count.textContent = String(n);
      chip.classList.toggle("is-empty", n === 0);
    });
    zoneOptions.forEach((option) => {
      const n = byZone.get(option.dataset.zone as ZoneKey) ?? 0;
      const count = option.querySelector(".chip-count");
      if (count) count.textContent = String(n);
    });
  };

  const updateLabels = (lang: LanguageCode) => {
    categoryChips.forEach((chip) => {
      const label = chip.querySelector(".chip-label");
      if (label) label.textContent = CATEGORIES[chip.dataset.category as CategoryKey].label[lang];
    });
    zoneOptions.forEach((option) => {
      const label = option.querySelector(".zone-label");
      if (label) label.textContent = ZONES[option.dataset.zone as ZoneKey].label[lang];
    });
  };

  sync();
  return { state, isActive, clear, updateCounts, updateLabels };
};

