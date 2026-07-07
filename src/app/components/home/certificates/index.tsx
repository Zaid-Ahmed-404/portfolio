import Link from 'next/link';
import React from 'react';
import Reveal from '../../shared/reveal';

const Certificates = () => {
    const certificates = [
        {
            title: "Software Architecture & Design of Modern Large Scale Systems",
            provider: "Udemy",
            date: "Oct 31, 2024",
            href: "https://www.udemy.com/certificate/UC-d5961a7f-bf3f-47a5-a925-8c1b9ed97e7a/",
        },
        {
            title: "Flutter & Dart – The Complete Guide [2024 Edition]",
            provider: "Udemy",
            date: "Aug 16, 2023",
            href: "https://www.udemy.com/certificate/UC-9013d99f-d719-4e59-a2d3-05a542463a9e/",
        },
        {
            title: "RESTful API with Laravel: Build a Real API with Laravel",
            provider: "Udemy",
            date: "Aug 22, 2024",
            href: "https://www.udemy.com/certificate/UC-d5c7f060-3274-47b3-9bca-49c54fbfdd58/",
        },
        {
            title: "Laravel - For Beginner to Advanced",
            provider: "Udemy",
            date: "May 28, 2025",
            href: "https://www.udemy.com/certificate/UC-788c57e1-099a-49fb-a6b1-2069f35c282f/",
        },
    ];

    return (
        <section>
            <div className="border-t border-softGray">
                <div className="container">
                    <div className="py-16 md:py-32">
                        <Reveal direction="up">
                            <div className="flex items-center justify-between gap-2 border-b border-black pb-7 mb-9 md:mb-16">
                                <h2>Certificates</h2>
                                <p className="text-xl text-primary">( 04 )</p>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-7">
                            {certificates.map((cert, index) => (
                                <Reveal key={index} direction="up" delay={index * 100}>
                                    <Link
                                        href={cert.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-5 xl:p-7 border border-softGray rounded-lg flex items-start gap-5 transition-all duration-300 hover:border-orange-500 hover:-translate-y-1.5 hover:shadow-lg"
                                    >
                                        <div className="no-print shrink-0 w-11 h-11 rounded-full bg-softGray flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="#FE4300" strokeWidth="1.5" />
                                                <path d="M8.5 13.5 7 22l5-2.5 5 2.5-1.5-8.5" stroke="#FE4300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1.5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h5 className="leading-snug group-hover:text-orange-600 transition-colors">
                                                    {cert.title}
                                                </h5>
                                                <svg
                                                    className="no-print shrink-0 mt-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#FE4300"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M7 17L17 7M7 7h10v10" />
                                                </svg>
                                            </div>
                                            <div className="flex items-center gap-2 font-normal text-black">
                                                <span>{cert.provider}</span>
                                                <span className="text-softGray">•</span>
                                                <span>{cert.date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
