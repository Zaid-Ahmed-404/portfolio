"use client";

import type { Device } from "@/lib/device";
import { completeTask, setSceneCursor } from "@/lib/store";
import { BG } from "@/lib/theme";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Vector2 } from "three";
import Embers from "./embers";
import PortraitCard from "./portrait-card";

export interface HeroSceneProps {
  device: Device;
  /** Pauses rendering entirely while the hero/about block is off-screen. */
  active: boolean;
  /** The hero + about wrapper: receives the pointer events for the scene. */
  trackRef: RefObject<HTMLElement | null>;
  portraitSrc: string;
  hoverLabel: string;
  /** Called once the portrait texture is ready (true) or failed (false). */
  onPortrait: (ok: boolean) => void;
}

/** Tells the loader the scene is live once its first frame has rendered. */
const ReadySignal = ({ onReady }: { onReady: () => void }) => {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 1) onReady();
  });
  return null;
};

const HeroScene = ({ device, active, trackRef, portraitSrc, hoverLabel, onPortrait }: HeroSceneProps) => {
  const high = device.tier === "high";
  const animate = !device.reducedMotion;
  const [dprMax, setDprMax] = useState(device.dpr[1]);
  const [ready, setReady] = useState(false);
  const chroma = useMemo(() => new Vector2(0.0008, 0.001), []);

  useEffect(() => () => setSceneCursor(null), []);

  const onHover = useCallback(
    (h: boolean) => setSceneCursor(h ? "core" : null, h ? hoverLabel : ""),
    [hoverLabel]
  );

  return (
    <Canvas
      className={`transition-opacity duration-[1200ms] ${ready ? "opacity-100" : "opacity-0"}`}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      dpr={[1, dprMax]}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.5, far: 40 }}
      gl={{ antialias: !high, alpha: !high, powerPreference: "high-performance", stencil: false }}
      eventSource={trackRef as RefObject<HTMLElement>}
      eventPrefix="client"
    >
      {high && <color attach="background" args={[BG]} />}

      <Embers count={high ? 1100 : 380} hdr={high} animate={animate} bounds={[20, 12, 14]} scrollBoost />
      <PortraitCard
        src={portraitSrc}
        selector="[data-hero-portrait]"
        hdr={high}
        animate={animate}
        onHover={device.coarse ? undefined : onHover}
        onLoaded={onPortrait}
      />

      <ReadySignal
        onReady={() => {
          setReady(true);
          completeTask("hero");
        }}
      />

      {high && (
        <>
          <PerformanceMonitor onDecline={() => setDprMax(1)} />
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.7} luminanceSmoothing={0.25} radius={0.7} />
            <ChromaticAberration offset={chroma} radialModulation modulationOffset={0.4} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        </>
      )}
    </Canvas>
  );
};

export default HeroScene;
