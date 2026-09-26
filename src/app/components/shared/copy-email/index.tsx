"use client";

import { useState } from "react";
import { Check, Copy } from "../icons";

interface CopyEmailProps {
  email: string;
  className?: string;
}

const CopyEmail = ({ email, className = "" }: CopyEmailProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className={`group inline-flex cursor-pointer items-center gap-2 text-sm text-body transition-colors hover:text-fg ${className}`}
    >
      <span className="font-mono">{email}</span>
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Copy size={15} className={`absolute transition-all duration-300 ${copied ? "scale-0 opacity-0" : "opacity-60 group-hover:opacity-100"}`} />
        <Check size={15} className={`absolute text-accent transition-all duration-300 ${copied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied" : ""}
      </span>
    </button>
  );
};

export default CopyEmail;
