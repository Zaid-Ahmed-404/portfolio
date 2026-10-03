import { getDictionary, localeHref, otherLocale, type Locale } from "@/i18n";

const LanguageSwitch = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).header;
  const target = otherLocale(locale);

  return (
    <a
      href={localeHref(target)}
      hrefLang={target}
      lang={target}
      aria-label={t.switchLanguage}
      title={t.switchLanguage}
      className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium text-body transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {t.languageLabel}
    </a>
  );
};

export default LanguageSwitch;
