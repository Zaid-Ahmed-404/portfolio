"use client";
import { getDataPath, getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "../../../shared/reveal";

const ContactBar = () => {
  const [contactBarData, setContactBarData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath("/data/page-data.json"));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setContactBarData(data?.contactBar);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <div className="border-y border-line">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 py-5 sm:flex-row md:py-6">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-8">
              {contactBarData?.contactItems?.map((value: any, index: number) => (
                <Reveal key={index} direction="up" delay={index * 80}>
                  <Link
                    href={value?.link || "#"}
                    className="group flex items-center gap-2.5 rounded-full px-2 py-1.5 text-sm transition-colors duration-300 hover:text-primary md:text-base"
                  >
                    <Image
                      src={getImgPath(value?.icon)}
                      alt={value?.type}
                      width={18}
                      height={18}
                      className="min-h-[18px] min-w-[18px] opacity-70 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"
                    />
                    <span className="font-medium text-ink/80 group-hover:text-primary">
                      {value?.label}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              {contactBarData?.socialItems?.map((value: any, index: number) => (
                <Reveal key={index} direction="up" delay={index * 80}>
                  <Link
                    href={value?.link || "#!"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-ink"
                  >
                    <Image
                      src={getImgPath(value?.icon)}
                      alt={value?.platform}
                      width={16}
                      height={16}
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBar;
