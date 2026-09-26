"use client";

import { navLinks, profile } from "@/data/content";
import { getImgPath } from "@/utils/image";
import { useEffect, useState } from "react";
import { Download } from "../../shared/icons";
import ThemeToggle from "../../shared/theme-toggle";
import Logo from "../logo";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-[72rem] items-center justify-between rounded-full border py-2 pl-4 pr-2 transition-all duration-500 sm:pl-5 ${
          scrolled || menuOpen
            ? "border-line bg-bg/75 shadow-card backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  active === link.href ? "bg-surface-2 text-fg" : "text-body hover:text-fg"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href={getImgPath(profile.resume)}
            download
            className="btn-primary hidden !py-2 !px-4 sm:inline-flex"
          >
            <Download size={15} />
            Resume
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full hover:bg-surface-2 lg:hidden"
          >
            <span className={`block h-px w-5 bg-fg transition-all duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-fg transition-all duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <div
        className={`mx-auto mt-2 max-w-[72rem] overflow-hidden rounded-3xl border border-line bg-bg/95 shadow-card backdrop-blur-xl transition-all duration-500 lg:hidden ${
          menuOpen ? "max-h-[28rem] opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
      >
        <ul className="flex flex-col p-3">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-fg transition-colors hover:bg-surface-2"
              >
                {link.label}
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </a>
            </li>
          ))}
          <li className="px-1 pt-2 sm:hidden">
            <a href={getImgPath(profile.resume)} download className="btn-accent w-full">
              <Download size={15} />
              Download resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
