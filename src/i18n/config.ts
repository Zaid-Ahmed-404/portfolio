import { getImgPath } from "@/utils/image";

export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Home path of a locale — the default locale lives at the site root. */
export const localeHome = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}/`);

/** Same as localeHome, but prefixed with the basePath for plain <a> tags. */
export const localeHref = (locale: Locale) => getImgPath(localeHome(locale));

export const otherLocale = (locale: Locale): Locale => (locale === "ar" ? "en" : "ar");
