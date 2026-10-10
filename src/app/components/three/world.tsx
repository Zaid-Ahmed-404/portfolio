"use client";

import type { Device } from "@/lib/device";
import { completeTask } from "@/lib/store";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, type Group, type PerspectiveCamera } from "three";
import Core, { type CoreState } from "./core";
import Embers from "./embers";

/**
 * Where the core rests while each section is on screen.
 * fx / fy: position in the viewport (-1..1, y up) · r: radius as a fraction of the
 * viewport's half-height · z: depth · glow: presence · amp: surface turbulence.
 */
type Pose = { fx: number; fy: number; z: number; r: number; glow: number; amp: number };

const POSES: { id: string; pose: Pose }[] = [
  { id: "home", pose: { fx: 0, fy: 0.3, z: 0, r: 0.34, glow: 0.4, amp: 0.15 } },
  { id: "about", pose: { fx: 0.66, fy: 0.5, z: -1, r: 0.22, glow: 0.6, amp: 0.19 } },
  { id: "experience", pose: { fx: 0, fy: 0, z: -5, r: 0.5, glow: 0.05, amp: 0.22 } },
  { id: "skills", pose: { fx: 0.42, fy: 0.05, z: -6, r: 0.09, glow: 0, amp: 0.14 } },
  { id: "work", pose: { fx: 0.92, fy: 0.5, z: -3, r: 0.34, glow: 0.1, amp: 0.2 } },
  { id: "certificates", pose: { fx: -1.02, fy: -0.2, z: -3, r: 0.3, glow: 0.08, amp: 0.18 } },
  { id: "contact", pose: { fx: 0, fy: 0, z: 0, r: 0.27, glow: 1, amp: 0.17 } },
];

/** Sections with a `[data-core]` element pin the core to it instead of using fx / fy. */
const ANCHORED: Record<string, { glow: number; fit?: number }> = {
  // Hero: fills its stage. Contact: sits behind the "say hello" button at the pose's own radius.
  home: { glow: 1, fit: 0.3 },
  contact: { glow: 1 },
};

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Tells the loader the scene is live once its first frame has rendered. */
const ReadySignal = ({ onReady }: { onReady: () => void }) => {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 1) onReady();
  });
  return null;
};

