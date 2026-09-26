"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  as?: ElementType;
}

const Reveal = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  as: Tag = "div",
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? "in-view" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
