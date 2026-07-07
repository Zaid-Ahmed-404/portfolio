import Reveal from "../../shared/reveal";
import Logo from "../logo";

const Footer = () => {
  return (
    <footer className="py-6 sm:py-14 flex items-center justify-center">
      <div className="container">
        <Reveal direction="fade" className="flex flex-col gap-1.5 items-center sm:items-start">
          <div className="relative flex items-center w-full">
            <div className="flex-grow h-px bg-black transition-colors duration-300" />
            <div className="mx-4">
              <Logo />
            </div>
            <div className="flex-grow h-px bg-black transition-colors duration-300" />
          </div>

        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
