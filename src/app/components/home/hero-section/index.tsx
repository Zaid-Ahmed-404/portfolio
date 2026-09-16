import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Reveal from "../../shared/reveal";

const stack = ["Flutter", "Laravel", "Spring Boot", "AWS"];

const HeroSection = () => {
  return (
    <section
      id="home"
      className="hero-section relative overflow-hidden pt-32 pb-16 md:pt-40 lg:pb-28 xl:pt-48"
    >
      <div
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="flex max-w-2xl flex-col gap-7 md:gap-8">
            <Reveal direction="up">
              <div className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Available for new opportunities
              </div>
            </Reveal>

            <Reveal direction="up" delay={120}>
              <h1 className="flex flex-col gap-1">
                <span className="inline-flex flex-wrap items-center gap-4">
                  Zaid Ahmed
                  <span className="wave inline-block">
                    <Image
                      src={getImgPath("/images/home/banner/wave-icon.svg")}
                      alt=""
                      width={44}
                      height={44}
                    />
                  </span>
                </span>
                <span className="text-primary">Software Engineer</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={220}>
              <p className="max-w-md text-base md:text-lg xl:max-w-xl">
                Specializing in Flutter and Laravel with a focus on scalable
                architectures, RESTful APIs, and cloud deployments —
                delivering production-grade applications for international
                clients.
              </p>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 transition-colors duration-300 hover:bg-primary"
                >
                  <span className="text-sm font-medium text-white">
                    View my work
                  </span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 transition-colors duration-300 hover:border-ink"
                >
                  <span className="text-sm font-medium text-ink">
                    Get in touch
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal direction="up" delay={360}>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-body"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal
            direction="right"
            delay={200}
            className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line shadow-[0_30px_60px_-25px_rgba(20,20,20,0.25)]">
              <Image
                src={getImgPath("/images/home/banner/banner-img.png")}
                alt="Zaid Ahmed"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="no-print absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-lg backdrop-blur sm:flex">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-xs text-muted">Based in</p>
                <p className="text-sm font-semibold text-ink">Saudi Arabia</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
