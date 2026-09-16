"use client";
import { getDataPath, getImgPath } from "@/utils/image";
import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "../../shared/reveal";
import SectionHeading from "../../shared/section-heading";

const EducationSkills = () => {
  const [educationData, setEductionData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath("/data/page-data.json"));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEductionData(data?.educationData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="skills" className="bg-surface">
      <div className="container py-16 md:py-28">
        <SectionHeading index="03" title="Education & Skills" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-4">
            {educationData?.education?.map((value: any, index: any) => (
              <Reveal
                key={index}
                direction="left"
                delay={index * 120}
                className="group relative flex flex-col gap-2 rounded-2xl border border-line bg-white p-6"
              >
                <h5 className="transition-colors duration-300 group-hover:text-primary">
                  {value?.title}
                </h5>
                <p className="text-sm leading-relaxed">{value?.description}</p>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 xs:grid-cols-3 lg:col-span-8 lg:gap-5">
            {educationData?.skills?.map((value: any, index: any) => (
              <Reveal
                key={index}
                direction="scale"
                delay={index * 80}
                className="group flex flex-col items-center justify-between gap-5 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg xl:p-6"
              >
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={getImgPath(value?.icon)}
                    alt={value?.name}
                    width={56}
                    height={56}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-sm font-medium text-ink">{value?.name}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="8" height="8" viewBox="0 0 9 9" fill="none">
                      <rect
                        width="9"
                        height="9"
                        rx="4.5"
                        fill={i < value?.rating ? "#FE4300" : "#E7E5E1"}
                      />
                    </svg>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;
