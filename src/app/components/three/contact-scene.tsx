"use client";

import type { Device } from "@/lib/device";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Group } from "three";
import Embers from "./embers";
import OrbitRings from "./orbit-rings";

/** Window-level pointer parallax (the canvas sits behind the content, so it gets no events). */
const Parallax = ({ children, animate }: { children: ReactNode; animate: boolean }) => {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !animate) return;
    const k = Math.min(1, delta * 2);
    g.rotation.y += (pointer.current.x * 0.35 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.25 - g.rotation.x) * k;
  });

  return <group ref={group}>{children}</group>;
};

/** A quieter echo of the hero: the same orbits (around the CTA) and a thinner ember field. */
const ContactScene = ({ device, active }: { device: Device; active: boolean }) => {
  const high = device.tier === "high";
  const animate = !device.reducedMotion;
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      dpr={[1, Math.min(device.dpr[1], 1.5)]}
      camera={{ position: [0, 0, 8], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => setReady(true)}
    >
      <Embers count={high ? 500 : 200} hdr={false} animate={animate} bounds={[18, 11, 10]} />
      <group position={[0, -0.9, 0]}>
        <Parallax animate={animate}>
          <OrbitRings size={4.2} hdr={false} animate={animate} />
        </Parallax>
      </group>
    </Canvas>
  );
};

export default ContactScene;
