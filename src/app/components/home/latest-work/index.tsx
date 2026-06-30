"use client";
import { getDataPath, getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <section className="bg-softGray py-16 xl:py-32">
      <div className="container">
        <div className="flex items-end justify-between gap-4 border-b border-neutral-300 pb-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Works</h2>
          <span className="text-lg font-medium text-orange-500">
            {String(workData.length).padStart(2, '0')} Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {workData.map((item, index) => (
            <div key={index} className="group flex flex-col gap-4">
              {/* Image Card */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
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
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-3 items-start">
                {/* Category Tag */}
                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                  {formatCategory(item.slug)}
                </span>

                <div className="flex w-full items-center justify-between">
                  <h5 className="text-xl font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h5>
                  <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      src={getImgPath("/images/icon/right-arrow-icon.svg")}
                      alt="Open project"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestWork;