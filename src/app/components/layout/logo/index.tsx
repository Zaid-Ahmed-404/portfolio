import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-95"
    >
      <Image
        src={getImgPath("/images/logo/logo-mark.png")}
        alt="Zaid Ahmed logo"
        width={34}
        height={34}
        className="rounded-md"
        priority
      />
      <span className="text-sm font-semibold tracking-tight text-ink leading-none hidden xs:block">
        Zaid Ahmed
      </span>
    </Link>
  );
};

export default Logo;
