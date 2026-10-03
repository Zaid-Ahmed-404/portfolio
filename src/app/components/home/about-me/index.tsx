import { currentExperience as current } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { Briefcase, Globe, MapPin } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";
import SectionHeading from "../../shared/section-heading";
import Spotlight from "../../shared/spotlight";

const AboutMe = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <section id="about" className="relative">
      <div className="container py-24 md:py-32">
        <SectionHeading eyebrow={t.eyebrow} title={<AccentTitle title={t.title} />} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Bio */}
          <Reveal direction="up" className="md:col-span-4 md:row-span-2">
            <Spotlight className="card flex h-full flex-col justify-between gap-10 p-7 md:p-9">
              <div className="flex flex-col gap-5">
                <p className="text-lg leading-relaxed text-fg md:text-xl">{t.lead}</p>
                <p className="leading-relaxed">{t.body}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-line pt-7">
                {t.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span dir="ltr" className="text-3xl font-semibold tracking-tight text-fg md:text-5xl rtl:text-end">
                      {s.value}
                    </span>
                    <span className="text-xs text-muted md:text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </Spotlight>
          </Reveal>

          {/* Current role */}
          <Reveal direction="up" delay={80} className="md:col-span-2">
            <Spotlight className="card flex h-full flex-col gap-4 p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Briefcase size={18} />
              </span>
              <div>
                <p className="eyebrow">{t.now}</p>
                <p className="mt-2 font-medium text-fg">{dict.experience.items[current.id].title}</p>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-body underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent"
                >
                  {current.company}
                </a>
              </div>
            </Spotlight>
          </Reveal>

          {/* Location */}
          <Reveal direction="up" delay={140} className="md:col-span-2">
            <Spotlight className="card relative flex h-full flex-col gap-4 overflow-hidden p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <MapPin size={18} />
              </span>
              <div>
                <p className="eyebrow">{t.basedIn}</p>
                <p className="mt-2 font-medium text-fg">{dict.profile.location}</p>
                <p className="text-sm">{t.openTo}</p>
              </div>
            </Spotlight>
          </Reveal>

          {/* Languages */}
          <Reveal direction="up" delay={200} className="md:col-span-6">
            <Spotlight className="card flex h-full flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Globe size={18} />
                </span>
                <div>
                  <p className="eyebrow">{t.languages}</p>
                  <p className="mt-1 text-sm">{t.languagesNote}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {dict.profile.languages.map((lang) => (
                  <span key={lang} className="chip !px-4 !py-2 !text-sm !text-fg">
                    {lang}
                  </span>
                ))}
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
