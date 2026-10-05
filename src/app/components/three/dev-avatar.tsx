"use client";

import { loaderStore } from "@/lib/store";
import { ACCENT, ACCENT_BRIGHT, EMBER } from "@/lib/theme";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
} from "three";

type Vec3 = [number, number, number];

/* ---------- Canvas textures (code window, lid logo, floating glyphs) ---------- */

/** Deterministic random so the "code" looks the same on every visit. */
const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const canvas = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

/** Rows of rounded "tokens" in the accent palette — reads as syntax-highlighted code. */
const codeTexture = () =>
  canvas(512, 1024, (g) => {
    const rnd = seeded(7);
    const palette = [ACCENT_BRIGHT, EMBER, "#fafaf9", "#a8a29e", "#fcd9b6", ACCENT];
    let y = 22;
    while (y < 1000) {
      let x = 26 + Math.floor(rnd() * 4) * 30;
      const tokens = 1 + Math.floor(rnd() * 4);
      for (let i = 0; i < tokens; i++) {
        const w = 28 + rnd() * 120;
        if (x + w > 490) break;
        g.globalAlpha = 0.55 + rnd() * 0.45;
        g.fillStyle = palette[Math.floor(rnd() * palette.length)];
        g.beginPath();
        g.roundRect(x, y, w, 14, 7);
        g.fill();
        x += w + 12;
      }
      y += rnd() < 0.15 ? 54 : 32;
    }
  });

const windowTexture = () =>
  canvas(512, 384, (g) => {
    g.fillStyle = "rgba(14, 11, 10, 0.86)";
    g.strokeStyle = ACCENT;
    g.lineWidth = 4;
    g.beginPath();
    g.roundRect(4, 4, 504, 376, 26);
    g.fill();
    g.stroke();
    g.fillStyle = "rgba(234, 88, 12, 0.18)";
    g.fillRect(6, 6, 500, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      g.fillStyle = c;
      g.beginPath();
      g.arc(36 + i * 28, 28, 8, 0, Math.PI * 2);
      g.fill();
    });
  });

const glyphTexture = (text: string) =>
  canvas(256, 256, (g) => {
    g.fillStyle = "#ffffff";
    g.font = "700 120px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 128, 132);
  });

/* ---------- Geometry helpers ---------- */

/** A capsule stretched between two points (arms, glasses temples). */
const Limb = ({ from, to, radius, material }: { from: Vec3; to: Vec3; radius: number; material: MeshStandardMaterial }) => {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const dir = b.clone().sub(a);
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <capsuleGeometry args={[radius, length, 6, 12]} />
    </mesh>
  );
};

/** Shoulder → elbow → wrist, right side (x > 0). The left arm mirrors it. */
const ARM: { shoulder: Vec3; elbow: Vec3; wrist: Vec3 } = {
  shoulder: [0, 0, 0],
  elbow: [0.2, -0.52, 0.3],
  wrist: [-0.26, -0.64, 0.78],
};
const mirror = (v: Vec3): Vec3 => [-v[0], v[1], v[2]];
const ARM_LEFT = { shoulder: ARM.shoulder, elbow: mirror(ARM.elbow), wrist: mirror(ARM.wrist) };
const TEMPLE_R: [Vec3, Vec3] = [[0.235, 0.07, 0.4], [0.39, 0.09, 0.05]];
const TEMPLE_L: [Vec3, Vec3] = [mirror(TEMPLE_R[0]), mirror(TEMPLE_R[1])];

/** Floating code glyphs: [text, position, size, phase]. */
const GLYPHS: [string, Vec3, number, number][] = [
  ["</>", [0.98, 1.3, 0.25], 0.42, 0],
  ["{ }", [-1.02, 0.18, 0.45], 0.32, 1.7],
  ["=>", [0.98, 0.12, 0.55], 0.28, 3.1],
];

/** Total height of the figure in model units; it is scaled to the DOM slot. */
const MODEL_HEIGHT = 2.55;

const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

interface DevAvatarProps {
  /** The DOM placeholder this figure is laid over (CSS controls size and position). */
  selector: string;
  hdr: boolean;
  animate: boolean;
  onHover?: (hovered: boolean) => void;
  onLoaded?: (ok: boolean) => void;
}

