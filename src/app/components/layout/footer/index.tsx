"use client";
import { getDataPath } from "@/utils/image";
import { useEffect, useState } from "react";
import Reveal from "../../shared/reveal";
import Logo from "../logo";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
];

const Footer = () => {
  const [contactLinks, setContactLinks] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getDataPath("/data/page-data.json"));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setContactLinks(data?.contactLinks);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };
    fetchData();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-line">
      <div className="container py-16 md:py-20">
        <Reveal direction="up">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Logo />
              <p className="max-w-xs text-sm leading-relaxed">
                Full-Stack Software Engineer building scalable, production-grade
                applications with Flutter, Laravel, and Spring Boot.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-ink">Explore</p>
              <div className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="w-fit text-sm text-body transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-ink">Get in touch</p>
              <div className="flex flex-col gap-2.5">
                {contactLinks?.contactInfo?.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.link}
                    className="w-fit text-sm text-body transition-colors duration-300 hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-1">
                {contactLinks?.socialLinks?.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-body transition-colors duration-300 hover:text-primary"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {year} Zaid Ahmed. All rights reserved.
          </p>
          <p className="text-xs text-muted">Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
