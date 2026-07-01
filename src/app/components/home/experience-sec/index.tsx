import React from 'react';

const ExperienceSec = () => {
    const experiences = [
        {
            year: "2025 - Present",
            title: "Full-Stack Software Engineer",
            company: "https://amsksa.com/",
            type: "Full time",
            description: [
                "Architected and deployed high-performance Flutter/Laravel systems on AWS and cPanel, consistently achieving a 5% increase in system uptime.",
                "Engineered localized backend solutions including ZATCA e-invoicing compliance, MyFatoorah/moyasar/Tamara payment gateway integration, and 4Jawaly SMS services to meet regional regulatory standards.",
                "Spearheaded the implementation of CI/CD pipelines, increasing deployment frequency by 10% and streamlining development workflows.",
                "Maintained high proficiency in Clean Architecture and MVC patterns to restructure codebases."
            ]
        },
        {
            year: "2024",
            title: "Backend Engineer",
            company: "https://riserapp.co.uk/",
            type: "Remote",
            description: [
                "Maintain and scale Laravel-based RESTful APIs for a high-traffic video hiring platform supporting over 5,000 active users.",
                "Optimize MySQL database performance and manage production deployments via cPanel, ensuring a 5% improvement in data retrieval speed.",
                "Develop AI-driven features leveraging Google Gemini AI to enhance platform matchmaking and user experience."
            ]
        }, {
            year: "2023-2024",
            title: "Software Engineer",
            company: "https://meraki-it.pk/",
            type: "Full time",
            description: [
                "Developed and maintained systems for 7+ commercial projects using Flutter/Laravel, integrating Firebase and NoSQL databases to enhance performance.",
                "Leveraged Laravel MVC architecture and Git-based workflows to deliver maintainable and scalable RESTful APIs.",
                "Collaborated closely with front-end teams to ensure smooth integration and delivery of features."
            ]
        }, {
            year: "2022-2023",
            title: "Backend Engineer",
            company: "https://islamabad.comsats.edu.pk/",
            type: "Full time",
            description: [
                "Designed and built a conference management system serving 5000+ users across 10+ countries, managing registrations, paper submissions, and scheduling.",
                "Architected Laravel REST APIs with MySQL backends, focusing on scalability and modular structure."
            ]
        },
    ];

    return (
        <section>
            <div className="py-16 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-2 border-b border-black pb-7 mb-9 md:mb-16">
                        <h2>Experience</h2>
                        <p className="text-xl text-primary">( 02 )</p>
                    </div>

                    <div className="space-y-7 md:space-y-12">
                        {experiences.map((exp, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4 xl:gap-8 items-start relative">
                                <div className="">
                                    <h3 className="font-bold mb-2 text-black">{exp.year}</h3>
                                    <h4 className="text-lg font-normal">{exp.title}</h4>
                                </div>

                                <div className="relative">
                                    {index < experiences.length && (
                                        <div className={`absolute left-0 top-3 w-px ${index < experiences.length - 1 ? 'h-40' : 'h-30'} bg-softGray`}></div>
                                    )}

                                    <div className="no-print absolute left-0 top-0 transform -translate-x-1/2">
                                        <div className={`no-print w-3.5 h-3.5 rounded-full border-1 bg-white flex items-center justify-center ${index === 1 ? 'border-primary' : 'border-black'}`}>
                                            {index === 1 && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pl-4 lg:pl-7">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl text-black font-normal">{exp.company}</span>
                                        </div>
                                        <p className="text-base font-normal">{exp.type}</p>
                                    </div>
                                </div>

                                <div className="pl-8 sm:pl-0">
                                    <ul className="list-disc space-y-2">
                                        {exp.description.map((item, i) => (
                                            <li key={i} className="leading-relaxed text-base">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceSec;