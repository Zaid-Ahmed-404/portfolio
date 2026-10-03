import { coreSkills, toolbox } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import { GraduationCap } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";
import SectionHeading from "../../shared/section-heading";
import Spotlight from "../../shared/spotlight";

const EducationSkills = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).skills;

  return (
    <section id="skills" className="relative border-t border-line">
      <div className="container py-24 md:py-32">
        <SectionHeading eyebrow={t.eyebrow} title={<AccentTitle title={t.title} />} description={t.description} />

        {/* Core skills */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {coreSkills.map((skill, index) => (
            <Reveal key={skill.name} direction="up" delay={index * 60}>
              <Spotlight className="card group flex h-full flex-col items-center gap-4 p-5 text-center transition-colors hover:border-line-strong">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2.5 ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
                  <Image src={getImgPath(skill.icon)} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
                </span>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-fg">{skill.name}</p>
                  <div
                    className="flex justify-center gap-1"
                    aria-label={`${t.levels[skill.rating - 1]} (${skill.rating} ${t.levelOf} 5)`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`h-1 w-3 rounded-full ${i < skill.rating ? "bg-accent" : "bg-line-strong"}`} />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.levels[skill.rating - 1]}</p>
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Toolbox */}
          <Reveal direction="up" className="lg:col-span-2">
            <div className="card grid h-full grid-cols-1 gap-x-8 gap-y-7 p-7 sm:grid-cols-2 md:p-9">
              {toolbox.map((group) => (
                <div key={group.key} className="flex flex-col gap-3">
                  <p className="eyebrow">{t.toolbox[group.key]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((entry) => {
                      const item = typeof entry === "string" ? entry : t.toolboxItems[entry.t];
                      return (
                        <span
                          key={item}
                          className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-[13px] text-fg/90 transition-colors hover:border-accent/40 hover:text-accent"
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Education */}
          {t.educationItems.map((edu) => (
            <Reveal key={edu.degree} direction="up" delay={100}>
              <Spotlight className="card relative flex h-full flex-col gap-6 overflow-hidden p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <GraduationCap size={20} />
                  </span>
                  <span className="font-mono text-sm text-muted">{edu.year}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="eyebrow">{t.education}</p>
                  <h3 className="text-xl font-semibold leading-snug">{edu.degree}</h3>
                  <p className="text-sm font-medium text-fg/80">{edu.school}</p>
                </div>
                <p className="text-sm leading-relaxed">{edu.description}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;
