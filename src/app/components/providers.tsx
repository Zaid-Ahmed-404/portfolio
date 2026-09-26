"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
    {children}
  </ThemeProvider>
);

export default Providers;
