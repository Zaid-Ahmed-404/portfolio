import pageData from "../../public/data/page-data.json";
import work from "../../public/data/work-data.json";

export const profile = {
  name: "Zaid Ahmed",
  role: "Full-Stack Software Engineer",
  location: "Saudi Arabia",
  email: pageData.contactBar.contactItems.find((i) => i.type === "email")!.label,
  phone: pageData.contactBar.contactItems.find((i) => i.type === "phone")!.label,
  phoneHref: pageData.contactBar.contactItems.find((i) => i.type === "phone")!.link,
  linkedin: pageData.contactBar.socialItems.find((i) => i.platform === "linkedin")!.link,
  github: pageData.contactBar.socialItems.find((i) => i.platform === "github")!.link,
  resume: "/data/Zaid_Ahmed_Software_Engineer.pdf",
  languages: ["English", "Arabic", "Urdu"],
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: "4+", label: "Years of experience" },
  { value: "20+", label: "Happy clients" },
  { value: "30+", label: "Projects delivered" },
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

export type Experience = {
  period: string;
  title: string;
  company: string;
  url: string;
  type: string;
  current?: boolean;
  highlights: string[];
  tech: string[];
};

export const experiences: Experience[] = [
  {
    period: "2025 — Present",
    title: "Full-Stack Software Engineer",
    company: "amsksa.com",
    url: "https://amsksa.com/",
    type: "Full-time",
    current: true,
    highlights: [
      "Architected and deployed high-performance enterprise applications utilizing Java and Spring Boot microservices alongside Flutter backends on AWS, consistently achieving a 5% increase in system uptime.",
      "Engineered localized backend microservices in Spring Boot, integrating ZATCA e-invoicing compliance APIs, regional payment gateways (MyFatoorah, Moyasar), and 4Jawaly SMS services to strictly align with regional regulatory standards.",
      "Implemented robust security standards using Spring Security, JWT, and RBAC, alongside Spring Data JPA/Hibernate for optimized database transactions and query execution.",
      "Spearheaded automated CI/CD pipelines for containerized Spring Boot applications using Docker and AWS ECS/ECR, increasing deployment frequency by 10% and streamlining engineering workflows.",
      "Leveraged Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD) using JUnit and Mockito to restructure complex codebases and ensure zero-downtime releases.",
    ],
    tech: ["Java", "Spring Boot", "Flutter", "AWS ECS/ECR", "Docker", "JUnit"],
  },
  {
    period: "2024",
    title: "Backend Engineer",
    company: "riserapp.co.uk",
    url: "https://riserapp.co.uk/",
    type: "Remote",
    highlights: [
      "Maintain and scale Laravel-based RESTful APIs for a high-traffic video hiring platform supporting over 5,000 active users.",
      "Optimize MySQL database performance and manage production deployments via cPanel, ensuring a 5% improvement in data retrieval speed.",
      "Develop AI-driven features leveraging Google Gemini AI to enhance platform matchmaking and user experience.",
    ],
    tech: ["Laravel", "MySQL", "Gemini AI", "cPanel"],
  },
  {
    period: "2023 — 2024",
    title: "Software Engineer",
    company: "meraki-it.pk",
    url: "https://meraki-it.pk/",
    type: "Full-time",
    highlights: [
      "Developed and maintained systems for 7+ commercial projects using Flutter/Laravel, integrating Firebase and NoSQL databases to enhance performance.",
      "Leveraged Laravel MVC architecture and Git-based workflows to deliver maintainable and scalable RESTful APIs.",
      "Collaborated closely with front-end teams to ensure smooth integration and delivery of features.",
    ],
    tech: ["Flutter", "Laravel", "Firebase", "Git"],
  },
  {
    period: "2022 — 2023",
    title: "Backend Engineer",
    company: "COMSATS University",
    url: "https://islamabad.comsats.edu.pk/",
    type: "Full-time",
    highlights: [
      "Designed and built a conference management system serving 5000+ users across 10+ countries, managing registrations, paper submissions, and scheduling.",
      "Architected Laravel REST APIs with MySQL backends, focusing on scalability and modular structure.",
    ],
    tech: ["Laravel", "MySQL", "REST APIs"],
  },
];

export const education = pageData.educationData.education;

export const coreSkills = pageData.educationData.skills;

export const toolbox = [
  {
    title: "Backend",
    items: ["Spring Boot", "Spring Security", "JPA / Hibernate", "Laravel", "RESTful APIs", "Microservices", "JWT & RBAC"],
  },
  {
    title: "Mobile",
    items: ["Flutter", "Dart", "Firebase"],
  },
  {
    title: "Cloud & DevOps",
    items: ["AWS ECS / ECR", "Docker", "CI/CD", "cPanel", "Hostinger", "Git"],
  },
  {
    title: "Data",
    items: ["MySQL", "NoSQL", "Query optimization"],
  },
  {
    title: "Practices",
    items: ["Clean Architecture", "DDD", "TDD", "JUnit", "Mockito"],
  },
  {
    title: "Integrations",
    items: ["ZATCA e-invoicing", "MyFatoorah", "Moyasar", "4Jawaly SMS", "Google Gemini AI"],
  },
];

export const certificates = [
  {
    title: "Software Architecture & Design of Modern Large Scale Systems",
    provider: "Udemy",
    date: "Oct 2024",
    href: "https://www.udemy.com/certificate/UC-d5961a7f-bf3f-47a5-a925-8c1b9ed97e7a/",
  },
  {
    title: "Laravel — For Beginner to Advanced",
    provider: "Udemy",
    date: "May 2025",
    href: "https://www.udemy.com/certificate/UC-788c57e1-099a-49fb-a6b1-2069f35c282f/",
  },
  {
    title: "RESTful API with Laravel: Build a Real API with Laravel",
    provider: "Udemy",
    date: "Aug 2024",
    href: "https://www.udemy.com/certificate/UC-d5c7f060-3274-47b3-9bca-49c54fbfdd58/",
  },
  {
    title: "Flutter & Dart — The Complete Guide [2024 Edition]",
    provider: "Udemy",
    date: "Aug 2023",
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
