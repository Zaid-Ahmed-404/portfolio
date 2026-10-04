import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Syne } from "next/font/google";

/** Display face for headings and large numerals. */
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  adjustFontFallback: false,
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
});

// Arabic glyphs: the Latin fonts above have none, so the browser falls through
// to this face per character (see the stacks in globals.css). The Latin fonts set
// adjustFontFallback: false because their generated fallback face is local(Arial),
// which DOES have Arabic glyphs and would otherwise win over Plex.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  adjustFontFallback: false,
});

export const fontVariables = [syne, geist, geistMono, plexArabic].map((f) => f.variable).join(" ");
