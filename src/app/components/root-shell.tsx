import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { defaultLocale, dirOf, getDictionary, localeHome, type Locale } from "@/i18n";
import { fontVariables } from "../fonts";
import "../globals.css";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Providers from "./providers";

const siteUrl = "https://zaid-ahmed-404.github.io";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const buildMetadata = (locale: Locale): Metadata => {
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    authors: [{ name: "Zaid Ahmed" }],
    keywords: t.keywords,
    alternates: {
      canonical: `${basePath}${localeHome(locale)}`,
      languages: {
        ar: `${basePath}${localeHome("ar")}`,
        en: `${basePath}${localeHome("en")}`,
        "x-default": `${basePath}${localeHome(defaultLocale)}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.ogDescription,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
  };
};

export const viewport: Viewport = {
  themeColor: "#f5f2ec",
  colorScheme: "light",
};

/**
 * Runs before paint: marks JS as available (enables the reveal/loader states in
 * globals.css) and, as a safety net, reveals everything if the app never hydrates.
 */
const bootScript =
  'document.documentElement.classList.add("js");setTimeout(function(){document.documentElement.classList.add("is-ready")},4000);';

const RootShell = ({ locale, children }: { locale: Locale; children: ReactNode }) => (
  <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
    </head>
    <body className={fontVariables}>
      <Providers locale={locale}>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </Providers>
      <div aria-hidden className="grain" />
    </body>
  </html>
);

export default RootShell;
