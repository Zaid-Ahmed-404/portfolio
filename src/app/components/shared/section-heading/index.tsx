import type { ReactNode } from "react";
import Reveal from "../../fx/reveal";
import SplitTitle from "../../fx/split-title";

interface SectionHeadingProps {
  /** Section number, e.g. "02" — shown small in the eyebrow and as a giant outlined numeral. */
  index: string;
  eyebrow: string;
  title: { pre: string; accent: string; post: string };
  description?: string;
  aside?: ReactNode;
}

const SectionHeading = ({ index, eyebrow, title, description, aside }: SectionHeadingProps) => (
  <div className="relative mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
    <span aria-hidden className="outline-num pointer-events-none absolute -top-6 end-0 text-[clamp(6rem,17vw,14rem)] md:-top-14">
      {index}
    </span>
    <div className="relative flex max-w-3xl flex-col gap-5">
      <Reveal>
        <span className="eyebrow">
          <span dir="ltr" className="text-accent-bright">{index}</span>
          <span className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </span>
      </Reveal>
      <SplitTitle
        title={title}
        className="text-[clamp(2.3rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em]"
      />
      {description && (
        <Reveal delay={150}>
          <p className="max-w-xl text-base leading-relaxed md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
    {aside}
  </div>
);

export default SectionHeading;
