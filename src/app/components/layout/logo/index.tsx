import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" aria-label="Zaid Ahmed — home" className="group inline-flex items-center gap-2.5">
      <Image
        src={getImgPath("/images/logo/logo-mark.png")}
        alt=""
        width={30}
        height={30}
        className="rounded-lg transition-transform duration-500 group-hover:rotate-[8deg]"
        priority
      />
      <span className="hidden text-sm font-semibold tracking-tight text-fg xs:block">
        Zaid Ahmed
      </span>
    </Link>
  );
};

export default Logo;
