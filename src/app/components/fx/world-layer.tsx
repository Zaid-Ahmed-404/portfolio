"use client";

import { dirOf, type Locale } from "@/i18n";
import { useDevice } from "@/lib/device";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";

const World = dynamic(() => import("../three/world"), { ssr: false });

/**
 * The fixed backdrop behind every section: the WebGL world on capable devices,
 * a static gradient otherwise (no WebGL / low-end / before load).
 */
const WorldLayer = ({ locale }: { locale: Locale }) => {
  const device = useDevice();
  const dir = dirOf(locale);

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ "--fx": dir === "rtl" ? "25%" : "75%", "--fy": "50%" } as CSSProperties}
    >
      <div className="scene-fallback absolute inset-0 max-lg:[--fx:50%] max-lg:[--fy:30%]" />
      <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
      {device && device.tier !== "fallback" && (
        <div className="absolute inset-0">
          <World device={device} dir={dir} />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(var(--bg-rgb),0.7))]" />
    </div>
  );
};

export default WorldLayer;
