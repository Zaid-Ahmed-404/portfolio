"use client";

import { getDataPath } from "@/utils/image";
import { useEffect, useState } from "react";
import Logo from "../logo";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleDownloadPDF = () => {
        const link = document.createElement("a");
        link.href = getDataPath("/data/Zaid_Ahmed_Software_Engineer.pdf");
        link.download = "Zaid_Ahmed_Software_Engineer.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <header
            className={`navbar top-0 left-0 z-999 w-full fixed transition-all duration-500 ${scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <div className="container">
                <nav className={`transition-all duration-500 ${scrolled ? "py-3 sm:py-4" : "py-7"}`}>
                    <div className="flex items-center gap-4 sm:gap-8">
                        <div>
                            <Logo />
                        </div>


                        <button
                            onClick={handleDownloadPDF}
                            className="relative overflow-hidden cursor-pointer w-fit py-2 sm:py-3 md:py-5 px-4 sm:px-5 md:px-7 border border-primary rounded-full group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="relative z-10 text-xl font-medium text-black group-hover:text-white transition-colors duration-300">
                                Download PDF Resume
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
