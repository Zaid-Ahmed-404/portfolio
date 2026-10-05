/**
 * English dictionary. Its shape is the source of truth for every other locale
 * (see `Dictionary` below). `**text**` inside a string is rendered highlighted.
 */
export const en = {
  meta: {
    title: "Zaid Ahmed — Full-Stack Software Engineer",
    description:
      "Portfolio of Zaid Ahmed, a Full-Stack Software Engineer specializing in Spring Boot, Laravel, and Flutter — building scalable, production-grade applications for international clients.",
    ogDescription:
      "Building scalable backends and polished mobile apps with Spring Boot, Laravel, and Flutter.",
    keywords: ["Zaid Ahmed", "Software Engineer", "Full-Stack", "Spring Boot", "Laravel", "Flutter", "Saudi Arabia"],
  },

  profile: {
    name: "Zaid Ahmed",
    role: "Full-Stack Software Engineer",
    location: "Saudi Arabia",
    locationShort: "KSA",
    languages: ["English", "Arabic", "Urdu"],
  },

  nav: {
    about: "About",
    experience: "Experience",
    skills: "Skills",
    work: "Work",
    contact: "Contact",
  },

  header: {
    home: "Zaid Ahmed — home",
    resume: "Resume",
    downloadResume: "Download resume",
    toggleMenu: "Toggle menu",
    switchLanguage: "التبديل إلى العربية",
    languageLabel: "ع",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },

  hero: {
    available: "Available for new opportunities",
    title: { pre: "Engineering", accent: "scalable", post: "software for web & mobile." },
    intro:
      "I'm **Zaid Ahmed**, a full-stack software engineer specializing in **Spring Boot**, **Laravel** and **Flutter** — designing secure APIs, cloud-native microservices and production-grade apps for international clients.",
    viewWork: "View selected work",
    downloadResume: "Download resume",
    currently: "Currently",
    yearsBuilding: ["years building", "production systems"],
  },

  about: {
    eyebrow: "About",
    title: { pre: "Turning complex requirements into", accent: "reliable", post: "products." },
    lead: "Full-Stack Software Engineer specializing in Flutter, Laravel and Spring Boot, with a proven track record of delivering production-grade applications for international clients.",
    body: "I care about clean architecture, measurable performance and shipping with confidence — from designing secure, well-tested microservices to automating CI/CD pipelines and running workloads across AWS, Hostinger and cPanel environments.",
    stats: [
      { value: "4+", label: "Years of experience" },
      { value: "20+", label: "Happy clients" },
      { value: "30+", label: "Projects delivered" },
    ],
    now: "Now",
    basedIn: "Based in",
    openTo: "Open to remote & on-site roles",
    languages: "Languages",
    languagesNote: "Comfortable collaborating across regions",
  },

  experience: {
    eyebrow: "Experience",
    title: { pre: "Where I've", accent: "shipped", post: "work." },
    description:
      "Four years across enterprise platforms, high-traffic APIs and mobile products — in-house and remote.",
    current: "Current",
    items: {
      ams: {
        period: "2025 — Present",
        title: "Full-Stack Software Engineer",
        type: "Full-time",
        highlights: [
          "Architected and deployed high-performance enterprise applications utilizing Java and Spring Boot microservices alongside Flutter backends on AWS, consistently achieving a 5% increase in system uptime.",
          "Engineered localized backend microservices in Spring Boot, integrating ZATCA e-invoicing compliance APIs, regional payment gateways (MyFatoorah, Moyasar), and 4Jawaly SMS services to strictly align with regional regulatory standards.",
          "Implemented robust security standards using Spring Security, JWT, and RBAC, alongside Spring Data JPA/Hibernate for optimized database transactions and query execution.",
          "Spearheaded automated CI/CD pipelines for containerized Spring Boot applications using Docker and AWS ECS/ECR, increasing deployment frequency by 10% and streamlining engineering workflows.",
          "Leveraged Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD) using JUnit and Mockito to restructure complex codebases and ensure zero-downtime releases.",
        ],
      },
      riser: {
        period: "2024",
        title: "Backend Engineer",
        type: "Remote",
        highlights: [
          "Maintain and scale Laravel-based RESTful APIs for a high-traffic video hiring platform supporting over 5,000 active users.",
          "Optimize MySQL database performance and manage production deployments via cPanel, ensuring a 5% improvement in data retrieval speed.",
          "Develop AI-driven features leveraging Google Gemini AI to enhance platform matchmaking and user experience.",
        ],
      },
      meraki: {
        period: "2023 — 2024",
        title: "Software Engineer",
        type: "Full-time",
        highlights: [
          "Developed and maintained systems for 7+ commercial projects using Flutter/Laravel, integrating Firebase and NoSQL databases to enhance performance.",
          "Leveraged Laravel MVC architecture and Git-based workflows to deliver maintainable and scalable RESTful APIs.",
          "Collaborated closely with front-end teams to ensure smooth integration and delivery of features.",
        ],
      },
      comsats: {
        period: "2022 — 2023",
        title: "Backend Engineer",
        type: "Full-time",
        highlights: [
          "Designed and built a conference management system serving 5000+ users across 10+ countries, managing registrations, paper submissions, and scheduling.",
          "Architected Laravel REST APIs with MySQL backends, focusing on scalability and modular structure.",
        ],
      },
    },
  },

  skills: {
    eyebrow: "Skills & Education",
    title: { pre: "The", accent: "toolkit", post: "behind the work." },
    description:
      "A pragmatic stack for building secure backends, cross-platform apps and automated cloud deployments.",
    levels: ["Beginner", "Familiar", "Proficient", "Advanced", "Expert"],
    levelOf: "of",
    education: "Education",
    educationItems: [
      {
        degree: "Bachelor's in Computer Science (Major: AI)",
        school: "COMSATS University Islamabad",
        year: "2022",
        description:
          "Graduated with a focus on Artificial Intelligence, building a strong foundation in computational theory, algorithm design, and software engineering principles that support current full-stack development expertise.",
      },
    ],
    toolbox: {
      backend: "Backend",
      mobile: "Mobile",
      cloud: "Cloud & DevOps",
      data: "Data",
      practices: "Practices",
      integrations: "Integrations",
    },
    toolboxItems: {
      queryOptimization: "Query optimization",
      zatca: "ZATCA e-invoicing",
    },
  },

  work: {
    eyebrow: "Selected work",
    title: { pre: "Products I've helped", accent: "bring to life.", post: "" },
    description:
      "SaaS platforms, business websites and mobile apps — shipped to production and used by real customers.",
    filterLabel: "Filter projects",
    all: "All",
    categories: { saas: "SaaS", website: "Website", app: "App" } as Record<string, string>,
    preview: "preview",
    showLess: "Show less",
    showAll: "Show all {count} projects",
  },

  certificates: {
    eyebrow: "Certifications",
    title: { pre: "Always", accent: "learning.", post: "" },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },

  contact: {
    eyebrow: "Contact",
    title: { pre: "Have a project in mind?", accent: "Let's build it.", post: "" },
    body: "I'm open to full-time roles and freelance collaborations. Drop a message and I'll get back to you within a day.",
    sayHello: "Say hello",
    copyEmail: "Copy email address",
    emailCopied: "Email copied",
    channels: { email: "Email", phone: "Phone", linkedin: "LinkedIn", github: "GitHub" },
  },

  /** Labels for motion/3D UI: loader, custom cursor, scroll hints. */
  fx: {
    loading: "Loading experience",
    skipIntro: "Skip intro",
    scroll: "Scroll",
    view: "View",
    drag: "Drag",
    open: "Open",
    core: "Say hi",
    dragHint: "Drag to rotate",
    galleryHint: "Scroll to explore",
  },

  footer: {
    tagline:
      "Full-Stack Software Engineer building scalable, production-grade applications with Spring Boot, Laravel, and Flutter.",
    navigate: "Navigate",
    connect: "Connect",
    email: "Email",
    rights: "© {year} Zaid Ahmed. All rights reserved.",
    builtWith: "Designed & built with Next.js · Tailwind CSS · three.js",
  },
};

export type Dictionary = typeof en;
