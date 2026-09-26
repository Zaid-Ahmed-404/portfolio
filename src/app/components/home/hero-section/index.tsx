import { experiences, profile, stack } from "@/data/content";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import CopyEmail from "../../shared/copy-email";
import { ArrowRight, Download, Github, Linkedin, MapPin } from "../../shared/icons";
import Reveal from "../../shared/reveal";

const current = experiences.find((e) => e.current) ?? experiences[0];

const HeroSection = () => {
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
              <span className="chip !py-1.5 !pl-2 !pr-3.5 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for new opportunities
              </span>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <h1 className="text-[2.75rem] font-semibold leading-[1] tracking-[-0.04em] xs:text-5xl md:text-6xl xl:text-7xl">
                Engineering{" "}
                <span className="serif-accent text-accent">scalable</span>{" "}
                software for web &amp; mobile.
              </h1>
            </Reveal>

            <Reveal direction="up" delay={180}>
              <p className="max-w-xl text-base leading-relaxed md:text-lg">
                I&apos;m <span className="font-medium text-fg">Zaid Ahmed</span>, a
                full-stack software engineer specializing in{" "}
                <span className="text-fg">Spring Boot</span>,{" "}
                <span className="text-fg">Laravel</span> and{" "}
                <span className="text-fg">Flutter</span> — designing secure APIs,
                cloud-native microservices and production-grade apps for
                international clients.
              </p>
            </Reveal>

            <Reveal direction="up" delay={260}>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#work" className="btn-accent group">
                  View selected work
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
                <a href={getImgPath(profile.resume)} download className="btn-ghost">
                  <Download size={16} />
                  Download resume
                </a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={320}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <CopyEmail email={profile.email} />
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
                  alt="Portrait of Zaid Ahmed"
                  fill
                  priority
                  sizes="(min-width: 1024px) 400px, 352px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold !text-white">{profile.name}</p>
                    <p className="text-sm !text-white/70">{profile.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                    <MapPin size={12} />
                    KSA
                  </span>
                </div>
              </div>
            </div>

            <div className="no-print absolute -left-4 top-10 hidden rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl sm:block lg:-left-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Currently</p>
              <p className="mt-0.5 text-sm font-medium text-fg">{current.title}</p>
              <p className="text-xs text-body">@ {current.company}</p>
            </div>

            <div className="no-print absolute -right-3 bottom-24 hidden items-center gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl sm:flex lg:-right-6">
              <span className="text-3xl font-semibold tracking-tight text-accent">4+</span>
              <span className="text-xs leading-tight text-body">
                years building
                <br />
                production systems
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tech marquee */}
      <div className="relative mt-20 border-y border-line bg-surface/50 py-5 md:mt-28">
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
