import { Amiri, Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Instrument_Serif } from "next/font/google";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Arabic fallbacks: the Latin fonts have no Arabic glyphs, so the browser
// picks these up per character (see the font stacks in globals.css).
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const fontVariables = [geist, geistMono, instrumentSerif, plexArabic, amiri]
  .map((f) => f.variable)
  .join(" ");
