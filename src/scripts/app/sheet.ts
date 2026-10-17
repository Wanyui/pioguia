import { MOBILE_QUERY } from "./context";

export type Snap = "peek" | "half" | "full";
export type View = "list" | "map";

const SNAPS: Snap[] = ["peek", "half", "full"];
const DRAG_THRESHOLD = 6;

/**
 * Mobile bottom sheet (#panel) with three heights and the Lista | Mapa toggle.
 * "full" is the list view; "peek" and "half" are the map view. On desktop it does nothing.
 */
export const setupSheet = (onSnapChange?: (snap: Snap) => void) => {
  const panel = document.getElementById("panel");
  const handle = document.getElementById("sheet-handle");
  const head = panel?.querySelector<HTMLElement>(".panel-head");
  const app = document.getElementById("app");
  const viewButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-view-button]"));
  const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

  const getSnap = (): Snap => (panel?.dataset.snap as Snap) || "half";

  /** Final height of a snap, read from the CSS custom properties (no layout or transition timing). */
  const snapHeight = (snap: Snap) => {
    if (!isMobile() || !app) return 0;
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--h)";
    const value = { peek: "calc(var(--sheet-peek) + var(--toggle-space))", half: "var(--sheet-half)", full: "var(--sheet-full)" }[snap];
    probe.style.setProperty("--h", value);
    app.appendChild(probe);
    const height = probe.getBoundingClientRect().height;
    probe.remove();
    return height;
  };

  const setSnap = (snap: Snap) => {
    if (!panel) return;
    panel.dataset.snap = snap;
    // Lets the map keep its attribution and centred markers above the sheet.
    app?.style.setProperty("--sheet-current", `${snapHeight(snap)}px`);
    const view: View = snap === "full" ? "list" : "map";
    if (app) app.dataset.view = view;
    viewButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewButton === view));
    });
    handle?.setAttribute("aria-expanded", String(snap === "full"));
    onSnapChange?.(snap);
  };

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setSnap(button.dataset.viewButton === "list" ? "full" : "half"));
  });

  let lastDragEnd = 0;
  handle?.addEventListener("click", () => {
    // A drag ends with a click on the handle; ignore it so it does not also cycle.
    if (!isMobile() || performance.now() - lastDragEnd < 300) return;
    const order: Snap[] = ["peek", "half", "full", "half"];
    const current = getSnap();
    const next = current === "full" ? "half" : order[order.indexOf(current) + 1] ?? "half";
    setSnap(next);
  });

  // Drag the sheet by its handle or header and snap to the nearest height on release.
  const startDrag = (event: PointerEvent) => {
    if (!panel || !isMobile()) return;
    const startY = event.clientY;
    const startHeight = panel.getBoundingClientRect().height;
    let dragging = false;

    const onMove = (move: PointerEvent) => {
      const dy = startY - move.clientY;
      if (!dragging && Math.abs(dy) < DRAG_THRESHOLD) return;
      dragging = true;
      panel.classList.add("is-dragging");
      const max = window.innerHeight - 64;
      panel.style.height = `${Math.min(max, Math.max(96, startHeight + dy))}px`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!dragging) return;
      const height = panel.getBoundingClientRect().height;
      panel.style.removeProperty("height");
      // Measure each snap height (transitions are off while .is-dragging), then pick the closest.
      const heights = SNAPS.map((snap) => {
        panel.dataset.snap = snap;
        return panel.getBoundingClientRect().height;
      });
      panel.style.height = `${height}px`;
      void panel.offsetHeight;
      panel.classList.remove("is-dragging");
      panel.style.removeProperty("height");
      const closest = heights.reduce(
        (best, h, i) => (Math.abs(h - height) < Math.abs(heights[best]! - height) ? i : best),
        0
      );
      setSnap(SNAPS[closest]!);
      lastDragEnd = performance.now();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  handle?.addEventListener("pointerdown", startDrag);
  head?.addEventListener("pointerdown", startDrag);

  setSnap(getSnap());
  window.addEventListener("resize", () => setSnap(getSnap()));

  return { getSnap, setSnap, isMobile, panel, currentHeight: () => snapHeight(getSnap()) };
};
