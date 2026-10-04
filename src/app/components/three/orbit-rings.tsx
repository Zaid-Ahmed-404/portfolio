"use client";

import { ACCENT, EMBER } from "@/lib/theme";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { AdditiveBlending, Color, type Group, type Mesh } from "three";

/** Ring radius (× size), tilt and spin speed. */
const RINGS = [
  { radius: 0.5, tilt: [1.25, 0.15, 0], speed: 0.35 },
  { radius: 0.58, tilt: [1.4, -0.45, 0.35], speed: -0.25 },
  { radius: 0.68, tilt: [1.05, 0.55, -0.25], speed: 0.18 },
] as const;

interface OrbitRingsProps {
  /** Overall scale in world units (the rings' radius is a fraction of it). */
  size: number;
  hdr: boolean;
  animate: boolean;
  /** 0..1 — extra glow and spin while the subject is hovered. */
  energy?: RefObject<number>;
}

/** Thin tilted orbits with a bright "satellite" travelling along each one. */
const OrbitRings = ({ size, hdr, animate, energy }: OrbitRingsProps) => {
  const rings = useRef<(Group | null)[]>([]);
  const satellites = useRef<(Mesh | null)[]>([]);
  const angles = useRef(RINGS.map((_, i) => i * 2.1));

  const colors = useMemo(
    () => ({
      line: new Color(ACCENT).multiplyScalar(hdr ? 1.4 : 0.9),
      satellite: new Color(EMBER).multiplyScalar(hdr ? 4 : 1.2),
    }),
    [hdr]
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const e = 1 + (energy?.current ?? 0) * 2.5;
    RINGS.forEach((ring, i) => {
      if (animate) angles.current[i] += delta * ring.speed * 1.6 * e;
      const r = ring.radius * size;
      satellites.current[i]?.position.set(Math.cos(angles.current[i]) * r, Math.sin(angles.current[i]) * r, 0);
      const group = rings.current[i];
      if (group && animate) group.rotation.z += delta * ring.speed * 0.15 * e;
    });
  });

  return (
    <group>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={[ring.tilt[0], ring.tilt[1], ring.tilt[2]]}>
          <group
            ref={(el) => {
              rings.current[i] = el;
            }}
          >
            <mesh>
              <torusGeometry args={[ring.radius * size, 0.004 * size, 6, 220]} />
              <meshBasicMaterial
                color={colors.line}
                transparent
                opacity={0.55 - i * 0.12}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh
              ref={(el) => {
                satellites.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.018 * size, 12, 12]} />
              <meshBasicMaterial color={colors.satellite} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export default OrbitRings;
