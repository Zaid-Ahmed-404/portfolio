"use client";

import { useDevice } from "@/lib/device";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/** Floating panel that tilts towards the pointer, with a light sheen. Inert on touch / reduced motion. */
const Tilt = ({ children, className = "", max = 5 }: TiltProps) => {
  const device = useDevice();
  const enabled = !!device && !device.coarse && !device.reducedMotion;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--my", `${py * 100}%`);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={`group/tilt relative ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{ background: "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 55%)" }}
      />
    </motion.div>
  );
};

export default Tilt;
