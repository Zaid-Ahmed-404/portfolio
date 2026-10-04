"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** The active Lenis instance; `null` when smooth scrolling is off (reduced motion). */
let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Scrolls with Lenis when available, natively otherwise. */
export const scrollToY = (y: number, immediate = false) => {
  if (lenis) lenis.scrollTo(y, { immediate, force: true });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
};

export const lockScroll = (locked: boolean) => {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
};

export { gsap, ScrollTrigger };
