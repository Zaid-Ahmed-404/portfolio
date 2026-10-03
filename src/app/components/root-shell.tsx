import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { dirOf, getDictionary, localeHome, type Locale } from "@/i18n";
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
        "x-default": `${basePath}${localeHome("ar")}`,
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

const RootShell = ({ locale, children }: { locale: Locale; children: ReactNode }) => (
  <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
    <body className={fontVariables}>
      <Providers>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </Providers>
    </body>
  </html>
);

export default RootShell;
