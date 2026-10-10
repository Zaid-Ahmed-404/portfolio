import type { Locale } from "@/i18n";
import WorldLayer from "./fx/world-layer";
import AboutMe from "./home/about-me";
import Certificates from "./home/certificates";
import Contact from "./home/contact";
import EducationSkills from "./home/education-skills";
import ExperienceSec from "./home/experience-sec";
import HeroSection from "./home/hero-section";
import LatestWork from "./home/latest-work";

const HomePage = ({ locale }: { locale: Locale }) => {
  return (
    <>
      <WorldLayer locale={locale} />
      <main className="relative z-10">
        <HeroSection locale={locale} />
        <AboutMe locale={locale} />
        <ExperienceSec locale={locale} />
        <EducationSkills locale={locale} />
        <LatestWork locale={locale} />
        <Certificates locale={locale} />
        <Contact locale={locale} />
      </main>
    </>
  );
};

export default HomePage;
