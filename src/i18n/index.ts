import type { Locale } from "./config";
import { ar } from "./dictionaries/ar";
import { en, type Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Replaces `{name}` placeholders, e.g. format("Show all {count}", { count: 3 }). */
export const format = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));

export type { Dictionary };
export * from "./config";
