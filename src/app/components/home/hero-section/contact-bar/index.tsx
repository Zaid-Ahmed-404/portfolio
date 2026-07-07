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
      <div className="border-t border-softGray">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 md:py-7">
            {/* Contact Items */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-5 lg:gap-11">
              {contactBarData?.contactItems?.map(
                (value: any, index: number) => (
                  <Reveal key={index} direction="up" delay={index * 80}>
                    <Link
                      onClick={(e) => e.preventDefault()}
                      href={"#!"}
                      className="group flex items-center gap-2 lg:gap-4 text-sm md:text-base"
                    >
                      <Image
                        src={getImgPath(value?.icon)}
                        alt={value?.type}
                        width={24}
                        height={24}
                        className="min-w-[24px] min-h-[24px] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                      />

                      <h6 className="text-sm md:text-base xl:text-xl transition-colors duration-300 group-hover:text-primary">
                        {value?.label}
                      </h6>
                    </Link>
                  </Reveal>
                )
              )}
            </div>

            {/* Social Items */}
            <div className="flex items-center justify-center md:justify-end gap-4 md:gap-2.5">
              {contactBarData?.socialItems?.map((value: any, index: number) => (
                <Reveal key={index} direction="up" delay={index * 80}>
                  <Link
                    // Remove the onClick handler to allow navigation
                    href={value?.link || "#!"} // Use the link from your data
                    target="_blank"            // Optional: Open in new tab
                    rel="noopener noreferrer"  // Recommended for security with target="_blank"
                    className="inline-block transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95"
                  >
                    <Image
                      src={getImgPath(value?.icon)}
                      alt={value?.platform}
                      width={30}
                      height={30}
                      className="transition-opacity duration-300 hover:opacity-80"
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
