"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "../icons";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full text-body transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <Sun
        size={17}
        className={`absolute transition-all duration-500 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
      <Moon
        size={17}
        className={`absolute transition-all duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
      />
    </button>
  );
};

export default ThemeToggle;
