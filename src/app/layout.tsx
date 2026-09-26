import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Providers from "./components/providers";

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

export const metadata: Metadata = {
  title: "Zaid Ahmed — Full-Stack Software Engineer",
  description:
    "Portfolio of Zaid Ahmed, a Full-Stack Software Engineer specializing in Spring Boot, Laravel, and Flutter — building scalable, production-grade applications for international clients.",
  authors: [{ name: "Zaid Ahmed" }],
  keywords: ["Zaid Ahmed", "Software Engineer", "Full-Stack", "Spring Boot", "Laravel", "Flutter", "Saudi Arabia"],
  openGraph: {
    title: "Zaid Ahmed — Full-Stack Software Engineer",
    description:
      "Building scalable backends and polished mobile apps with Spring Boot, Laravel, and Flutter.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
