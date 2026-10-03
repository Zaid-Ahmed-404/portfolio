import { profile } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import CopyEmail from "../../shared/copy-email";
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";

const Contact = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).contact;

  const channels = [
    { label: t.channels.email, value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
    { label: t.channels.phone, value: profile.phone, href: profile.phoneHref, Icon: Phone },
    { label: t.channels.linkedin, value: "in/zaid-ahmed", href: profile.linkedin, Icon: Linkedin, external: true },
    { label: t.channels.github, value: "Zaid-Ahmed-404", href: profile.github, Icon: Github, external: true },
  ];

  return (
    <section id="contact" className="relative border-t border-line">
      <div className="container py-24 md:py-32">
        <Reveal direction="up">
          <div className="bg-noise relative overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-14 text-center md:px-12 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]"
            />
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            <div className="relative flex flex-col items-center gap-6">
              <span className="eyebrow">
                <span className="h-px w-6 bg-accent" />
                {t.eyebrow}
                <span className="h-px w-6 bg-accent" />
              </span>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">
                <AccentTitle title={t.title} />
              </h2>
              <p className="max-w-lg text-base md:text-lg">{t.body}</p>
              <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
                <a href={`mailto:${profile.email}`} className="btn-accent group !px-6 !py-3.5">
                  <Mail size={16} />
                  {t.sayHello}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
                <CopyEmail
                  email={profile.email}
                  locale={locale}
                  className="rounded-full border border-line bg-bg/60 px-5 py-3.5 backdrop-blur"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ label, value, href, Icon, external }, i) => (
            <Reveal key={href} direction="up" delay={i * 70}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="card group flex items-center gap-4 p-5 transition-colors hover:border-line-strong"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-body transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow !text-[10px]">{label}</p>
                  <p dir="ltr" className="truncate text-sm font-medium !text-fg rtl:text-end">
                    {value}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
