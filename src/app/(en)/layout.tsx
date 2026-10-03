import type { ReactNode } from "react";
import RootShell, { buildMetadata } from "../components/root-shell";

export { viewport } from "../components/root-shell";

export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
