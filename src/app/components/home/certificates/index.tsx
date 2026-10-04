"use client";

import { certificates } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import type { PointerEvent } from "react";
import Reveal from "../../fx/reveal";
import { ArrowUpRight, Award } from "../../shared/icons";
import SectionHeading from "../../shared/section-heading";

/** Feeds the pointer position to the row's glow (CSS vars). */
const trackGlow = (e: PointerEvent<HTMLAnchorElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

const Certificates = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).certificates;

  return (
    <section id="certificates" className="relative border-t border-line">
      <div className="container py-28 md:py-44">
        <SectionHeading index="05" eyebrow={t.eyebrow} title={t.title} />

        <ul className="border-t border-line">
          {certificates.map((cert, index) => (
            <Reveal key={cert.href} as="li" delay={index * 70} className="border-b border-line">
              <a
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                onPointerMove={trackGlow}
                className="group relative isolate flex items-center gap-5 overflow-hidden px-2 py-7 md:gap-8 md:px-4 md:py-9"
              >
                {/* Hover glow: follows the pointer, plus an accent line sweeping from the start edge */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ background: "radial-gradient(520px circle at var(--x, 50%) var(--y, 50%), var(--glow), transparent 60%)" }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 start-0 h-px w-full scale-x-0 bg-accent shadow-[0_0_12px_var(--accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ltr:origin-left rtl:origin-right"
                />

                <span dir="ltr" className="w-8 shrink-0 font-mono text-xs text-muted transition-colors group-hover:text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition-all duration-500 group-hover:border-accent/50 group-hover:text-accent group-hover:shadow-[0_0_24px_rgba(var(--accent-rgb),0.35)] sm:flex">
                  <Award size={18} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-8">
                  {/* Course titles are the official English names */}
                  <p
                    lang="en"
                    dir="ltr"
                    className="font-display text-lg font-medium leading-snug !text-fg transition-transform duration-500 group-hover:translate-x-1 md:text-2xl rtl:text-end rtl:group-hover:-translate-x-1"
                  >
                    {cert.title}
                  </p>
                  <p className="shrink-0 font-mono text-xs text-muted">
                    {cert.provider} · {t.months[cert.month - 1]} {cert.year}
                  </p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certificates;
