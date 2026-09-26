"use client";

import type { ReactNode, PointerEvent } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

const Spotlight = ({ children, className = "" }: SpotlightProps) => {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
};

export default Spotlight;
