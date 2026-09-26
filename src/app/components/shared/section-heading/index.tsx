import type { ReactNode } from "react";
import Reveal from "../reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
}

const SectionHeading = ({ eyebrow, title, description, aside }: SectionHeadingProps) => {
  return (
    <Reveal direction="up">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="eyebrow">
            <span className="h-px w-6 bg-accent" />
            {eyebrow}
          </span>
          <h2 className="text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-[56px]">
            {title}
          </h2>
          {description && <p className="max-w-xl text-base leading-relaxed md:text-lg">{description}</p>}
        </div>
        {aside}
      </div>
    </Reveal>
  );
};

export default SectionHeading;
