import type { SearchItem } from "../../lib/search-index";
import { uiText } from "../map-i18n";
import { getLang } from "./context";
import { buildDetailHtml } from "./detail-view";

const HOME_TITLE = "Guía Piolet";
const SWIPE_CLOSE_PX = 80;

const slugFromPath = (path: string) => path.match(/^\/beneficio\/([^/]+)\/?$/)?.[1];
export const benefitUrl = (slug: string) => `/beneficio/${slug}/`;

type DetailOptions = {
  bySlug: Map<string, SearchItem>;
  distanceOf: (item: SearchItem) => number | undefined;
  /** Called after the panel opens or closes (to highlight and centre the marker). */
  onOpen: (item: SearchItem) => void;
  onClose: () => void;
  showNotice: (message: string) => void;
};

/** Benefit detail panel: bottom sheet on mobile, side panel on desktop. Synced with /beneficio/<slug>/. */
export const setupDetail = ({ bySlug, distanceOf, onOpen, onClose, showNotice }: DetailOptions) => {
  const panel = document.getElementById("detail");
  const body = document.getElementById("detail-body");
  const grip = document.getElementById("detail-grip");
  let current: SearchItem | null = null;
  let returnFocus: HTMLElement | null = null;

  const render = () => {
    if (!current || !body) return;
    body.innerHTML = buildDetailHtml(current, getLang(), distanceOf(current));
  };

  const open = (slug: string, { push = true } = {}) => {
    const item = bySlug.get(slug);
    if (!item || !panel) return false;
    if (!current) returnFocus = document.activeElement as HTMLElement | null;
    current = item;
    render();
    panel.hidden = false;
    document.body.classList.add("has-detail");
    document.title = `${item.title[getLang()] || item.title.es} · Pioguia`;
    if (push && location.pathname !== benefitUrl(slug)) history.pushState({ slug }, "", benefitUrl(slug));
    panel.querySelector<HTMLElement>("[data-detail-close]")?.focus({ preventScroll: true });
    body?.scrollTo({ top: 0 });
    onOpen(item);
    return true;
  };

  const close = ({ push = true } = {}) => {
    if (!current || !panel) return;
    const closed = current;
    current = null;
    panel.hidden = true;
    document.body.classList.remove("has-detail");
    document.title = HOME_TITLE;
    if (push && slugFromPath(location.pathname)) history.pushState({}, "", "/");
    onClose();
    // Return focus to where the user was; taps on Safari do not focus buttons, so fall back to the card.
    const target =
      returnFocus && returnFocus !== document.body && document.contains(returnFocus)
        ? returnFocus
        : document.querySelector<HTMLElement>(`.card[data-id="${CSS.escape(closed.id)}"]`);
    target?.focus({ preventScroll: true });
    returnFocus = null;
  };

  const share = async () => {
    if (!current) return;
    const url = new URL(benefitUrl(current.slug), location.origin).href;
    const title = current.title[getLang()] || current.title.es;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showNotice(uiText[getLang()].linkCopied);
    } catch {
      // The user cancelled the share sheet, or the clipboard is not available.
    }
  };

  body?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-detail-close]")) close();
    else if (target.closest("[data-detail-share]")) void share();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && current) close();
  });

  // Swipe the mobile sheet down by its grip to close it.
  grip?.addEventListener("pointerdown", (start) => {
    if (!panel) return;
    const startY = start.clientY;
    const onMove = (move: PointerEvent) => {
      const dy = Math.max(0, move.clientY - startY);
      panel.style.transform = `translateY(${dy}px)`;
    };
    const onUp = (end: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      panel.style.removeProperty("transform");
      if (end.clientY - startY > SWIPE_CLOSE_PX) close();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  window.addEventListener("popstate", () => {
    const slug = slugFromPath(location.pathname);
    if (slug && bySlug.has(slug)) open(slug, { push: false });
    else close({ push: false });
  });

  /** Opens the benefit in the URL on first load (pages /beneficio/<slug>/), or explains it is gone. */
  const openInitial = () => {
    const slug = document.body.dataset.initialSlug || slugFromPath(location.pathname);
    if (document.body.dataset.unavailable === "true" || (slug && !bySlug.has(slug))) {
      showNotice(uiText[getLang()].unavailable);
      if (slug) history.replaceState({}, "", "/");
      return;
    }
    if (slug) open(slug, { push: false });
  };

  return { open, close, render, openInitial, current: () => current };
};
