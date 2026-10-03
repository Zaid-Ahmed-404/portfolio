import { certificates } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { ArrowUpRight, Award } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";
import SectionHeading from "../../shared/section-heading";

const Certificates = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).certificates;

  return (
    <section id="certificates" className="relative border-t border-line">
      <div className="container py-24 md:py-32">
        <SectionHeading eyebrow={t.eyebrow} title={<AccentTitle title={t.title} />} />

        <ul className="card divide-y divide-line overflow-hidden">
          {certificates.map((cert, index) => (
            <Reveal key={cert.href} as="li" direction="up" delay={index * 70}>
              <a
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-5 transition-colors duration-300 hover:bg-surface-2 md:gap-6 md:px-8 md:py-6"
              >
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent sm:flex">
                  <Award size={18} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
                  {/* Course titles are the official English names */}
                  <p lang="en" dir="ltr" className="font-medium leading-snug !text-fg rtl:text-end">
                    {cert.title}
                  </p>
                  <p className="shrink-0 font-mono text-xs text-muted">
                    {cert.provider} · {t.months[cert.month - 1]} {cert.year}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certificates;
