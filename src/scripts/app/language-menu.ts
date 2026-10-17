import type { LanguageCode } from "../map-i18n";

/** Accessible language dropdown (listbox) wired to the hidden #lang-select. */
export const setupLanguageMenu = (onChange: (lang: LanguageCode) => void) => {
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement | null;
  const langTrigger = document.getElementById("lang-trigger") as HTMLButtonElement | null;
  const langMenu = document.getElementById("lang-menu");
  const options = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-lang-option]"));

  langSelect?.addEventListener("change", () => onChange(langSelect.value as LanguageCode));
  if (!langTrigger || !langMenu) return { close: () => {} };

  const close = () => {
    langMenu.classList.add("hidden");
    langTrigger.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    langMenu.classList.remove("hidden");
    langTrigger.setAttribute("aria-expanded", "true");
  };
  const isOpen = () => !langMenu.classList.contains("hidden");

  langTrigger.addEventListener("click", () => (isOpen() ? close() : open()));

  options.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.langOption as LanguageCode | undefined;
      if (!lang) return;
      onChange(lang);
      close();
    });
    button.addEventListener("keydown", (event) => {
      const index = options.indexOf(button);
      const focusAt = (i: number) => options[(i + options.length) % options.length]?.focus();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusAt(index + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusAt(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusAt(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusAt(options.length - 1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
        langTrigger.focus();
      }
    });
  });

  langTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen()) {
        close();
        return;
      }
      open();
      options[0]?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      open();
      options[0]?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target as Node;
    if (!langMenu.contains(target) && !langTrigger.contains(target)) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
      langTrigger.focus();
    }
  });

  return { close };
};
