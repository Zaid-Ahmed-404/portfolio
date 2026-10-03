import type { ReactNode } from "react";
import RootShell, { buildMetadata } from "../components/root-shell";

export { viewport } from "../components/root-shell";

export const metadata = buildMetadata("ar");

export default function ArabicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell locale="ar">{children}</RootShell>;
}
