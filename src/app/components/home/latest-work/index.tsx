"use client";

import { projects } from "@/data/content";
import { format, getDictionary, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import { AccentTitle } from "../../shared/rich-text";
import SectionHeading from "../../shared/section-heading";

const INITIAL_COUNT = 6;
const ALL = "all";

const categoryKey = (slug: string) => slug.toLowerCase();

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

const LatestWork = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).work;

  const categoryLabel = (key: string) =>
    key === ALL ? t.all : t.categories[key] ?? key.charAt(0).toUpperCase() + key.slice(1);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(projects.map((p) => categoryKey(p.slug))))], []);

  const [filter, setFilter] = useState(ALL);
  const [expanded, setExpanded] = useState(false);

  const filtered = filter === ALL ? projects : projects.filter((p) => categoryKey(p.slug) === filter);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

  const countFor = (cat: string) =>
    cat === ALL ? projects.length : projects.filter((p) => categoryKey(p.slug) === cat).length;

  return (
    <section id="work" className="relative border-t border-line bg-surface/40">
      <div className="container py-24 md:py-32">
        <SectionHeading eyebrow={t.eyebrow} title={<AccentTitle title={t.title} />} description={t.description} />

        <Reveal direction="up">
          <div role="tablist" aria-label={t.filterLabel} className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                onClick={() => {
                  setFilter(cat);
                  setExpanded(false);
                }}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                  filter === cat
                    ? "border-fg bg-fg text-bg"
                    : "border-line bg-surface text-body hover:border-line-strong hover:text-fg"
                }`}
              >
                {categoryLabel(cat)}
                <span className={`font-mono text-xs ${filter === cat ? "opacity-60" : "text-muted"}`}>
                  {countFor(cat)}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <Reveal key={`${filter}-${item.title}`} direction="up" delay={(index % 3) * 80}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-2 p-1.5 transition-colors duration-300 group-hover:border-line-strong">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-surface">
                    <Image
                      src={getImgPath(item.image)}
                      alt={`${item.title} ${t.preview}`}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute end-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 px-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-accent">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-muted">{hostOf(item.href)}</p>
                  </div>
                  <span className="chip shrink-0">{categoryLabel(categoryKey(item.slug))}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {filtered.length > INITIAL_COUNT && (
          <div className="mt-14 flex justify-center">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost group">
              {expanded ? t.showLess : format(t.showAll, { count: filtered.length })}
              <ArrowDown
                size={16}
                className={`transition-transform duration-300 ${expanded ? "rotate-180" : "group-hover:translate-y-0.5"}`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestWork;
