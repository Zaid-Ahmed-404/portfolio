"use client";

import { ACCENT, EMBER } from "@/lib/theme";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from "three";

const vertexShader = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uRise;
  uniform float uTime;
  uniform float uHeight;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec3 p = position;
    // Each ember rises at its own pace and wraps around; a slow sway keeps it alive.
    p.y = mod(p.y + uRise * (0.4 + aSeed * 0.9), uHeight) - uHeight * 0.5;
    p.x += sin(uTime * 0.6 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.4 + aSeed * 23.0) * 0.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (14.0 / -mv.z);

    float life = p.y / uHeight + 0.5; // 0 at the bottom, 1 at the top
    vAlpha = smoothstep(0.0, 0.2, life) * (1.0 - smoothstep(0.55, 1.0, life));
    vHeat = aSeed;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.8);
    vec3 color = mix(uColorA, uColorB, vHeat * vHeat) * uIntensity;
    gl_FragColor = vec4(color, a * vAlpha);
  }
`;

interface EmbersProps {
  count: number;
  /** Push colors above 1.0 so the bloom pass catches them. */
  hdr: boolean;
  animate: boolean;
  /** Box the embers live in: [width, height, depth]; centered on the origin, depth towards -z. */
  bounds?: [number, number, number];
  /** Rise faster while the page scrolls. */
  scrollBoost?: boolean;
}

/** Rising ember particles, animated entirely on the GPU (one draw call). */
const DEFAULT_BOUNDS: [number, number, number] = [18, 12, 12];

const Embers = ({ count, hdr, animate, bounds = DEFAULT_BOUNDS, scrollBoost = false }: EmbersProps) => {
  const [w, h, d] = bounds;
  const { gl, invalidate } = useThree();
  const rise = useRef(0);
  const lastScroll = useRef(0);
  const boost = useRef(0);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    let s = 1234567;
    const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * w;
      positions[i * 3 + 1] = rand() * h;
      positions[i * 3 + 2] = 4 - rand() * d;
      seeds[i] = rand();
      sizes[i] = 0.6 + Math.pow(rand(), 3) * 3.2;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uRise: { value: 0 },
        uTime: { value: 0 },
        uHeight: { value: h },
        uPixelRatio: { value: 1 },
        uColorA: { value: new Color(ACCENT) },
        uColorB: { value: new Color(EMBER) },
        uIntensity: { value: hdr ? 2.6 : 1.1 },
      },
    });
    return { geometry, material };
  }, [count, hdr, w, h, d]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );

  useEffect(() => {
    lastScroll.current = window.scrollY;
    if (animate || !scrollBoost) return;
    // Static mode: still redraw when the page moves underneath.
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animate, scrollBoost, invalidate]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    if (!animate) return;

    if (scrollBoost) {
      const y = window.scrollY;
      const velocity = Math.abs(y - lastScroll.current) / Math.max(delta, 1e-3);
      lastScroll.current = y;
      boost.current += (Math.min(velocity / 400, 6) - boost.current) * Math.min(1, delta * 4);
    }

    rise.current += delta * (0.45 + boost.current);
    material.uniforms.uRise.value = rise.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
};

export default Embers;
