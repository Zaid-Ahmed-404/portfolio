"use client";

import { profile } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Magnetic from "../../fx/magnetic";
import Reveal from "../../fx/reveal";
import SplitTitle from "../../fx/split-title";
import CopyEmail from "../../shared/copy-email";
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "../../shared/icons";
import { useSceneGate } from "../../three/use-scene-gate";

const ContactScene = dynamic(() => import("../../three/contact-scene"), { ssr: false });

const Contact = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.contact;
  const sectionRef = useRef<HTMLElement>(null);
  const { device, mount, active } = useSceneGate(sectionRef);

  const channels = [
    { label: t.channels.email, value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
    { label: t.channels.phone, value: profile.phone, href: profile.phoneHref, Icon: Phone },
    { label: t.channels.linkedin, value: "in/zaid-ahmed", href: profile.linkedin, Icon: Linkedin, external: true },
    { label: t.channels.github, value: "Zaid-Ahmed-404", href: profile.github, Icon: Github, external: true },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden border-t border-line">
      {/* Background: a quieter echo of the hero's system */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [--fx:50%] [--fy:42%]">
        <div className="scene-fallback absolute inset-0" />
        {mount && device && (
          <div className="absolute inset-0 opacity-70">
            <ContactScene device={device} active={active} />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,11,0.35),rgba(10,10,11,0.95)_75%)]" />
      </div>

      <div className="container relative flex min-h-svh flex-col justify-center py-28 md:py-36">
        <div className="relative flex flex-col items-center gap-8 text-center">
          <span aria-hidden dir="ltr" className="outline-num pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 text-[clamp(8rem,24vw,20rem)] opacity-60">
            06
          </span>
          <Reveal>
            <span className="eyebrow">
              <span dir="ltr" className="text-accent-bright">06</span>
              <span className="h-px w-8 bg-accent/60" />
              {t.eyebrow}
            </span>
          </Reveal>

          <SplitTitle
            title={t.title}
            className="max-w-5xl text-[clamp(2.75rem,7.5vw,7rem)] font-bold leading-[1] tracking-[-0.045em]"
          />

          <Reveal delay={120}>
            <p className="max-w-lg text-base md:text-lg">{t.body}</p>
          </Reveal>

          <Reveal delay={200} className="flex flex-col items-center gap-8 pt-4">
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${profile.email}`}
                className="group relative flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-full bg-accent text-[#0a0a0b] shadow-[0_20px_80px_-20px_rgba(var(--accent-rgb),0.8)] transition-[box-shadow,transform] duration-500 hover:shadow-[0_24px_110px_-16px_rgba(var(--accent-rgb),1)] md:h-48 md:w-48"
              >
                <span aria-hidden className="absolute inset-0 rounded-full border border-accent/60 motion-safe:animate-ping [animation-duration:2.6s]" />
                <Mail size={20} />
                <span className="font-display text-lg font-semibold">{t.sayHello}</span>
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                />
              </a>
            </Magnetic>
            <CopyEmail email={profile.email} locale={locale} className="glass !rounded-full px-5 py-3" />
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ label, value, href, Icon, external }, i) => (
            <Reveal as="li" key={href} delay={i * 70}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="glass group flex items-center gap-4 !rounded-2xl p-5 transition-colors duration-300 hover:border-accent/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-body transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow !text-[10px]">{label}</span>
                  <span dir="ltr" className="block truncate text-sm font-medium text-fg rtl:text-end">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:text-accent group-hover:opacity-100 rtl:-scale-x-100"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contact;
