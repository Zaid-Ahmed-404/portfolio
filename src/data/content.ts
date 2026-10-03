import type { Dictionary } from "@/i18n";
import pageData from "../../public/data/page-data.json";
import work from "../../public/data/work-data.json";

/*
 * Language-independent data (links, tech names, brand names).
 * Translatable copy lives in src/i18n/dictionaries.
 */

export const profile = {
  email: pageData.contactBar.contactItems.find((i) => i.type === "email")!.label,
  phone: pageData.contactBar.contactItems.find((i) => i.type === "phone")!.label,
  phoneHref: pageData.contactBar.contactItems.find((i) => i.type === "phone")!.link,
  linkedin: pageData.contactBar.socialItems.find((i) => i.platform === "linkedin")!.link,
  github: pageData.contactBar.socialItems.find((i) => i.platform === "github")!.link,
  resume: "/data/Zaid_Ahmed_Software_Engineer.pdf",
};

export const navLinks: { key: keyof Dictionary["nav"]; href: string }[] = [
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "skills", href: "#skills" },
  { key: "work", href: "#work" },
  { key: "contact", href: "#contact" },
];

export const stack = [
  "Java",
  "Spring Boot",
  "Laravel",
  "PHP",
  "Flutter",
  "Dart",
  "MySQL",
  "Firebase",
  "AWS",
  "Docker",
  "CI/CD",
  "REST APIs",
  "Microservices",
];

export type ExperienceId = keyof Dictionary["experience"]["items"];

export type Experience = {
  id: ExperienceId;
  company: string;
  url: string;
  current?: boolean;
  tech: string[];
};

export const experiences: Experience[] = [
  {
    id: "ams",
    company: "amsksa.com",
    url: "https://amsksa.com/",
    current: true,
    tech: ["Java", "Spring Boot", "Flutter", "AWS ECS/ECR", "Docker", "JUnit"],
  },
  {
    id: "riser",
    company: "riserapp.co.uk",
    url: "https://riserapp.co.uk/",
    tech: ["Laravel", "MySQL", "Gemini AI", "cPanel"],
  },
  {
    id: "meraki",
    company: "meraki-it.pk",
    url: "https://meraki-it.pk/",
    tech: ["Flutter", "Laravel", "Firebase", "Git"],
  },
  {
    id: "comsats",
    company: "COMSATS University",
    url: "https://islamabad.comsats.edu.pk/",
    tech: ["Laravel", "MySQL", "REST APIs"],
  },
];

export const currentExperience = experiences.find((e) => e.current) ?? experiences[0];

export const coreSkills = pageData.educationData.skills;

type ToolboxItem = string | { t: keyof Dictionary["skills"]["toolboxItems"] };

export const toolbox: { key: keyof Dictionary["skills"]["toolbox"]; items: ToolboxItem[] }[] = [
  {
    key: "backend",
    items: ["Spring Boot", "Spring Security", "JPA / Hibernate", "Laravel", "RESTful APIs", "Microservices", "JWT & RBAC"],
  },
  {
    key: "mobile",
    items: ["Flutter", "Dart", "Firebase"],
  },
  {
    key: "cloud",
    items: ["AWS ECS / ECR", "Docker", "CI/CD", "cPanel", "Hostinger", "Git"],
  },
  {
    key: "data",
    items: ["MySQL", "NoSQL", { t: "queryOptimization" }],
  },
  {
    key: "practices",
    items: ["Clean Architecture", "DDD", "TDD", "JUnit", "Mockito"],
  },
  {
    key: "integrations",
    items: [{ t: "zatca" }, "MyFatoorah", "Moyasar", "4Jawaly SMS", "Google Gemini AI"],
  },
];

/** `month` is 1-based and rendered with the locale's month names. */
export const certificates = [
  {
    title: "Software Architecture & Design of Modern Large Scale Systems",
    provider: "Udemy",
    month: 10,
    year: 2024,
    href: "https://www.udemy.com/certificate/UC-d5961a7f-bf3f-47a5-a925-8c1b9ed97e7a/",
  },
  {
    title: "Laravel — For Beginner to Advanced",
    provider: "Udemy",
    month: 5,
    year: 2025,
    href: "https://www.udemy.com/certificate/UC-788c57e1-099a-49fb-a6b1-2069f35c282f/",
  },
  {
    title: "RESTful API with Laravel: Build a Real API with Laravel",
    provider: "Udemy",
    month: 8,
    year: 2024,
    href: "https://www.udemy.com/certificate/UC-d5c7f060-3274-47b3-9bca-49c54fbfdd58/",
  },
  {
    title: "Flutter & Dart — The Complete Guide [2024 Edition]",
    provider: "Udemy",
    month: 8,
    year: 2023,
    href: "https://www.udemy.com/certificate/UC-9013d99f-d719-4e59-a2d3-05a542463a9e/",
  },
];

export type Project = {
  image: string;
  title: string;
  slug: string;
  href: string;
};

export const projects: Project[] = work.workData;
