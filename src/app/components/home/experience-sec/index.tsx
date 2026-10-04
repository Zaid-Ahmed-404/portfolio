"use client";

import { experiences } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { gsap } from "@/lib/gsap";
import { useEffect, useRef } from "react";
import Tilt from "../../fx/tilt";
import { ArrowUpRight } from "../../shared/icons";
import SectionHeading from "../../shared/section-heading";

const ExperienceSec = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).experience;
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The rail draws itself as you scroll through the roles.
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
        }
      );

      const railX = fill.getBoundingClientRect().left;
      list.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        const item = panel.closest("li")!;
        // Panels swing in from the side away from the rail (works for LTR and RTL alike).
        const rect = panel.getBoundingClientRect();
        const side = rect.left + rect.width / 2 < railX ? 1 : -1;

        gsap.fromTo(
          panel,
          { opacity: 0, rotateY: side * 14, rotateX: 10, z: -220, y: 90 },
          {
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            y: 0,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 92%", end: "top 55%", scrub: 0.6 },
          }
        );

        gsap.to(item, {
          scrollTrigger: { trigger: item, start: "top 62%", toggleClass: "is-active" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="experience" className="relative border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(var(--accent-rgb),0.07),transparent)]" />
      <div className="container relative py-28 md:py-44">
        <SectionHeading index="02" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <ol ref={listRef} className="relative flex flex-col gap-10 [perspective:1600px] md:gap-24">
          {/* Rail + its glowing, scroll-drawn fill */}
          <span aria-hidden className="absolute bottom-0 start-[7px] top-0 w-px bg-line md:start-1/2">
            <span
              ref={fillRef}
              className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent to-accent/0 shadow-[0_0_14px_rgba(var(--accent-rgb),0.8)]"
            />
          </span>

          {experiences.map((exp, index) => {
            const item = t.items[exp.id];
            const panelFirst = index % 2 === 0;

            return (
              <li key={exp.id} className="group/item relative grid grid-cols-1 gap-4 ps-9 md:grid-cols-2 md:gap-0 md:ps-0">
                {/* Node on the rail */}
                <span
                  aria-hidden
                  className="absolute start-0 top-8 h-[15px] w-[15px] rounded-full border-2 border-line-strong bg-bg transition-all duration-500 group-[.is-active]/item:border-accent group-[.is-active]/item:bg-accent group-[.is-active]/item:shadow-[0_0_0_6px_rgba(var(--accent-rgb),0.15),0_0_24px_rgba(var(--accent-rgb),0.9)] md:start-1/2 md:-ms-[7px]"
                />

                {/* Meta: period + type, on the opposite side of the panel */}
                <div
                  className={`flex flex-col gap-3 md:row-start-1 md:pt-6 ${
                    panelFirst ? "md:col-start-2 md:ps-16" : "md:col-start-1 md:items-end md:pe-16 md:text-end"
                  }`}
                >
                  <span className="font-display text-3xl font-semibold tracking-[-0.03em] text-fg/90 md:text-5xl">{item.period}</span>
                  <div className="flex flex-wrap gap-2">
                    {exp.current && <span className="chip !border-accent/30 !bg-accent-soft !text-accent">{t.current}</span>}
                    <span className="chip">{item.type}</span>
                  </div>
                </div>

                {/* The floating panel */}
                <div
                  data-panel
                  className={`md:row-start-1 [transform-style:preserve-3d] ${panelFirst ? "md:col-start-1 md:pe-16" : "md:col-start-2 md:ps-16"}`}
                >
                  <Tilt className="glass rounded-3xl">
                    <article className="flex flex-col gap-5 p-6 md:p-8">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold md:text-2xl">{item.title}</h3>
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex w-fit items-center gap-1 text-sm text-accent/90 transition-colors hover:text-accent"
                        >
                          {exp.company}
                          <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                        </a>
                      </div>

                      <ul className="flex flex-col gap-3">
                        {item.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="relative ps-5 text-[15px] leading-relaxed text-body before:absolute before:start-0 before:top-[0.7em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent/70"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <ul className="flex flex-wrap gap-2 border-t border-line pt-5">
                        {exp.tech.map((tech) => (
                          <li key={tech} dir="ltr" className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-body">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Tilt>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSec;
