import { RefObject, useEffect, useState } from "react";
import share1 from "../../assets/images/sharedImages/share1.jpg";
import share2 from "../../assets/images/sharedImages/share2.jpg";
import share3 from "../../assets/images/sharedImages/share3.jpg";
import share4 from "../../assets/images/sharedImages/share4.jpg";
import share5 from "../../assets/images/sharedImages/share5.jpg";
import share6 from "../../assets/images/sharedImages/share6.jpg";
import share7 from "../../assets/images/sharedImages/share7.jpg";
import share8 from "../../assets/images/sharedImages/share8.jpg";

//--Travel Images --//
export const images = [
  {
    url: share1,
    alt: "Busy city street with tall buildings and bustling activity.",
  },
  { url: share2, alt: "Two children under an umbrella on a sandy beach." },
  { url: share3, alt: "A couple enjoying the beach." },
  {
    url: share4,
    alt: "A woman swimming underwater, surrounded by clear blue water.",
  },
  {
    url: share5,
    alt: "A family together in the forest, enjoying the peaceful atmosphere surrounded by tall trees and nature.",
  },
  { url: share6, alt: "A man swimming underwater with a mask and snorkel." },
  {
    url: share7,
    alt: "Mother and daughter enjoying time together at the beach.",
  },
  {
    url: share8,
    alt: "Woman standing under a straw-roofed shelter, enjoying a breathtaking landscape view.",
  },
];


//-- Scrolls the photo row in the specified direction --//
export const scrollPhotos = (
  direction: number,
  container: HTMLDivElement | null
) => {
  if (container) {
    const scrollAmount = 250;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }
};

// arrow visibility based on scroll position
export const checkScrollVisibility = (container: HTMLDivElement | null) => {
  if (!container) return { showLeft: false, showRight: false };

  const showLeft = container.scrollLeft > 0;
  const showRight =
    container.scrollLeft + container.clientWidth < container.scrollWidth;

  return { showLeft, showRight };
};

//-- Hook to manage arrow visibility --//
export const useScrollArrows = (ref: RefObject<HTMLDivElement>) => {
  const [arrowVisibility, setArrowVisibility] = useState({
    showLeft: false,
    showRight: false,
  });

  useEffect(() => {
    const container = ref.current;

    const updateArrows = () => {
      const visibility = checkScrollVisibility(container);
      setArrowVisibility(visibility);
    };

    updateArrows();
    window.addEventListener("resize", updateArrows);
    container?.addEventListener("scroll", updateArrows);

    return () => {
      window.removeEventListener("resize", updateArrows);
      container?.removeEventListener("scroll", updateArrows);
    };
  }, [ref]);

  return arrowVisibility;
};
