"use client";

import { useDevice } from "@/lib/device";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** How far the element follows the pointer, as a fraction of the pointer offset. */
  strength?: number;
  className?: string;
}

/** Pulls its child towards the pointer while hovered. Inert on touch / reduced motion. */
const Magnetic = ({ children, strength = 0.3, className = "" }: MagneticProps) => {
  const device = useDevice();
  const enabled = !!device && !device.coarse && !device.reducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 16, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={`inline-flex ${className}`}>
      {children}
    </motion.div>
  );
};

export default Magnetic;