/** Moves the core between the section poses as the page scrolls. */
const Rig = ({ device, dir }: { device: Device; dir: "ltr" | "rtl" }) => {
  const high = device.tier === "high";
  const animate = !device.reducedMotion;
  const { invalidate } = useThree();

  const group = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const core = useRef<CoreState>({ glow: 0, amp: 0.2 });

  const layout = useRef<{ top: number; anchor: HTMLElement | null }[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef({ last: 0, velocity: 0 });
  const current = useRef<Pose | null>(null);
  const target = useMemo<Pose>(() => ({ fx: 0, fy: 0, z: 0, r: 0, glow: 0, amp: 0 }), []);
  const scratch = useMemo<Pose>(() => ({ fx: 0, fy: 0, z: 0, r: 0, glow: 0, amp: 0 }), []);

  // Section offsets, re-measured whenever the page's height changes.
  useEffect(() => {
    const measure = () => {
      layout.current = POSES.map(({ id }) => {
        const section = document.getElementById(id);
        return {
          top: section ? section.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY,
          anchor: section?.querySelector<HTMLElement>("[data-core]") ?? null,
        };
      });
      invalidate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [invalidate]);

  useEffect(() => {
    scroll.current.last = window.scrollY;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Static mode (reduced motion): still redraw when the page moves underneath.
    const onScroll = () => invalidate();
    if (animate) window.addEventListener("pointermove", onMove, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate, invalidate]);

  /** The pose of section `i` right now (anchored sections follow their element live). */
  const resolve = (i: number, out: Pose, vw: number, vh: number): Pose => {
    const { id, pose } = POSES[i];
    const narrow = vw < vh;
    const anchor = layout.current[i]?.anchor;
    const rect = ANCHORED[id] && anchor ? anchor.getBoundingClientRect() : null;

    if (rect && rect.width > 0) {
      const { glow, fit } = ANCHORED[id];
      out.fx = ((rect.left + rect.width / 2) / vw) * 2 - 1;
      out.fy = MathUtils.clamp(1 - ((rect.top + rect.height / 2) / vh) * 2, -3, 3);
      out.r = fit ? (Math.min(rect.width, rect.height) / vh) * 2 * fit : pose.r * (narrow ? 0.7 : 1);
      out.glow = glow;
    } else {
      // On portrait screens the core stays nearer the middle, smaller and quieter, behind the text.
      out.fx = pose.fx * (dir === "rtl" ? -1 : 1) * (narrow ? 0.55 : 1);
      out.fy = pose.fy;
      out.r = pose.r * (narrow ? 0.75 : 1);
      out.glow = pose.glow * (narrow ? 0.75 : 1);
    }
    out.z = pose.z;
    out.amp = pose.amp;
    return out;
  };

  useFrame((frame, rawDelta) => {
    const g = group.current;
    if (!g || !layout.current.length) return;
    const delta = Math.min(rawDelta, 0.05);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const y = window.scrollY;

    // Each pose hands over to the next while that section's top crosses the viewport.
    resolve(0, target, vw, vh);
    for (let i = 1; i < POSES.length; i++) {
      const t = MathUtils.clamp((y + vh - layout.current[i].top) / vh, 0, 1);
      if (t <= 0) break;
      const next = resolve(i, scratch, vw, vh);
      const k = smooth(t);
      target.fx += (next.fx - target.fx) * k;
      target.fy += (next.fy - target.fy) * k;
      target.z += (next.z - target.z) * k;
      target.r += (next.r - target.r) * k;
      target.glow += (next.glow - target.glow) * k;
      target.amp += (next.amp - target.amp) * k;
    }

    const s = scroll.current;
    s.velocity += (Math.abs(y - s.last) / Math.max(delta, 1e-3) - s.velocity) * Math.min(1, delta * 5);
    s.last = y;
    const rush = animate ? Math.min(s.velocity / 2600, 1) : 0;

    const c = (current.current ??= { ...target, glow: 0 });
    const k = animate ? 1 - Math.exp(-delta * 4.5) : 1;
    c.fx += (target.fx - c.fx) * k;
    c.fy += (target.fy - c.fy) * k;
    c.z += (target.z - c.z) * k;
    c.r += (target.r - c.r) * k;
    c.glow += (target.glow - c.glow) * (animate ? 1 - Math.exp(-delta * 3) : 1);
    c.amp += (target.amp - c.amp) * k;

    const camera = frame.camera as PerspectiveCamera;
    const halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - c.z);
    g.position.set(c.fx * halfH * camera.aspect, c.fy * halfH, c.z);
    g.scale.setScalar(Math.max(c.r * halfH, 1e-3));

    // Scrolling fast stirs the surface and spins the whole system.
    core.current.glow = c.glow;
    core.current.amp = c.amp + rush * 0.16;

    if (animate && tilt.current) {
      tilt.current.rotation.y += delta * rush * 2.2;
      const px = pointer.current.x * 0.35;
      const py = pointer.current.y * 0.25;
      g.rotation.y += (px - g.rotation.y) * Math.min(1, delta * 2);
      g.rotation.x += (py - g.rotation.x) * Math.min(1, delta * 2);
    }
  });

  return (
    <group ref={group}>
      <group ref={tilt}>
        <Core state={core} detail={high ? 40 : 18} animate={animate} />
      </group>
    </group>
  );
};

/**
 * The one WebGL scene behind the whole page: drifting dust and the glazed core,
 * which travels from section to section with the scroll.
 */
const World = ({ device, dir }: { device: Device; dir: "ltr" | "rtl" }) => {
  const high = device.tier === "high";
  const animate = !device.reducedMotion;
  const [dprMax, setDprMax] = useState(device.dpr[1]);
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      className={`transition-opacity duration-[1200ms] ${ready ? "opacity-100" : "opacity-0"}`}
      frameloop={animate ? "always" : "demand"}
      dpr={[1, dprMax]}
      camera={{ position: [0, 0, 8], fov: 40, near: 0.5, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
    >
      <Embers count={high ? 700 : 280} animate={animate} bounds={[20, 12, 14]} scrollBoost />
      <Rig device={device} dir={dir} />

      <ReadySignal
        onReady={() => {
          setReady(true);
          completeTask("hero");
        }}
      />

      {high && <PerformanceMonitor onDecline={() => setDprMax(1)} />}
    </Canvas>
  );
};

export default World;
