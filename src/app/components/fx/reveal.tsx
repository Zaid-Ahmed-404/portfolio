"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "h1" | "h2" | "h3" | "p";
}

/** Fades content up once it enters the viewport. Content stays visible without JS. */
const Reveal = ({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // One concrete tag type keeps the ref/props typing simple; the DOM element differs only by name.
  const Comp = Tag as "div";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Comp ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` } as CSSProperties}>
      {children}
    </Comp>
  );
};

export default Reveal;
