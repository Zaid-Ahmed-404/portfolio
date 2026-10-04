import { currentExperience as current, profile } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Counter from "../../fx/counter";
import Reveal from "../../fx/reveal";
import { ArrowUpRight, Briefcase, Globe, MapPin } from "../../shared/icons";
import SectionHeading from "../../shared/section-heading";

const AboutMe = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <section id="about" className="relative">
      <div className="container py-28 md:py-44">
        <SectionHeading index="01" eyebrow={t.eyebrow} title={t.title} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Bio + counters */}
          <Reveal className="md:col-span-4">
            <div className="glass flex h-full flex-col justify-between gap-12 p-7 md:p-10">
              <div className="flex flex-col gap-5">
                <p className="text-lg leading-relaxed text-fg md:text-2xl md:leading-snug">{t.lead}</p>
                <p className="leading-relaxed">{t.body}</p>
              </div>

              <dl className="grid grid-cols-3 gap-4 border-t border-line pt-8">
                {t.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse gap-2">
                    <dt className="text-xs text-muted md:text-sm">{s.label}</dt>
                    <dd className="font-display text-4xl font-semibold tracking-[-0.04em] text-fg md:text-6xl rtl:text-end">
                      <Counter value={s.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Portrait */}
          <Reveal delay={80} className="md:col-span-2">
            <figure className="glass relative h-full min-h-[22rem] overflow-hidden p-2">
              <div className="relative h-full min-h-[21rem] overflow-hidden rounded-[1.25rem]">
                <Image
                  src={getImgPath(profile.portraits.about)}
                  alt={dict.hero.portraitAlt}
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover object-top saturate-[0.8] transition-[filter,scale] duration-700 hover:scale-[1.03] hover:saturate-100"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                <figcaption className="absolute inset-x-4 bottom-4">
                  <p className="font-display text-lg font-semibold !text-white">{dict.profile.name}</p>
                  <p className="text-sm !text-white/70">{dict.profile.role}</p>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          {/* Current role */}
          <Reveal delay={60} className="md:col-span-2">
            <div className="glass flex h-full flex-col gap-5 p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Briefcase size={18} />
              </span>
              <div>
                <p className="eyebrow">{t.now}</p>
                <p className="mt-3 font-display text-lg font-medium text-fg">{dict.experience.items[current.id].title}</p>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-1 inline-flex items-center gap-1 text-sm text-body transition-colors hover:text-accent"
                >
                  @ {current.company}
                  <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Location */}
          <Reveal delay={120} className="md:col-span-2">
            <div className="glass flex h-full flex-col gap-5 p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <MapPin size={18} />
              </span>
              <div>
                <p className="eyebrow">{t.basedIn}</p>
                <p className="mt-3 font-display text-lg font-medium text-fg">{dict.profile.location}</p>
                <p className="mt-1 text-sm">{t.openTo}</p>
              </div>
            </div>
          </Reveal>

          {/* Languages */}
          <Reveal delay={180} className="md:col-span-2">
            <div className="glass flex h-full flex-col gap-5 p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Globe size={18} />
              </span>
              <div>
                <p className="eyebrow">{t.languages}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {dict.profile.languages.map((lang) => (
                    <li key={lang} className="chip !px-3.5 !py-1.5 !text-sm !text-fg">
                      {lang}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">{t.languagesNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
