import { Fragment } from "react";

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
