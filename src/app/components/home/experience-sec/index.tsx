import { experiences } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { ArrowUpRight } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";
import SectionHeading from "../../shared/section-heading";

const ExperienceSec = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).experience;

  return (
    <section id="experience" className="relative border-t border-line bg-surface/40">
      <div className="container py-24 md:py-32">
        <SectionHeading eyebrow={t.eyebrow} title={<AccentTitle title={t.title} />} description={t.description} />

        <ol className="relative flex flex-col gap-4">
          {/* timeline rail */}
          <span aria-hidden className="absolute bottom-6 start-[7px] top-6 hidden w-px bg-line md:block" />

          {experiences.map((exp, index) => {
            const item = t.items[exp.id];
            return (
              <Reveal key={exp.id} as="li" direction="up" delay={index * 80} className="relative md:ps-12">
                <span
                  aria-hidden
                  className={`absolute start-0 top-9 hidden h-[15px] w-[15px] rounded-full border-2 md:block ${
                    exp.current
                      ? "border-accent bg-accent shadow-[0_0_0_6px_var(--accent-soft)]"
                      : "border-line-strong bg-bg"
                  }`}
                />

                <article className="card group grid grid-cols-1 gap-6 p-6 transition-colors duration-300 hover:border-line-strong md:p-8 lg:grid-cols-[220px_1fr] lg:gap-10">
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-sm text-muted">{item.period}</span>
                    <div className="flex flex-wrap gap-2">
                      {exp.current && (
                        <span className="chip !border-accent/30 !bg-accent-soft !text-accent">{t.current}</span>
                      )}
                      <span className="chip">{item.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-semibold md:text-2xl">{item.title}</h3>
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1 text-sm text-body transition-colors hover:text-accent"
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

                    <div className="flex flex-wrap gap-2 pt-1">
                      {exp.tech.map((tech) => (
                        <span key={tech} className="rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-body">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSec;
