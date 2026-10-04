"use client";

import { gsap, ScrollTrigger, setLenis } from "@/lib/gsap";
import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * stay frame-synced. Skipped entirely for prefers-reduced-motion.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // In-page anchors (#work, #contact…) scroll smoothly and clear the fixed header.
      anchors: { offset: -80 },
      autoRaf: false,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
};

export default SmoothScroll;
