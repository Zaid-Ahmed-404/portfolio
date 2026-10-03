import { Fragment } from "react";

/** A heading split around one serif-accented phrase. */
export const AccentTitle = ({ title }: { title: { pre: string; accent: string; post: string } }) => (
  <>
    {title.pre && `${title.pre} `}
    <span className="serif-accent text-accent">{title.accent}</span>
    {title.post && ` ${title.post}`}
  </>
);

/** Renders `**text**` segments as highlighted spans. */
export const Rich = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <span key={i} className="font-medium text-fg">
          {part.slice(2, -2)}
        </span>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    )}
  </>
);
