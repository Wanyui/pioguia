import { MOBILE_QUERY } from "./context";

const COMPACT_ENTER_Y = 12;
const COMPACT_EXIT_Y = 2;

/** On mobile, hides the title, language and map-style rows once the page scrolls. */
export const setupCompactHeader = (onCompact: () => void) => {
  const appHeader = document.getElementById("app-header");
  const headerInner = document.getElementById("header-inner");
  const headerMetaRow = document.getElementById("header-meta-row");
  const langControls = document.getElementById("lang-controls");
  const mapStyleControls = document.getElementById("map-style-controls");
  if (!appHeader || !headerInner || !headerMetaRow || !langControls || !mapStyleControls) return;

  let isCompact = false;
  const apply = (compact: boolean) => {
    if (isCompact === compact) return;
    isCompact = compact;
    appHeader.classList.toggle("header-compact", compact);
    headerInner.classList.toggle("py-3", !compact);
    headerInner.classList.toggle("py-2", compact);
    headerMetaRow.classList.toggle("hidden", compact);
    langControls.classList.toggle("hidden", compact);
    mapStyleControls.classList.toggle("hidden", compact);
    mapStyleControls.classList.toggle("inline-flex", !compact);
    if (compact) onCompact();
  };

  const update = () => {
    if (!window.matchMedia(MOBILE_QUERY).matches) {
      apply(false);
      return;
    }
    const y = window.scrollY;
    // Keep compact mode stable while scrolling; only restore full header near top.
    apply((!isCompact && y > COMPACT_ENTER_Y) || (isCompact && y > COMPACT_EXIT_Y));
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
};
