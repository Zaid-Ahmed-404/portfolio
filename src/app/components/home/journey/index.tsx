"use client";

import { dirOf, getDictionary, type Locale } from "@/i18n";
import { ScrollTrigger } from "@/lib/gsap";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useSceneGate } from "../../three/use-scene-gate";

const HeroScene = dynamic(() => import("../../three/hero-scene"), { ssr: false });

/**
 * Wraps Hero + About around one sticky, full-viewport WebGL layer: rising embers
 * behind both sections, and the hero avatar rendered as an animated 3D developer
 * over its DOM placeholder. Without WebGL the SVG avatar simply stays visible.
 */
const Journey = ({ locale, children }: { locale: Locale; children: ReactNode }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const { device, mount, active } = useSceneGate(trackRef, { rootMargin: "0px" });
  const webgl = !!device && device.tier !== "fallback";

  // On WebGL tiers the 3D developer replaces the SVG avatar (CSS: html.hero-3d).
  useEffect(() => {
    if (!webgl) return;
    const root = document.documentElement;
    root.classList.add("hero-3d");
    return () => root.classList.remove("hero-3d");
  }, [webgl]);

  const onPortrait = useCallback((ok: boolean) => {
    if (!ok) document.documentElement.classList.remove("hero-3d");
  }, []);

  // Dim the scene as the About content takes over, keeping the text readable.
  useEffect(() => {
    const track = trackRef.current;
    const dim = dimRef.current;
    if (!track || !dim) return;
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        dim.style.opacity = String(Math.min(0.5, Math.max(0, (self.progress - 0.2) * 1.2)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={trackRef} className="relative">
      <div
        aria-hidden
        className="pointer-events-none sticky top-0 -mb-[100svh] h-svh w-full overflow-hidden"
        style={{ "--fx": dirOf(locale) === "rtl" ? "25%" : "75%", "--fy": "55%" } as CSSProperties}
      >
        <div className="scene-fallback absolute inset-0 max-lg:[--fx:50%] max-lg:[--fy:30%]" />
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
        {mount && device && (
          <div className="absolute inset-0">
            <HeroScene
              device={device}
              active={active}
              trackRef={trackRef}
              hoverLabel={getDictionary(locale).fx.core}
              onPortrait={onPortrait}
            />
          </div>
        )}
        {/* Vignette + scroll-driven dim layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(10,10,11,0.7))]" />
        <div ref={dimRef} className="absolute inset-0 bg-bg opacity-0" />
      </div>
      {children}
    </div>
  );
};

export default Journey;
