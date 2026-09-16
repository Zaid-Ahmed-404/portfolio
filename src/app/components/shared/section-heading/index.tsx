import Reveal from "../reveal";

interface SectionHeadingProps {
  index: string;
  title: string;
  note?: string;
}

const SectionHeading = ({ index, title, note }: SectionHeadingProps) => {
  return (
    <Reveal direction="up">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-6 mb-10 md:mb-16">
        <div className="flex items-baseline gap-3 md:gap-4">
          <span className="section-index">{index}</span>
          <h2>{title}</h2>
        </div>
        {note && (
          <p className="hidden sm:block max-w-[14rem] text-right text-sm text-muted">
            {note}
          </p>
        )}
      </div>
    </Reveal>
  );
};

export default SectionHeading;
