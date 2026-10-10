"use client";

import { useDevice } from "@/lib/device";
import { gsap } from "@/lib/gsap";
import { cursorStore, useStore, type CursorVariant } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

const DEFAULT = { variant: "default" as CursorVariant, label: "" };

const ringClass: Record<CursorVariant, string> = {
  default: "h-9 w-9 border-fg/30",
  link: "h-14 w-14 border-accent bg-accent/10",
  view: "h-24 w-24 border-accent bg-accent text-ink",
  drag: "h-20 w-20 border-accent/80 bg-white/50 text-accent backdrop-blur-sm",
  core: "h-28 w-28 border-accent/60 text-accent",
  hidden: "h-0 w-0 border-transparent opacity-0",
};

/**
 * Dot + trailing ring. Reacts to links/buttons (and any `data-cursor` element),
 * and to 3D objects through `setSceneCursor`. Fine pointers only, never with reduced motion.
 */
const Cursor = () => {
  const device = useDevice();
  const enabled = !!device && !device.coarse && !device.reducedMotion;

  const dom = useStore(cursorStore, (s) => s.dom, DEFAULT);
  const scene = useStore(cursorStore, (s) => s.scene, null);
  const { variant, label } = scene ?? dom;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button, [role='tab']");
      if (!target) {
        cursorStore.set({ dom: DEFAULT });
        return;
      }
      cursorStore.set({
        dom: {
          variant: (target.dataset.cursor as CursorVariant) || "link",
          label: target.dataset.cursorLabel ?? "",
        },
      });
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const showDot = variant === "default" || variant === "link";

  return (
    <div aria-hidden className={`no-print pointer-events-none fixed inset-0 z-[120] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] transition-[width,height,background-color,border-color,color,opacity,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${ringClass[variant]} ${pressed ? "scale-90" : "scale-100"}`}
      >
        <span className={`whitespace-nowrap transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent transition-[scale] duration-300 ${showDot ? "scale-100" : "scale-0"}`}
      />
    </div>
  );
};

export default Cursor;