/**
 * A stylized 3D developer at his laptop, built from primitives (no assets to load).
 * He types, blinks, follows the pointer with his head and waves when hovered, while
 * a code window scrolls behind him. Like the rest of the hero it tracks a DOM
 * placeholder every frame, so layout, RTL and responsiveness stay in CSS.
 */
const DevAvatar = ({ selector, hdr, animate, onHover, onLoaded }: DevAvatarProps) => {
  const group = useRef<Group>(null);
  const body = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const eyes = useRef<(Mesh | null)[]>([]);
  const brows = useRef<Group>(null);
  const smile = useRef<Mesh>(null);
  const glyphs = useRef<(Mesh | null)[]>([]);
  const panel = useRef<Group>(null);
  const slot = useRef<HTMLElement | null>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const reveal = useRef(animate ? 0 : 1);
  const blinkAt = useRef(2);
  const { invalidate } = useThree();

  const glow = hdr ? 2.2 : 1;
  const m = useMemo(
    () => ({
      skin: new MeshStandardMaterial({ color: "#c98d68", roughness: 0.65 }),
      hair: new MeshStandardMaterial({ color: "#1c1512", roughness: 0.9 }),
      hoodie: new MeshStandardMaterial({ color: "#26262c", roughness: 0.85 }),
      accent: new MeshStandardMaterial({
        color: ACCENT,
        emissive: new Color(ACCENT),
        emissiveIntensity: 0.35 * glow,
        roughness: 0.4,
      }),
      dark: new MeshStandardMaterial({ color: "#0e0e10", roughness: 0.4 }),
      lips: new MeshStandardMaterial({ color: "#7d3a2b", roughness: 0.6 }),
      metal: new MeshStandardMaterial({ color: "#3a3c44", metalness: 0.7, roughness: 0.35 }),
      desk: new MeshStandardMaterial({ color: "#1d1613", roughness: 0.8 }),
      lens: new MeshStandardMaterial({ color: "#ffd9b8", transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.3 }),
    }),
    [glow]
  );

  const tex = useMemo(() => {
    const code = codeTexture();
    code.wrapT = RepeatWrapping;
    code.repeat.set(1, 0.38);
    return {
      code,
      window: windowTexture(),
      glyphs: GLYPHS.map(([text]) => glyphTexture(text)),
      logo: glyphTexture("</>"),
    };
  }, []);

  const flat = useMemo(() => {
    const emissive = (map: CanvasTexture, color: string, opacity = 1) =>
      new MeshBasicMaterial({
        map,
        color: new Color(color).multiplyScalar(glow),
        transparent: true,
        opacity,
        depthWrite: false,
        toneMapped: false,
        side: DoubleSide,
      });
    return {
      window: new MeshBasicMaterial({ map: tex.window, transparent: true, depthWrite: false, side: DoubleSide }),
      code: emissive(tex.code, "#ffffff", 0.95),
      logo: emissive(tex.logo, ACCENT_BRIGHT),
      glyphs: tex.glyphs.map((t) => {
        const mat = emissive(t, EMBER, 0.9);
        mat.blending = AdditiveBlending;
        return mat;
      }),
    };
  }, [tex, glow]);

  useEffect(
    () => () => {
      Object.values(m).forEach((x) => x.dispose());
    },
    [m]
  );
  useEffect(
    () => () => {
      [flat.window, flat.code, flat.logo, ...flat.glyphs].forEach((x) => x.dispose());
    },
    [flat]
  );
  useEffect(
    () => () => {
      [tex.code, tex.window, tex.logo, ...tex.glyphs].forEach((x) => x.dispose());
    },
    [tex]
  );

  // Nothing to download: the figure is procedural, so it is ready immediately.
  useEffect(() => {
    onLoaded?.(true);
    invalidate();
  }, [onLoaded, invalidate]);

  // Static mode: follow the placeholder when the page scrolls or resizes.
  useEffect(() => {
    if (animate) return;
    const redraw = () => invalidate();
    window.addEventListener("scroll", redraw, { passive: true });
    window.addEventListener("resize", redraw);
    return () => {
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("resize", redraw);
    };
  }, [animate, invalidate]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const g = group.current;
    const b = body.current;
    if (!g || !b) return;

    slot.current ??= document.querySelector<HTMLElement>(selector);
    const el = slot.current;
    if (!el) return;

    // Map the placeholder's screen rect onto the z = 0 plane.
    const { viewport, size: px, pointer } = state;
    const rect = el.getBoundingClientRect();
    const h = (rect.height / px.height) * viewport.height;
    g.position.set(
      ((rect.left + rect.width / 2) / px.width - 0.5) * viewport.width,
      (0.5 - (rect.top + rect.height / 2) / px.height) * viewport.height,
      0
    );

    hover.current += ((hovered.current ? 1 : 0) - hover.current) * Math.min(1, delta * 6);
    const e = hover.current;
    const t = state.clock.elapsedTime;

    if (animate) {
      if (loaderStore.get().done && reveal.current < 1) reveal.current = Math.min(1, reveal.current + delta * 0.8);

      // The whole desk turns a little toward the pointer; scrolling away tips it back.
      const exit = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      const k = Math.min(1, delta * 3);
      g.rotation.y += (pointer.x * 0.35 - g.rotation.y) * k;
      g.rotation.x += (-pointer.y * 0.12 + exit * 0.8 - g.rotation.x) * k;
      g.position.z = -exit * 2.5;

      // Breathing.
      torso.current?.scale.set(1, 1 + Math.sin(t * 1.6) * 0.012, 1);

      // Head follows the pointer (and looks straight at you when hovered).
      const hd = head.current;
      if (hd) {
        const ry = (pointer.x * 0.45 + Math.sin(t * 0.5) * 0.06) * (1 - e);
        const rx = -pointer.y * 0.2 + Math.sin(t * 2.4) * 0.015 - e * 0.08;
        hd.rotation.y += (ry - hd.rotation.y) * k;
        hd.rotation.x += (rx - hd.rotation.x) * k;
        hd.rotation.z = Math.sin(t * 0.7) * 0.03 + e * Math.sin(t * 3) * 0.05;
      }

      // Typing: shoulders twitch in an offset rhythm; on hover the right arm waves.
      if (armL.current) armL.current.rotation.x = Math.sin(t * 11) * 0.025 + Math.sin(t * 7.3) * 0.015;
      if (armR.current) {
        armR.current.rotation.x = Math.sin(t * 11 + 1.7) * 0.025 * (1 - e) - e * 0.9;
        armR.current.rotation.z = e * (2.1 + Math.sin(t * 9) * 0.3);
      }

      // Blink every few seconds.
      const closing = t > blinkAt.current && t < blinkAt.current + 0.14;
      if (t > blinkAt.current + 0.14) blinkAt.current = t + 2.5 + Math.random() * 3;
      eyes.current.forEach((eye) => eye?.scale.set(1, closing ? 0.12 : 1, 1));

      // Code scrolls behind him; faster while you're saying hi.
      tex.code.offset.y += delta * (0.06 + e * 0.25);
      if (panel.current) panel.current.position.y = 1.08 + Math.sin(t * 0.9) * 0.04;
      GLYPHS.forEach(([, pos, , phase], i) => {
        const gl = glyphs.current[i];
        if (!gl) return;
        gl.position.y = pos[1] + Math.sin(t * 1.1 + phase) * 0.08;
        gl.rotation.y = Math.sin(t * 0.6 + phase) * 0.4;
      });
    }

    if (brows.current) brows.current.position.y = e * 0.035;
    smile.current?.scale.set(1 + e * 0.4, 1 + e * 0.6, 1);
    m.accent.emissiveIntensity = (0.35 + e * 0.5) * glow;

    // Scale to the slot and pop in with a slight overshoot.
    const s = (h / MODEL_HEIGHT) * Math.max(0.001, easeOutBack(reveal.current));
    b.scale.setScalar(s);
    b.visible = reveal.current > 0;
  });

  const setHover = (value: boolean) => (ev: ThreeEvent<PointerEvent>) => {
    ev.stopPropagation();
    hovered.current = value;
    onHover?.(value);
  };

  return (
    <group ref={group}>
      {/* Lights for the figure; the rest of the scene uses unlit materials. */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 4, 5]} intensity={1.8} color="#fff1e6" />
      <directionalLight position={[2, 2, -4]} intensity={2.2} color={ACCENT} />

      <group ref={body} visible={false}>
        {/* Centered on the slot: the model spans roughly y = -0.85 .. 1.7 */}
        <group position={[0, -0.42, 0]}>
          <pointLight position={[0, -0.2, 0.6]} intensity={2.5} distance={4} color={EMBER} />

          {/* Torso: hoodie, hood around the neck, drawstrings */}
          <group ref={torso} position={[0, -0.3, 0]}>
            <mesh material={m.hoodie} scale={[1.25, 1, 0.8]}>
              <capsuleGeometry args={[0.5, 0.55, 8, 20]} />
            </mesh>
            <mesh material={m.hoodie} position={[0, 0.78, -0.12]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
              <torusGeometry args={[0.3, 0.11, 10, 28]} />
            </mesh>
            {[-0.1, 0.1].map((x) => (
              <mesh key={x} material={m.accent} position={[x, 0.48, 0.41]}>
                <cylinderGeometry args={[0.014, 0.014, 0.28, 6]} />
              </mesh>
            ))}
            <mesh material={m.accent} position={[0, 0.1, 0.405]} scale={[1, 1, 0.3]}>
              <boxGeometry args={[0.34, 0.06, 0.05]} />
            </mesh>
          </group>

          {/* Neck */}
          <mesh material={m.skin} position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.15, 0.17, 0.3, 14]} />
          </mesh>

          {/* Arms (pivot at the shoulders) */}
          <group ref={armR} position={[0.6, 0.05, 0.02]}>
            <Limb from={ARM.shoulder} to={ARM.elbow} radius={0.13} material={m.hoodie} />
            <Limb from={ARM.elbow} to={ARM.wrist} radius={0.115} material={m.hoodie} />
            <mesh material={m.skin} position={[ARM.wrist[0] - 0.03, ARM.wrist[1] - 0.02, ARM.wrist[2] + 0.07]}>
              <sphereGeometry args={[0.095, 14, 12]} />
            </mesh>
          </group>
          <group ref={armL} position={[-0.6, 0.05, 0.02]}>
            <Limb from={ARM_LEFT.shoulder} to={ARM_LEFT.elbow} radius={0.13} material={m.hoodie} />
            <Limb from={ARM_LEFT.elbow} to={ARM_LEFT.wrist} radius={0.115} material={m.hoodie} />
            <mesh material={m.skin} position={[ARM_LEFT.wrist[0] + 0.03, ARM_LEFT.wrist[1] - 0.02, ARM_LEFT.wrist[2] + 0.07]}>
              <sphereGeometry args={[0.095, 14, 12]} />
            </mesh>
          </group>

          {/* Head */}
          <group ref={head} position={[0, 1.02, 0]}>
            <group scale={[0.95, 1.06, 1]}>
              <mesh material={m.skin}>
                <sphereGeometry args={[0.4, 32, 28]} />
              </mesh>
              {/* Hair: cap tilted back, plus a swept quiff */}
              <mesh material={m.hair} position={[0, 0.03, -0.01]} rotation={[-0.75, 0, 0]}>
                <sphereGeometry args={[0.425, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              <mesh material={m.hair} position={[0.06, 0.33, 0.2]} rotation={[0.5, 0.2, -0.25]} scale={[1.7, 0.55, 1]}>
                <sphereGeometry args={[0.16, 16, 12]} />
              </mesh>
              {/* Short beard along the jaw + moustache */}
              <mesh material={m.hair}>
                <sphereGeometry args={[0.408, 32, 12, 0, Math.PI, Math.PI * 0.66, Math.PI * 0.26]} />
              </mesh>
              <mesh material={m.hair} position={[0, -0.12, 0.385]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.6]}>
                <capsuleGeometry args={[0.028, 0.13, 4, 8]} />
              </mesh>
            </group>

            {/* Ears and nose */}
            {[-1, 1].map((side) => (
              <mesh key={side} material={m.skin} position={[side * 0.385, 0, 0]} scale={[0.5, 1, 0.8]}>
                <sphereGeometry args={[0.085, 12, 10]} />
              </mesh>
            ))}
            <mesh material={m.skin} position={[0, -0.03, 0.4]} scale={[0.9, 1.1, 1]}>
              <sphereGeometry args={[0.058, 12, 10]} />
            </mesh>

            {/* Eyes, brows, smile */}
            {[-1, 1].map((side, i) => (
              <mesh
                key={side}
                ref={(el) => {
                  eyes.current[i] = el;
                }}
                material={m.dark}
                position={[side * 0.14, 0.07, 0.36]}
              >
                <sphereGeometry args={[0.04, 12, 10]} />
              </mesh>
            ))}
            <group ref={brows}>
              {[-1, 1].map((side) => (
                <mesh key={side} material={m.hair} position={[side * 0.14, 0.2, 0.37]} rotation={[-0.2, 0, side * -0.12]}>
                  <boxGeometry args={[0.13, 0.03, 0.04]} />
                </mesh>
              ))}
            </group>
            <mesh ref={smile} material={m.lips} position={[0, -0.19, 0.365]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.055, 0.013, 6, 16, Math.PI]} />
            </mesh>

            {/* Glasses */}
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.14, 0.07, 0.41]}>
                <mesh material={m.dark}>
                  <torusGeometry args={[0.095, 0.014, 8, 28]} />
                </mesh>
                <mesh material={m.lens}>
                  <circleGeometry args={[0.09, 24]} />
                </mesh>
              </group>
            ))}
            <mesh material={m.dark} position={[0, 0.08, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.012, 0.06, 4, 6]} />
            </mesh>
            <Limb from={TEMPLE_R[0]} to={TEMPLE_R[1]} radius={0.01} material={m.dark} />
            <Limb from={TEMPLE_L[0]} to={TEMPLE_L[1]} radius={0.01} material={m.dark} />

            {/* Headphones */}
            <mesh material={m.accent} position={[0, 0.03, -0.03]}>
              <torusGeometry args={[0.455, 0.032, 8, 40, Math.PI]} />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.44, 0.0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
                <mesh material={m.dark}>
                  <cylinderGeometry args={[0.13, 0.13, 0.1, 20]} />
                </mesh>
                <mesh material={m.accent} position={[0, -side * 0.052, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.01, 20]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Desk, mug and laptop */}
          <mesh material={m.desk} position={[0, -0.8, 0.6]}>
            <boxGeometry args={[2.1, 0.08, 1.3]} />
          </mesh>
          <group position={[-0.8, -0.65, 0.85]}>
            <mesh material={m.accent}>
              <cylinderGeometry args={[0.085, 0.075, 0.22, 16]} />
            </mesh>
            <mesh material={m.accent} position={[0.09, 0, 0]}>
              <torusGeometry args={[0.05, 0.015, 6, 14]} />
            </mesh>
          </group>
          <group position={[0, -0.74, 0.72]}>
            <mesh material={m.metal}>
              <boxGeometry args={[1.0, 0.035, 0.62]} />
            </mesh>
            {/* Lid hinged at the far edge, screen facing him, logo facing you */}
            <group position={[0, 0.02, 0.31]} rotation={[0.22, 0, 0]}>
              <mesh material={m.metal} position={[0, 0.32, 0]}>
                <boxGeometry args={[1.0, 0.64, 0.025]} />
              </mesh>
              <mesh material={flat.logo} position={[0, 0.34, 0.015]}>
                <planeGeometry args={[0.26, 0.26]} />
              </mesh>
            </group>
          </group>

          {/* Code window floating behind him */}
          <group ref={panel} position={[-0.62, 1.08, -0.65]} rotation={[0, 0.25, 0]}>
            <mesh material={flat.window}>
              <planeGeometry args={[1.05, 0.79]} />
            </mesh>
            <mesh material={flat.code} position={[0, -0.05, 0.005]}>
              <planeGeometry args={[0.95, 0.62]} />
            </mesh>
          </group>

          {/* Floating glyphs */}
          {GLYPHS.map(([text, pos, size], i) => (
            <mesh
              key={text}
              ref={(el) => {
                glyphs.current[i] = el;
              }}
              material={flat.glyphs[i]}
              position={pos}
            >
              <planeGeometry args={[size, size]} />
            </mesh>
          ))}

          {/* Invisible hit area for hover */}
          <mesh position={[0, 0.4, 0.3]} onPointerOver={setHover(true)} onPointerOut={setHover(false)}>
            <boxGeometry args={[1.7, 2.4, 1.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default DevAvatar;
