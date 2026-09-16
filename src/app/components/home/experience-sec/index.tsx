import Reveal from "../../shared/reveal";
import SectionHeading from "../../shared/section-heading";

const experiences = [
  {
    year: "2025 - Present",
    title: "Full-Stack Software Engineer",
    company: "https://amsksa.com/",
    type: "Full time",
    description: [
      "Architected and deployed high-performance enterprise applications utilizing Java and Spring Boot microservices alongside Flutter backends on AWS, consistently achieving a 5% increase in system uptime.",
      "Engineered localized backend microservices in Spring Boot, integrating ZATCA e-invoicing compliance APIs, regional payment gateways (MyFatoorah, Moyasar), and 4Jawaly SMS services to strictly align with regional regulatory standards.",
      "Implemented robust security standards using Spring Security, JWT, and RBAC, alongside Spring Data JPA/Hibernate for optimized database transactions and query execution.",
      "Spearheaded automated CI/CD pipelines for containerized Spring Boot applications using Docker and AWS ECS/ECR, increasing deployment frequency by 10% and streamlining engineering workflows.",
      "Leveraged Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD) using JUnit and Mockito to restructure complex codebases and ensure zero-downtime releases.",
    ],
  },
  {
    year: "2024",
    title: "Backend Engineer",
    company: "https://riserapp.co.uk/",
    type: "Remote",
    description: [
      "Maintain and scale Laravel-based RESTful APIs for a high-traffic video hiring platform supporting over 5,000 active users.",
      "Optimize MySQL database performance and manage production deployments via cPanel, ensuring a 5% improvement in data retrieval speed.",
      "Develop AI-driven features leveraging Google Gemini AI to enhance platform matchmaking and user experience.",
    ],
  },
  {
    year: "2023-2024",
    title: "Software Engineer",
    company: "https://meraki-it.pk/",
    type: "Full time",
    description: [
      "Developed and maintained systems for 7+ commercial projects using Flutter/Laravel, integrating Firebase and NoSQL databases to enhance performance.",
      "Leveraged Laravel MVC architecture and Git-based workflows to deliver maintainable and scalable RESTful APIs.",
      "Collaborated closely with front-end teams to ensure smooth integration and delivery of features.",
    ],
  },
  {
    year: "2022-2023",
    title: "Backend Engineer",
    company: "https://islamabad.comsats.edu.pk/",
    type: "Full time",
    description: [
      "Designed and built a conference management system serving 5000+ users across 10+ countries, managing registrations, paper submissions, and scheduling.",
      "Architected Laravel REST APIs with MySQL backends, focusing on scalability and modular structure.",
    ],
  },
];

const ExperienceSec = () => {
  return (
    <section id="experience">
      <div className="container py-16 md:py-28">
        <SectionHeading index="02" title="Experience" />

        <div className="flex flex-col">
          {experiences.map((exp, index) => (
            <Reveal
              key={index}
              direction="up"
              delay={index * 90}
              className="group relative grid grid-cols-1 gap-4 border-b border-line py-9 first:pt-0 last:border-b-0 md:grid-cols-[180px_1fr] md:gap-8 lg:grid-cols-[200px_1fr]"
            >
              <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-2">
                <span className="text-sm font-semibold tracking-tight text-ink">
                  {exp.year}
                </span>
                <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
                  {exp.type}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="transition-colors duration-300 group-hover:text-primary">
                    {exp.title}
                  </h3>
                  <a
                    href={exp.company}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-primary hover:decoration-primary"
                  >
                    {exp.company.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {exp.description.map((item, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-[15px] leading-relaxed text-body before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSec;
