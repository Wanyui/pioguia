export const toggleCardExpandedContent = (card: Element | null, expanded: boolean) => {
  const description = card?.querySelector(".card-description");
  if (description instanceof HTMLElement) {
    description.classList.toggle("line-clamp-3", !expanded);
    description.classList.toggle("line-clamp-none", expanded);
    if (expanded) {
      // Force expanded text even if utility classes are not generated.
      description.style.display = "block";
      description.style.overflow = "visible";
      description.style.removeProperty("-webkit-line-clamp");
      description.style.removeProperty("-webkit-box-orient");
    } else {
      description.style.removeProperty("display");
      description.style.removeProperty("overflow");
      description.style.removeProperty("-webkit-line-clamp");
      description.style.removeProperty("-webkit-box-orient");
    }
  }

  const tags = card?.querySelector(".card-tags");
  if (tags instanceof HTMLElement) {
    tags.classList.toggle("truncate", !expanded);
    tags.classList.toggle("whitespace-normal", expanded);
  }
};

export const animateCardResize = (card: Element | null, expanded: boolean) => {
  if (!(card instanceof HTMLElement)) {
    toggleCardExpandedContent(card, expanded);
    return;
  }
  const startHeight = card.getBoundingClientRect().height;
  toggleCardExpandedContent(card, expanded);
  const endHeight = card.getBoundingClientRect().height;
  if (Math.abs(endHeight - startHeight) < 1) return;

  card.style.height = `${startHeight}px`;
  card.style.overflow = "hidden";
  card.style.transition = "height 220ms ease";

  requestAnimationFrame(() => {
    card.style.height = `${endHeight}px`;
  });

  const onEnd = () => {
    card.style.removeProperty("height");
    card.style.removeProperty("overflow");
    card.style.removeProperty("transition");
    card.removeEventListener("transitionend", onEnd);
  };
  card.addEventListener("transitionend", onEnd);
};

