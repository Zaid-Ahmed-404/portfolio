"use client";

import { projects } from "@/data/content";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "../../shared/icons";
import Reveal from "../../shared/reveal";
import SectionHeading from "../../shared/section-heading";

const INITIAL_COUNT = 6;

const categoryLabel = (slug: string) =>
  slug.toUpperCase() === "SAAS" ? "SaaS" : slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

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

const LatestWork = () => {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => categoryLabel(p.slug))));
    return ["All", ...unique];
  }, []);

  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const filtered = filter === "All" ? projects : projects.filter((p) => categoryLabel(p.slug) === filter);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

  const countFor = (cat: string) =>
    cat === "All" ? projects.length : projects.filter((p) => categoryLabel(p.slug) === cat).length;

  return (
    <section id="work" className="relative border-t border-line bg-surface/40">
      <div className="container py-24 md:py-32">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Products I&apos;ve helped <span className="serif-accent text-accent">bring to life.</span>
            </>
          }
          description="SaaS platforms, business websites and mobile apps — shipped to production and used by real customers."
        />

        <Reveal direction="up">
          <div role="tablist" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
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
                {cat}
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
                      alt={`${item.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute right-3 top-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={18} />
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
                  <span className="chip shrink-0">{categoryLabel(item.slug)}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {filtered.length > INITIAL_COUNT && (
          <div className="mt-14 flex justify-center">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost group">
              {expanded ? "Show less" : `Show all ${filtered.length} projects`}
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
