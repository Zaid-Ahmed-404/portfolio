import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Reveal from "../../shared/reveal";
import SectionHeading from "../../shared/section-heading";

const stats = [
  { count: "04", label: "Years of experience" },
  { count: "20+", label: "Happy clients" },
  { count: "30+", label: "Projects completed" },
];

const AboutMe = () => {
  return (
    <section id="about" className="bg-surface">
      <div className="container py-16 md:py-28">
        <SectionHeading index="01" title="About Me" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal
            direction="left"
            delay={100}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <p className="text-lg leading-relaxed">
              Full-Stack Software Engineer specializing in Flutter and
              Laravel. Proven track record of delivering production-grade
              applications for international clients and optimizing system
              performance, with extensive experience across AWS, Hostinger,
              and cPanel environments.
            </p>

            <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={getImgPath("/images/icon/lang-icon.svg")}
                  alt=""
                  width={26}
                  height={26}
                />
                <p className="text-sm font-medium text-ink">Languages</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {["English", "Arabic", "Urdu"].map((lang) => (
                  <span
                    key={lang}
                    className="w-fit rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5 grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-4">
            {stats.map((item, i) => (
              <Reveal
                key={i}
                direction="right"
                delay={i * 100}
                className="group flex flex-col justify-between gap-2 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:flex-row lg:items-center lg:gap-4 lg:p-6"
              >
                <span className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                  {item.count}
                </span>
                <p className="text-sm font-medium text-ink lg:text-base">
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
