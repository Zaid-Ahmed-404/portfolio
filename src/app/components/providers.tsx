"use client";

import type { Locale } from "@/i18n";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import Cursor from "./fx/cursor";
import Loader from "./fx/loader";
import SmoothScroll from "./fx/smooth-scroll";

const Providers = ({ locale, children }: { locale: Locale; children: ReactNode }) => (
  <MotionConfig reducedMotion="user">
    <SmoothScroll />
    <Loader locale={locale} />
    {children}
    <Cursor />
  </MotionConfig>
);

export default Providers;
