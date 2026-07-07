import { getImgPath } from "@/utils/image";
import Image from "next/image";
import Reveal from "../../shared/reveal";

const index = () => {
  return (
    <section className="relative hero-section overflow-hidden pt-35 md:pt-40 pb-12 lg:pb-30 xl:pt-52">
      <div className="container">
        <div className="lg:flex grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-4 items-center">
          <div className="flex flex-col gap-4 md:gap-7 max-w-2xl">
            <div>
              <Reveal direction="up">
                <div className="flex items-center gap-8">
                  <h1>I'm Zaid Ahmed</h1>
                  <div className="wave transition-transform duration-300 hover:scale-110">
                    <Image
                      src={getImgPath("/images/home/banner/wave-icon.svg")}
                      alt="wave-icon"
                      width={62}
                      height={62}
                      className=""
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal direction="up" delay={120}>
                <h1>Software Engineer</h1>
              </Reveal>
            </div>
            <Reveal direction="up" delay={240}>
              <p className="text-secondary font-normal max-w-md xl:max-w-xl">
                Specializing in Flutter and Laravel with a focus on scalable architectures, RESTful APIs, and cloud deployments. Delivering production-grade applications for international clients.
              </p>
            </Reveal>
          </div>
          <Reveal direction="scale" delay={180} className="block lg:hidden">
            <Image
              src={getImgPath("/images/home/banner/banner-img.png")}
              alt="banner-img"
              width={685}
              height={650}
            />
          </Reveal>
        </div>
      </div>
      <Reveal
        direction="right"
        delay={200}
        className="absolute right-0 top-0 hidden h-auto w-1/2 lg:block 2xl:h-171.5 2xl:w-187.5"
      >
        <Image
          src={getImgPath("/images/home/banner/banner-img.png")}
          alt="banner-img"
          width={685}
          height={650}
          className="absolute right-0 top-0 z-1 transition-transform duration-700 ease-out hover:scale-[1.02]"
        />
      </Reveal>
    </section>
  );
};

export default index;
