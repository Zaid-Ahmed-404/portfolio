"use client";

import { coreSkills, toolbox } from "@/data/content";
import { dirOf, getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useRef, type CSSProperties } from "react";
import Reveal from "../../fx/reveal";
import { GraduationCap } from "../../shared/icons";
import SectionHeading from "../../shared/section-heading";
import { useSceneGate } from "../../three/use-scene-gate";

const SkillsSphere = dynamic(() => import("../../three/skills-sphere"), { ssr: false });

const EducationSkills = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.skills;
  const stageRef = useRef<HTMLDivElement>(null);
  const { device, mount, active } = useSceneGate(stageRef);

  const logos = useMemo(() => coreSkills.map((s) => ({ name: s.name, icon: getImgPath(s.icon) })), []);

  // Toolbox entries become the smaller tags on the sphere (minus ones that already have a logo).
  const tags = useMemo(() => {
    const logoNames = coreSkills.map((s) => s.name.toLowerCase());
    const all = toolbox.flatMap((g) => g.items.map((e) => (typeof e === "string" ? e : t.toolboxItems[e.t])));
    return [...new Set(all)].filter((tag) => !logoNames.some((n) => n.includes(tag.toLowerCase()) || tag.toLowerCase().includes(n)));
  }, [t]);

  return (
    <section id="skills" className="relative border-t border-line">
      <div className="container py-28 md:py-44">
        <SectionHeading index="03" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Interactive sphere (decorative: the same skills are listed beside it) */}
          <div
            ref={stageRef}
            aria-hidden
            data-cursor="drag"
            data-cursor-label={dict.fx.drag}
            className="relative mx-auto aspect-square w-full max-w-[36rem]"
          >
            <div className="scene-fallback absolute inset-0 rounded-full [--fx:50%] [--fy:50%]" />

            {mount && device ? (
              <div className="absolute inset-0">
                <SkillsSphere device={device} active={active} logos={logos} tags={tags} dir={dirOf(locale)} />
              </div>
            ) : device?.tier === "fallback" ? (
              // Static orbit for devices without (capable) WebGL.
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute h-[70%] w-[70%] rounded-full border border-line" />
                <span className="absolute h-[42%] w-[42%] rounded-full border border-dashed border-accent/30" />
                {logos.map((logo, i) => (
                  <span
                    key={logo.name}
                    className="absolute flex h-14 w-14 items-center justify-center rounded-2xl bg-fg p-3"
                    style={
                      {
                        transform: `rotate(${(360 / logos.length) * i}deg) translateY(max(-34vw, -12rem)) rotate(${(-360 / logos.length) * i}deg)`,
                      } as CSSProperties
                    }
                  >
                    <Image src={logo.icon} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                  </span>
                ))}
              </div>
            ) : null}

            {mount && (
              <span className="pointer-events-none absolute bottom-2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                ← {dict.fx.dragHint} →
              </span>
            )}
          </div>

          {/* Core skills with proficiency */}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {coreSkills.map((skill, index) => (
              <Reveal as="li" key={skill.name} delay={index * 50}>
                <div className="glass flex items-center gap-4 !rounded-2xl px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fg p-2">
                    <Image src={getImgPath(skill.icon)} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                  </span>
                  <span dir="ltr" className="flex-1 text-sm font-medium text-fg rtl:text-end">
                    {skill.name}
                  </span>
                  <span className="flex flex-col items-end gap-1.5">
                    <span className="flex gap-1" aria-label={`${t.levels[skill.rating - 1]} (${skill.rating} ${t.levelOf} 5)`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-1 w-3 rounded-full ${i < skill.rating ? "bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" : "bg-line-strong"}`}
                        />
                      ))}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.levels[skill.rating - 1]}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Toolbox */}
          <Reveal className="lg:col-span-2">
            <div className="glass grid h-full grid-cols-1 gap-x-10 gap-y-8 p-7 sm:grid-cols-2 md:p-10">
              {toolbox.map((group) => (
                <div key={group.key} className="flex flex-col gap-3">
                  <p className="eyebrow !text-fg/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {t.toolbox[group.key]}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((entry) => {
                      const item = typeof entry === "string" ? entry : t.toolboxItems[entry.t];
                      return (
                        <li
                          key={item}
                          className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[13px] text-fg/85 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Education */}
          {t.educationItems.map((edu) => (
            <Reveal key={edu.degree} delay={100}>
              <article className="glass relative flex h-full flex-col gap-6 overflow-hidden p-7 md:p-10">
                <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <GraduationCap size={20} />
                  </span>
                  <span className="font-display text-3xl font-semibold tracking-tight text-fg/90">{edu.year}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="eyebrow">{t.education}</p>
                  <h3 className="text-xl font-semibold leading-snug">{edu.degree}</h3>
                  <p className="text-sm font-medium text-fg/80">{edu.school}</p>
                </div>
                <p className="text-sm leading-relaxed">{edu.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;
