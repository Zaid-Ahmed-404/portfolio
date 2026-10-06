import { profile, stack } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import type { CSSProperties } from "react";
import Magnetic from "../../fx/magnetic";
import SplitTitle from "../../fx/split-title";
import CopyEmail from "../../shared/copy-email";
import { ArrowRight, Download, Github, Linkedin } from "../../shared/icons";
import { Rich } from "../../shared/rich-text";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const HeroSection = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.hero;

  return (
    <>
      <section id="home" className="relative flex min-h-svh flex-col">
        <div className="container relative grid flex-1 items-center pb-14 pt-28 lg:pb-20 lg:pt-32">
          {/* Copy */}
          <div className="flex flex-col gap-7 lg:gap-8">
            <span className="intro-fade chip w-fit !py-1.5 !ps-2.5 !pe-3.5 backdrop-blur-md" style={delay(0)}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t.available}
            </span>

            <SplitTitle
              as="h1"
              title={t.title}
              trigger="ready"
              delay={120}
              className="text-[clamp(2.7rem,6.4vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />

            <p className="intro-fade max-w-xl text-base leading-relaxed md:text-lg" style={delay(550)}>
              <Rich text={t.intro} />
            </p>

            <div className="intro-fade flex flex-wrap items-center gap-3" style={delay(700)}>
              <Magnetic>
                <a href="#work" className="btn-accent group">
                  {t.viewWork}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={getImgPath(profile.resume)} download className="btn-ghost backdrop-blur-md">
                  <Download size={16} />
                  {t.downloadResume}
                </a>
              </Magnetic>
            </div>

            <div className="intro-fade flex flex-wrap items-center gap-x-5 gap-y-3" style={delay(850)}>
              <CopyEmail email={profile.email} locale={locale} />
              <span className="hidden h-4 w-px bg-line-strong sm:block" />
              <div className="flex items-center gap-1">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <Github size={17} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="intro-fade container relative hidden items-end justify-between pb-8 md:flex" style={delay(1100)}>
          <a href="#about" className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <span className="scroll-line absolute inset-0 bg-accent" />
            </span>
            <span className="transition-colors group-hover:text-fg">{dict.fx.scroll}</span>
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {dict.profile.role} · {dict.profile.locationShort}
          </span>
        </div>
      </section>

      {/* Slanted tech band — tech names are always Latin, so keep it LTR */}
      <div className="relative z-10 overflow-x-clip py-8">
        <div
          dir="ltr"
          className="intro-fade -mx-[4vw] -rotate-2 bg-accent py-4 shadow-[0_20px_60px_-20px_rgba(var(--accent-rgb),0.7)]"
          style={delay(1200)}
        >
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex w-max items-center">
              {[...stack, ...stack].map((item, i) => (
                <span
                  key={i}
                  aria-hidden={i >= stack.length}
                  className="flex items-center gap-8 pr-8 font-display text-xl font-bold uppercase tracking-tight text-[#0a0a0b] md:text-2xl"
                >
                  {item}
                  <span className="text-base">✺</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
