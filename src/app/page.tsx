import AboutMe from "./components/home/about-me";
import Certificates from "./components/home/certificates";
import Contact from "./components/home/contact";
import EducationSkills from "./components/home/education-skills";
import ExperienceSec from "./components/home/experience-sec";
import HeroSection from "./components/home/hero-section";
import LatestWork from "./components/home/latest-work";

const page = () => {
  return (
    <main>
      <HeroSection />
      <AboutMe />
      <ExperienceSec />
      <EducationSkills />
      <LatestWork />
      <Certificates />
      <Contact />
    </main>
  );
};

export default page;
