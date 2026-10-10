"use client";

import { projects } from "@/data/content";
import { getDictionary, type Locale } from "@/i18n";
import { useDevice } from "@/lib/device";
import { gsap } from "@/lib/gsap";
import { workHoverStore } from "@/lib/store";
import { getImgPath } from "@/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import Reveal from "../../fx/reveal";
import SplitTitle from "../../fx/split-title";
import { ArrowUpRight } from "../../shared/icons";
import { useSceneGate } from "../../three/use-scene-gate";

const WorkDistortion = dynamic(() => import("../../three/work-distortion"), { ssr: false });

const ALL = "all";

const categoryKey = (slug: string) => slug.toLowerCase();
const pad = (n: number) => String(n).padStart(2, "0");

const hostOf = (href: string) => {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("play.google.com")) return "Google Play";
    if (host.includes("apps.apple.com")) return "App Store";
    return host;
  } catch {
    return "";
  }
};

/**
 * Selected work as an interactive index: large typographic rows with a
 * screenshot preview that follows the cursor (distorted by the WebGL overlay
 * when available). Touch / small screens get inline thumbnails instead.
 */
const LatestWork = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale);
  const t = dict.work;

  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  const device = useDevice();
  const { mount, active } = useSceneGate(sectionRef, { tiers: ["high"] });
  // The floating preview needs a hovering mouse; the shader on top needs WebGL too.
  const floating = !!device && !device.coarse;
  const distortion = floating && mount && !device.reducedMotion;

  const [filter, setFilter] = useState(ALL);
  const [current, setCurrent] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());

  const categoryLabel = (key: string) => (key === ALL ? t.all : (t.categories[key] ?? key));
  const categories = useMemo(() => [ALL, ...Array.from(new Set(projects.map((p) => categoryKey(p.slug))))], []);
  const countFor = (cat: string) =>
    cat === ALL ? projects.length : projects.filter((p) => categoryKey(p.slug) === cat).length;
  const filtered = filter === ALL ? projects : projects.filter((p) => categoryKey(p.slug) === filter);

  // Cursor-following preview (lags slightly behind the pointer). It sits beside the
  // cursor, towards the inline end, so it never covers the row being pointed at.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || !floating) return;
    const duration = device?.reducedMotion ? 0 : 0.55;
    const rtl = document.documentElement.dir === "rtl";
    gsap.set(el, { xPercent: rtl ? -112 : 12, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    move.current = {
      x: gsap.quickTo(el, "x", { duration, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration, ease: "power3" }),
    };
    return () => {
      move.current = null;
    };
  }, [floating, device?.reducedMotion]);

  // Hand the preview frame to the WebGL overlay while a row is active.
  useEffect(() => {
    const project = projects.find((p) => p.title === current);
    if (!distortion || !project || !frameRef.current) {
      workHoverStore.set({ el: null });
      return;
    }
    workHoverStore.set({ el: frameRef.current, src: getImgPath(project.image), mouse: [0.5, 0.5] });
  }, [current, distortion]);

  useEffect(() => () => workHoverStore.set({ el: null }), []);

  const activate = (title: string) => {
    setCurrent(title);
    setLoaded((prev) => (prev.has(title) ? prev : new Set(prev).add(title)));
  };

  const onRowEnter = (title: string) => (e: PointerEvent<HTMLAnchorElement>) => {
    if (!floating || e.pointerType !== "mouse") return;
    move.current?.x(e.clientX);
    move.current?.y(e.clientY);
    activate(title);
  };

  const onRowMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    move.current?.x(e.clientX);
    move.current?.y(e.clientY);
  };

  // Keyboard: show the preview beside the focused row.
  const onRowFocus = (title: string) => (e: FocusEvent<HTMLAnchorElement>) => {
    if (!floating || !e.currentTarget.matches(":focus-visible")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    move.current?.x(rtl ? r.left + r.width * 0.45 : r.right - r.width * 0.45);
    move.current?.y(r.top + r.height / 2);
    activate(title);
  };

  const selectFilter = (cat: string) => {
    setCurrent(null);
    setFilter(cat);
  };

  return (
    <section ref={sectionRef} id="work" className="relative border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(50%_60%_at_50%_0%,rgba(var(--accent-rgb),0.08),transparent)]" />

      <div className="container relative py-28 md:py-44">
        {/* Heading + filters */}
        <div className="relative mb-14 flex flex-col gap-8 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <span aria-hidden className="outline-num pointer-events-none absolute -top-6 end-0 text-[clamp(6rem,17vw,14rem)] md:-top-14">
            04
          </span>
          <div className="relative flex max-w-2xl flex-col gap-5">
            <Reveal>
              <span className="eyebrow">
                <span dir="ltr" className="text-accent-bright">04</span>
                <span className="h-px w-8 bg-accent/60" />
                {t.eyebrow}
              </span>
            </Reveal>
            <SplitTitle title={t.title} className="text-[clamp(2.3rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em]" />
            <Reveal delay={120}>
              <p className="max-w-xl text-base leading-relaxed md:text-lg">{t.description}</p>
            </Reveal>
          </div>

          <Reveal delay={160} className="relative">
            <div role="tablist" aria-label={t.filterLabel} className="glass flex w-fit flex-wrap gap-1 !rounded-full p-1">
              {categories.map((cat) => {
                const selected = filter === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={selected}
                    aria-controls="work-index"
                    onClick={() => selectFilter(cat)}
                    className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                      selected ? "text-ink" : "text-body hover:text-fg"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="work-filter-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{categoryLabel(cat)}</span>
                    <span dir="ltr" className={`relative font-mono text-xs ${selected ? "opacity-70" : "text-muted"}`}>
                      {countFor(cat)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* The index */}
        <ol
          id="work-index"
          onPointerLeave={() => setCurrent(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setCurrent(null);
          }}
          className="border-t border-line"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((item, index) => {
              const src = getImgPath(item.image);
              const isCurrent = current === item.title;
              return (
                <motion.li
                  key={item.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(index, 8) * 0.03 }}
                  className="border-b border-line"
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="view"
                    data-cursor-label={dict.fx.view}
                    onPointerEnter={onRowEnter(item.title)}
                    onPointerMove={onRowMove}
                    onFocus={onRowFocus(item.title)}
                    className={`group relative grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-5 transition-opacity duration-500 sm:grid-cols-[7rem_1fr_auto] sm:gap-6 lg:grid-cols-[3rem_10rem_1fr_auto_auto_2rem] lg:gap-8 lg:py-6 ${
                      current && !isCurrent ? "lg:opacity-35" : "opacity-100"
                    }`}
                  >
                    {/* Accent line sweeping in from the start edge */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-px start-0 h-px w-full bg-accent shadow-[0_0_12px_var(--accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-visible:scale-x-100 ltr:origin-left rtl:origin-right ${
                        isCurrent ? "scale-x-100" : "scale-x-0"
                      }`}
                    />

                    <span dir="ltr" className="hidden font-mono text-sm text-muted transition-colors duration-300 group-hover:text-accent-bright lg:block">
                      {pad(index + 1)}
                    </span>

                    {/* Project screenshot */}
                    <span
                      className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-bg-elevated transition-[border-color,box-shadow] duration-500 lg:aspect-[16/10] ${
                        isCurrent ? "border-accent/60 shadow-[0_12px_40px_-12px_rgba(var(--accent-rgb),0.6)]" : "border-line"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export; pre-optimized WebP */}
                      <img
                        src={src}
                        alt={`${item.title} ${t.preview}`}
                        width={1280}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isCurrent ? "scale-110" : "scale-100"
                        } group-hover:scale-110`}
                      />
                    </span>

                    <span className="flex min-w-0 flex-col gap-1.5">
                      <span
                        className={`truncate font-display text-xl font-bold leading-tight tracking-[-0.03em] transition-[color,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-2xl lg:text-[clamp(2rem,3.6vw,3.25rem)] ${
                          isCurrent ? "text-accent-bright lg:translate-x-4 rtl:lg:-translate-x-4" : "text-fg"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span dir="ltr" className="font-mono text-[11px] text-muted lg:hidden rtl:text-end">
                        {pad(index + 1)} · {hostOf(item.href)} · {categoryLabel(categoryKey(item.slug))}
                      </span>
                    </span>

                    <span dir="ltr" className="hidden font-mono text-xs text-muted lg:block">
                      {hostOf(item.href)}
                    </span>
                    <span className="chip hidden shrink-0 lg:inline-flex">{categoryLabel(categoryKey(item.slug))}</span>

                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 lg:h-8 lg:w-8 lg:border-0 ${
                        isCurrent ? "border-accent bg-accent text-ink lg:bg-transparent lg:text-accent-bright" : "border-line text-muted"
                      }`}
                    >
                      <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>

      {/* Floating preview (desktop, fine pointer). Images mount on first hover only. */}
      {floating && (
        <div
          ref={previewRef}
          aria-hidden
          className={`no-print pointer-events-none fixed left-0 top-0 z-30 hidden w-[min(26rem,30vw)] transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
            current ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <div className="rounded-[1.4rem] border border-line bg-bg/60 p-1.5 shadow-[0_40px_100px_-30px_rgba(var(--accent-rgb),0.55)] backdrop-blur-md">
            <div ref={frameRef} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-bg-elevated">
              {projects
                .filter((p) => loaded.has(p.title))
                .map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element -- static export; pre-optimized WebP
                  <img
                    key={p.title}
                    src={getImgPath(p.image)}
                    alt=""
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,scale] duration-500 ${
                      current === p.title ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    }`}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {distortion && device && <WorkDistortion device={device} active={active} />}
    </section>
  );
};

export default LatestWork;
