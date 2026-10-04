"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";

type Title = { pre: string; accent: string; post: string };

interface SplitTitleProps {
  title: Title;
  as?: "div" | "li" | "h1" | "h2" | "h3" | "p";
  className?: string;
  /** "ready": plays when the loader finishes (hero). "view": plays when scrolled into view. */
  trigger?: "ready" | "view";
  /** Extra delay before the first letter, in ms. */
  delay?: number;
}

const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

/**
 * Staggered letter reveal. Latin words split into letters; Arabic words animate
 * as whole words because Arabic letters must stay connected. Screen readers get
 * the plain sentence; the animated copy is aria-hidden.
 */
const SplitTitle = ({ title, as: Tag = "h2", className = "", trigger = "view", delay = 0 }: SplitTitleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // One concrete tag type keeps the ref/props typing simple; the DOM element differs only by name.
  const Comp = Tag as "div";

  useEffect(() => {
    const node = ref.current;
    if (trigger !== "view" || !node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);

  const segments = [
    { text: title.pre, accent: false },
    { text: title.accent, accent: true },
    { text: title.post, accent: false },
  ].filter((s) => s.text);

  const plain = segments.map((s) => s.text).join(" ");
  let index = 0;

  return (
    <Comp ref={ref} className={`split ${className}`} data-trigger={trigger} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden>
        {segments.map((segment, s) => (
          <span key={s} className={segment.accent ? "accent-text" : undefined}>
            {segment.text.split(/\s+/).map((word, w, words) => {
              const isArabic = ARABIC.test(word);
              const chars = isArabic ? [word] : Array.from(word);
              const node = (
                <span className="split-word">
                  {chars.map((char, c) => (
                    <span key={c} className="split-char" style={{ "--i": (index += isArabic ? 3 : 1) } as CSSProperties}>
                      {char}
                    </span>
                  ))}
                </span>
              );
              const last = s === segments.length - 1 && w === words.length - 1;
              return (
                <Fragment key={w}>
                  {node}
                  {!last && " "}
                </Fragment>
              );
            })}
          </span>
        ))}
      </span>
    </Comp>
  );
};

export default SplitTitle;
