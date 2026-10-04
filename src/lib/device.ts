"use client";

import { useSyncExternalStore } from "react";

/**
 * - high:     desktop-class GPU → full scenes + post-processing
 * - mobile:   touch / small screens → fewer particles, no post-processing
 * - fallback: no WebGL, software rendering or a low-end device → static gradients
 */
export type Tier = "high" | "mobile" | "fallback";

export type Device = {
  tier: Tier;
  reducedMotion: boolean;
  /** Touch-first pointer (no hover, no custom cursor). */
  coarse: boolean;
  /** Device-pixel-ratio range handed to <Canvas dpr>. Never above 2. */
  dpr: [number, number];
};

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

const probeWebGL = (): "ok" | "software" | "none" => {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";

    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) ? "software" : "ok";
  } catch {
    return "none";
  }
};

const detect = (): Device => {
  const nav = navigator as NavigatorExtras;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;

  const lowEnd =
    (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
    nav.connection?.saveData === true;

  const webgl = probeWebGL();

  let tier: Tier = "high";
  if (webgl !== "ok" || lowEnd) tier = "fallback";
  else if (coarse || small) tier = "mobile";

  const dprCap = tier === "high" ? 2 : 1.5;
  return { tier, reducedMotion, coarse, dpr: [1, Math.min(window.devicePixelRatio || 1, dprCap)] };
};

let cached: Device | null = null;

export const getDevice = (): Device | null => {
  if (typeof window === "undefined") return null;
  cached ??= detect();
  return cached;
};

const noopSubscribe = () => () => {};

/** `null` during SSR and the hydration pass, then the detected device. */
export const useDevice = (): Device | null => useSyncExternalStore(noopSubscribe, getDevice, () => null);
