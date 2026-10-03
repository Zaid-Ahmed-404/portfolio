import { currentExperience as current, profile, stack } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import CopyEmail from "../../shared/copy-email";
import { ArrowRight, Download, Github, Linkedin, MapPin } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle, Rich } from "../../shared/rich-text";

const HeroSection = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.hero;

  return (
    <section id="home" className="relative overflow-hidden pt-32 md:pt-40">
      {/* Background: grid + accent glow */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px] dark:bg-accent/15"
      />

      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          <div className="flex flex-col gap-7">
            <Reveal direction="up">
              <span className="chip !py-1.5 !ps-2 !pe-3.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {t.available}
              </span>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <h1 className="text-[2.75rem] font-semibold leading-[1] tracking-[-0.04em] xs:text-5xl md:text-6xl xl:text-7xl">
                <AccentTitle title={t.title} />
              </h1>
            </Reveal>

            <Reveal direction="up" delay={180}>
              <p className="max-w-xl text-base leading-relaxed md:text-lg">
                <Rich text={t.intro} />
              </p>
            </Reveal>

            <Reveal direction="up" delay={260}>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#work" className="btn-accent group">
                  {t.viewWork}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
                <a href={getImgPath(profile.resume)} download className="btn-ghost">
                  <Download size={16} />
                  {t.downloadResume}
                </a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={320}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <CopyEmail email={profile.email} locale={locale} />
                <span className="hidden h-4 w-px bg-line-strong sm:block" />
                <div className="flex items-center gap-1">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <Github size={17} />
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal direction="scale" delay={200} className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
            <div className="relative rounded-[2rem] border border-line bg-surface p-2 shadow-card">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                <Image
                  src={getImgPath("/images/home/banner/banner-img.png")}
                  alt={t.portraitAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 352px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold !text-white">{dict.profile.name}</p>
                    <p className="text-sm !text-white/70">{dict.profile.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                    <MapPin size={12} />
                    {dict.profile.locationShort}
                  </span>
                </div>
              </div>
            </div>

            <div className="no-print absolute -start-4 top-10 hidden rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl sm:block lg:-start-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t.currently}</p>
              <p className="mt-0.5 text-sm font-medium text-fg">{dict.experience.items[current.id].title}</p>
              <p className="text-xs text-body">@ {current.company}</p>
            </div>

            <div className="no-print absolute -end-3 bottom-24 hidden items-center gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl sm:flex lg:-end-6">
              <span dir="ltr" className="text-3xl font-semibold tracking-tight text-accent">4+</span>
              <span className="text-xs leading-tight text-body">
                {t.yearsBuilding[0]}
                <br />
                {t.yearsBuilding[1]}
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tech marquee — tech names are always Latin, so keep it LTR */}
      <div dir="ltr" className="relative mt-20 border-y border-line bg-surface/50 py-5 md:mt-28">
        <div className="marquee overflow-hidden">
          <div className="marquee-track flex w-max items-center">
            {[...stack, ...stack].map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= stack.length}
                className="flex items-center gap-10 pr-10 font-mono text-sm uppercase tracking-widest text-muted"
              >
                {item}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
