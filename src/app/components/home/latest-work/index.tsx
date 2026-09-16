"use client";
import { getDataPath, getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "../../shared/reveal";
import SectionHeading from "../../shared/section-heading";

interface WorkItem {
  title: string;
  slug: string;
  image: string;
  href: string;
}

const LatestWork = () => {
  const [workData, setWorkData] = useState<WorkItem[]>([]);

  const formatCategory = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath("/data/work-data.json"));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setWorkData(data?.workData || []);
      } catch (error) {
        console.error("Error fetching work data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="work" className="bg-surface">
      <div className="container py-16 md:py-28">
        <SectionHeading
          index="05"
          title="Latest Work"
          note={`${String(workData.length).padStart(2, "0")} selected projects`}
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {workData.map((item, index) => (
            <Reveal
              key={index}
              direction="up"
              delay={index * 90}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src={getImgPath(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
                >
                  <div className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-primary shadow-lg transition-transform duration-300 group-hover:scale-100">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted">
                  {formatCategory(item.slug)}
                </span>

                <div className="flex w-full items-center justify-between">
                  <h5 className="transition-colors duration-300 group-hover:text-primary">
                    {item.title}
                  </h5>
                  <div className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <Image
                      src={getImgPath("/images/icon/right-arrow-icon.svg")}
                      alt=""
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestWork;
