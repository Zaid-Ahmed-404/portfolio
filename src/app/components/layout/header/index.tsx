"use client";

import { getDataPath } from "@/utils/image";
import { useEffect, useState } from "react";
import Logo from "../logo";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = getDataPath("/data/Zaid_Ahmed_Software_Engineer.pdf");
    link.download = "Zaid_Ahmed_Software_Engineer.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header
      className={`navbar fixed top-0 left-0 z-999 w-full transition-all duration-500 border-b ${scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-md border-line"
          : "bg-transparent border-transparent"
        }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "py-4" : "py-6"
            }`}
        >
          <Logo />

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="group btn-swipe hidden sm:inline-flex cursor-pointer items-center py-2.5 px-5 border border-ink rounded-full"
            >
              <span className="text-sm font-medium text-ink group-hover:text-white transition-colors duration-300">
                Resume
              </span>
            </button>

            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden relative z-10 w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
            >
              <span
                className={`block h-px w-6 bg-ink transition-all duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""
                  }`}
              />
              <span
                className={`block h-px w-6 bg-ink transition-all duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
              />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`lg:hidden overflow-hidden bg-white transition-all duration-400 ease-out ${menuOpen ? "max-h-96 border-t border-line" : "max-h-0"
          }`}
      >
        <div className="container flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-base font-medium text-ink/80 hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleDownloadPDF}
            className="mt-2 sm:hidden w-full text-center py-3 rounded-full bg-primary text-white text-sm font-medium cursor-pointer"
          >
            Download Resume
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
