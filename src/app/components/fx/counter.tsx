"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Counts a stat like "4+" or "30+" up from zero when it scrolls into view.
 * Server HTML (and reduced motion) shows the final value.
 */
const Counter = ({ value, className = "" }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    if (!node || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const render = (n: number) => {
      node.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };
    render(0);

    let stop: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const controls = animate(0, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: render });
        stop = () => controls.stop();
      },
      { threshold: 0.6 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      stop?.();
      node.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} dir="ltr" className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
};

export default Counter;
