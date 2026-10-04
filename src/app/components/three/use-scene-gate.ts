"use client";

import { useDevice, type Device, type Tier } from "@/lib/device";
import { useEffect, useState, type RefObject } from "react";

/**
 * Decides whether a WebGL scene should exist and whether it should render:
 * - `mount`: device tier allows it AND the section has come near the viewport
 *   once (the 3D chunk is only downloaded then, via next/dynamic);
 * - `active`: the section is currently on (or near) screen — scenes use it to
 *   switch their frameloop to "never" when off-screen.
 */
export const useSceneGate = (
  ref: RefObject<Element | null>,
  { rootMargin = "200px", tiers = ["high", "mobile"] as Tier[] } = {}
): { device: Device | null; mount: boolean; active: boolean } => {
  const device = useDevice();
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(false);
  const allowed = !!device && tiers.includes(device.tier);

  useEffect(() => {
    const node = ref.current;
    if (!node || !allowed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, allowed]);

  return { device, mount: allowed && seen, active };
};
