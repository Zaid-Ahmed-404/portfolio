"use client";

import type { Device } from "@/lib/device";
import { setSceneCursor } from "@/lib/store";
import { ACCENT, INK } from "@/lib/theme";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Sprite,
} from "three";

export interface SkillsSphereProps {
  device: Device;
  active: boolean;
  logos: { name: string; icon: string }[];
  tags: string[];
  dir: "ltr" | "rtl";
}

const RADIUS = 2.25;

/** Even points on a sphere (Fibonacci lattice). */
const fibonacci = (n: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return new Vector3(Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r);
  });

/* ---------- Canvas textures ---------- */

const makeLogoTexture = (src: string, onLoad: () => void) => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;

  const drawTile = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(22,19,15,0.14)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, size - 16, size - 16, 56);
    ctx.fill();
    ctx.stroke();
  };
  drawTile();

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    const box = size * 0.56;
    const w = img.naturalWidth || box;
    const h = img.naturalHeight || box;
    const scale = Math.min(box / w, box / h);
    drawTile();
    ctx.drawImage(img, (size - w * scale) / 2, (size - h * scale) / 2, w * scale, h * scale);
    texture.needsUpdate = true;
    onLoad();
  };
  img.src = src;
  return texture;
};

const makeTagTexture = (text: string, font: string) => {
  const height = 72;
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `500 30px ${font}`;
  const width = Math.ceil(measure.measureText(text).width + 56);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.strokeStyle = "rgba(234,88,12,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(2, 2, width - 4, height - 4, (height - 4) / 2);
  ctx.fill();
  ctx.stroke();
  ctx.font = `500 30px ${font}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2 + 1);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return { texture, aspect: width / height };
};

/* ---------- Scene ---------- */

type Item = {
  key: string;
  label: string;
  position: Vector3;
  texture: CanvasTexture;
  size: [number, number];
  logo: boolean;
};

const Sphere = ({ logos, tags, animate, dir }: { logos: SkillsSphereProps["logos"]; tags: string[]; animate: boolean; dir: "ltr" | "rtl" }) => {
  const group = useRef<Group>(null);
  const sprites = useRef<(Sprite | null)[]>([]);
  const hovered = useRef(-1);
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const { gl, invalidate } = useThree();
  const auto = (dir === "rtl" ? -1 : 1) * 0.16;

  const items = useMemo<Item[]>(() => {
    const css = getComputedStyle(document.body);
    // Plex after the mono face so Arabic tags (e.g. ZATCA in Arabic) get the Arabic font.
    const font = [css.getPropertyValue("--font-geist-mono"), css.getPropertyValue("--font-plex-arabic"), "monospace"]
      .map((f) => f.trim())
      .filter(Boolean)
      .join(", ");
    const total = logos.length + tags.length;
    const points = fibonacci(total, RADIUS);
    const logoSlots = new Set(logos.map((_, i) => Math.round((i + 0.5) * (total / logos.length))));
    const slotList = [...logoSlots].map((s) => Math.min(total - 1, s));

    let tagIndex = 0;
    return points.map((position, i) => {
      const logoIndex = slotList.indexOf(i);
      if (logoIndex !== -1 && logos[logoIndex]) {
        const logo = logos[logoIndex];
        return { key: `l-${i}`, label: logo.name, position, texture: makeLogoTexture(logo.icon, invalidate), size: [0.62, 0.62], logo: true };
      }
      const label = tags[tagIndex++ % tags.length];
      const { texture, aspect } = makeTagTexture(label, font);
      return { key: `t-${i}`, label, position, texture, size: [0.27 * aspect, 0.27], logo: false };
    });
  }, [logos, tags, invalidate]);

  useEffect(() => () => items.forEach((i) => i.texture.dispose()), [items]);

  const wire = useMemo(() => {
    const geometry = new EdgesGeometry(new IcosahedronGeometry(RADIUS * 0.96, 2));
    const material = new LineBasicMaterial({
      color: new Color(INK),
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const coreGeometry = new EdgesGeometry(new IcosahedronGeometry(0.42, 0));
    const coreMaterial = new LineBasicMaterial({ color: new Color(ACCENT), transparent: true, opacity: 0.9 });
    return { geometry, material, coreGeometry, coreMaterial };
  }, []);

  useEffect(
    () => () => {
      wire.geometry.dispose();
      wire.material.dispose();
      wire.coreGeometry.dispose();
      wire.coreMaterial.dispose();
    },
    [wire]
  );

  // Drag to rotate (pointer events on the canvas; vertical touch still scrolls the page).
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    let last: { x: number; y: number } | null = null;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current || !last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      velocity.current.y = dx * 0.006;
      velocity.current.x = e.pointerType === "mouse" ? dy * 0.006 : 0;
      if (group.current) {
        group.current.rotation.y += velocity.current.y;
        group.current.rotation.x = Math.max(-0.7, Math.min(0.7, group.current.rotation.x + velocity.current.x));
      }
      invalidate();
    };
    const up = () => {
      dragging.current = false;
      last = null;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl, invalidate]);

  const world = useMemo(() => new Vector3(), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const g = group.current;
    if (!g) return;

    if (!dragging.current) {
      // Inertia settles back into a slow idle spin.
      const v = velocity.current;
      v.y += ((animate ? auto * delta : 0) - v.y) * Math.min(1, delta * 2.5);
      v.x *= 1 - Math.min(1, delta * 3);
      g.rotation.y += v.y;
      g.rotation.x = Math.max(-0.7, Math.min(0.7, g.rotation.x + v.x));
      if (!animate && (Math.abs(v.y) > 1e-4 || Math.abs(v.x) > 1e-4)) state.invalidate();
    }

    // Depth cue: items at the back fade and shrink.
    sprites.current.forEach((sprite, i) => {
      if (!sprite) return;
      sprite.getWorldPosition(world);
      const depth = (world.z / RADIUS + 1) / 2; // 0 back → 1 front
      const item = items[i];
      const hover = hovered.current === i ? 1.25 : 1;
      const s = (0.7 + depth * 0.3) * hover;
      sprite.scale.set(item.size[0] * s, item.size[1] * s, 1);
      sprite.material.opacity = 0.12 + depth * 0.88;
    });
  });

  const over = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = i;
    setSceneCursor("drag", items[i].label);
    invalidate();
  };
  const out = (i: number) => () => {
    if (hovered.current === i) hovered.current = -1;
    setSceneCursor(null);
    invalidate();
  };

  return (
    <group ref={group} rotation={[0.25, 0, 0]}>
      <lineSegments geometry={wire.geometry} material={wire.material} />
      <lineSegments geometry={wire.coreGeometry} material={wire.coreMaterial} />
      {items.map((item, i) => (
        <sprite
          key={item.key}
          ref={(el) => {
            sprites.current[i] = el;
          }}
          position={item.position}
          scale={[item.size[0], item.size[1], 1]}
          renderOrder={item.logo ? 2 : 1}
          onPointerOver={over(i)}
          onPointerOut={out(i)}
        >
          <spriteMaterial map={item.texture} transparent depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
    </group>
  );
};

const SkillsSphere = ({ device, active, logos, tags, dir }: SkillsSphereProps) => {
  const animate = !device.reducedMotion;
  const [ready, setReady] = useState(false);

  useEffect(() => () => setSceneCursor(null), []);

  return (
    <Canvas
      className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      frameloop={!active ? "never" : animate ? "always" : "demand"}
      dpr={device.dpr}
      camera={{ position: [0, 0, 8.2], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => setReady(true)}
    >
      <Sphere logos={logos} tags={tags} animate={animate} dir={dir} />
    </Canvas>
  );
};

export default SkillsSphere;
