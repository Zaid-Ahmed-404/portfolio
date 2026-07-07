import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <>
      <Link href="/" className="inline-block transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
        <Image
          src={getImgPath("/images/logo/logo.png")}
          alt="logo"
          width={100}
          height={100}
        />
      </Link>
    </>
  );
};

export default Logo;
