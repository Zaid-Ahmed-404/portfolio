import { getDictionary, localeHome, type Locale } from "@/i18n";
import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale);

  return (
    <Link href={localeHome(locale)} aria-label={t.header.home} className="group inline-flex items-center gap-2.5">
      <Image
        src={getImgPath("/images/logo/logo-mark.png")}
        alt=""
        width={30}
        height={30}
        className="rounded-lg transition-transform duration-500 group-hover:rotate-[8deg]"
        priority
      />
      <span className="hidden text-sm font-semibold tracking-tight text-fg xs:block">
        {t.profile.name}
      </span>
    </Link>
  );
};

export default Logo;
