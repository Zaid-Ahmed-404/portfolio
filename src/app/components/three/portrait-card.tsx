"use client";

import { loaderStore } from "@/lib/store";
import { ACCENT } from "@/lib/theme";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, type Group, type Texture } from "three";
import OrbitRings from "./orbit-rings";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uReveal;
  uniform float uHover;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform vec3 uAccent;
  uniform float uHdr;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // A soft lens that follows the pointer while hovered.
    vec2 d = vUv - uMouse;
    vec2 uv = vUv - d * 0.05 * uHover * smoothstep(0.55, 0.0, length(d));
    vec3 tex = texture2D(uTexture, clamp(uv, 0.001, 0.999)).rgb;

    // Warm duotone grade (eased off on hover to reveal the true colors).
    float luma = dot(tex, vec3(0.299, 0.587, 0.114));
    vec3 graded = mix(vec3(0.02, 0.012, 0.01), vec3(1.0, 0.64, 0.42), luma);
    vec3 color = mix(tex, graded, 0.38 - 0.28 * uHover);

    // Focus vignette keeps the subject and quiets the busy event backdrop.
    float vig = smoothstep(0.95, 0.2, length((vUv - vec2(0.48, 0.6)) * vec2(1.3, 0.95)));
    color *= mix(0.22, 1.05, vig);

    // Forge glow rising from the bottom edge.
    color += uAccent * pow(1.0 - vUv.y, 6.0) * (0.22 + 0.3 * uHover);

    // Dissolve-in: burn through noise, with a molten edge.
    float n = fbm(vUv * 4.5 + vec2(0.0, uTime * 0.04));
    float edge = uReveal * 1.25 - 0.12;
    if (n > edge) discard;
    float burn = smoothstep(edge - 0.07, edge, n) * step(uReveal, 0.999);
    color = mix(color, uAccent * mix(1.6, 3.2, uHdr), burn);

    // Rounded corners + a thin glowing frame.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float sd = roundedBox(p, vec2(uAspect, 1.0) * 0.5, 0.045);
    float alpha = 1.0 - smoothstep(-0.0015, 0.0015, sd);
    float frame = smoothstep(0.005, 0.0, abs(sd + 0.004));
    color = mix(color, uAccent * mix(1.0, 2.0, uHdr), frame * (0.55 + 0.45 * uHover));

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

interface PortraitCardProps {
  src: string;
  /** The DOM placeholder this card is laid over (CSS controls size and position). */
  selector: string;
  hdr: boolean;
  animate: boolean;
  onHover?: (hovered: boolean) => void;
  onLoaded?: (ok: boolean) => void;
}

/**
 * The hero portrait as a WebGL card. It tracks a DOM placeholder every frame,
 * so layout, RTL and responsiveness stay in CSS, while the card adds depth:
 * pointer tilt, a dissolve-in reveal, warm grading and orbit rings.
 */
const PortraitCard = ({ src, selector, hdr, animate, onHover, onLoaded }: PortraitCardProps) => {
  const group = useRef<Group>(null);
  const card = useRef<Group>(null);
  const slot = useRef<HTMLElement | null>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [size, setSize] = useState(3);
  const { invalidate } = useThree();

  // Built imperatively so per-frame uniform writes go straight to the live material.
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTexture: { value: null as Texture | null },
          uTime: { value: 0 },
          uReveal: { value: animate ? 0 : 1 },
          uHover: { value: 0 },
          uAspect: { value: 0.8 },
          uMouse: { value: new Vector2(0.5, 0.5) },
          uAccent: { value: new Color(ACCENT) },
          uHdr: { value: hdr ? 1 : 0 },
        },
      }),
    [animate, hdr]
  );
  const uniforms = material.uniforms;

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    let alive = true;
    new TextureLoader().load(
      src,
      (t) => {
        if (!alive) return;
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        uniforms.uTexture.value = t;
        setTexture(t);
        onLoaded?.(true);
        invalidate();
      },
      undefined,
      () => onLoaded?.(false)
    );
    return () => {
      alive = false;
    };
  }, [src, uniforms, onLoaded, invalidate]);

  useEffect(() => () => texture?.dispose(), [texture]);

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
    const c = card.current;
    if (!g || !c) return;

    slot.current ??= document.querySelector<HTMLElement>(selector);
    const el = slot.current;
    if (!el) return;

    // Map the placeholder's screen rect onto the z = 0 plane.
    const { viewport, size: px, pointer } = state;
    const rect = el.getBoundingClientRect();
    const w = (rect.width / px.width) * viewport.width;
    const h = (rect.height / px.height) * viewport.height;
    g.position.set(
      ((rect.left + rect.width / 2) / px.width - 0.5) * viewport.width,
      (0.5 - (rect.top + rect.height / 2) / px.height) * viewport.height,
      0
    );
    c.scale.set(w, h, 1);
    uniforms.uAspect.value = w / h;
    if (Math.abs(h - size) > 0.01) setSize(h);

    // As the hero scrolls away, the card tips back and sinks into the scene.
    const exit = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));

    hover.current += ((hovered.current ? 1 : 0) - hover.current) * Math.min(1, delta * 5);
    uniforms.uHover.value = hover.current;

    if (animate) {
      const k = Math.min(1, delta * 3);
      g.rotation.y += (pointer.x * 0.32 - g.rotation.y) * k;
      g.rotation.x += (-pointer.y * 0.22 + exit * 0.9 - g.rotation.x) * k;
      g.position.z = -exit * 2.5 + hover.current * 0.35;
      uniforms.uTime.value = state.clock.elapsedTime;
      if (texture && loaderStore.get().done && uniforms.uReveal.value < 1) {
        uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + delta * 0.55);
      }
    }
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) uniforms.uMouse.value.copy(e.uv);
  };
  const setHover = (value: boolean) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = value;
    onHover?.(value);
  };

  return (
    <group ref={group}>
      <group ref={card} visible={!!texture}>
        <mesh material={material} onPointerOver={setHover(true)} onPointerOut={setHover(false)} onPointerMove={onMove}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      </group>
      <OrbitRings size={size} hdr={hdr} animate={animate} energy={hover} />
    </group>
  );
};

export default PortraitCard;
