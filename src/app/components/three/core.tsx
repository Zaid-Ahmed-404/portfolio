"use client";

import { ACCENT, ACCENT_BRIGHT, BG, CORE, EMBER } from "@/lib/theme";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  Color,
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  ShaderMaterial,
  type LineSegments,
  type Mesh,
} from "three";

/* Simplex noise (Ashima Arts / Ian McEwan, MIT). */
const noise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  ${noise}

  float field(vec3 p) {
    return snoise(p * 1.15 + uTime * 0.22) + snoise(p * 2.4 - uTime * 0.16) * 0.2;
  }

  vec3 displace(vec3 dir) {
    return dir * (1.0 + field(dir) * uAmp);
  }

  void main() {
    vec3 n = normalize(position);
    // Normals are rebuilt from two displaced neighbours, so the lighting follows the surface.
    vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = cross(n, t);
    float e = 0.02;
    vec3 p = displace(n);
    vec3 pt = displace(normalize(n + t * e));
    vec3 pb = displace(normalize(n + b * e));

    vNoise = field(n);
    vNormal = normalMatrix * normalize(cross(pt - p, pb - p));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uRim;
  uniform vec3 uHot;
  uniform vec3 uBg;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    vec3 L = normalize(vec3(0.55, 0.8, 0.6));

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);
    float diffuse = max(dot(N, L), 0.0);
    float specular = pow(max(dot(N, normalize(L + V)), 0.0), 70.0);
    // Glaze pools in the valleys of the surface and gathers along its silhouette.
    float seam = smoothstep(-0.18, -0.68, vNoise);

    vec3 color = uBase * (0.62 + diffuse * 0.5);
    color = mix(color, mix(uHot, uRim, seam), seam * 0.92);
    color = mix(color, uRim, fresnel * 0.8);
    color += vec3(1.0) * specular * 0.5;

    gl_FragColor = vec4(mix(uBg, color, uGlow), 1.0);
    #include <colorspace_fragment>
  }
`;

/** What the rig drives every frame. */
export type CoreState = {
  /** 0..1 — how present the core is (it fades into the page background). */
  glow: number;
  /** Surface displacement amplitude. */
  amp: number;
};

interface CoreProps {
  state: RefObject<CoreState>;
  /** Icosahedron subdivisions. */
  detail: number;
  animate: boolean;
}

/** The site's centerpiece: a slowly churning porcelain sphere, glazed orange, inside a wire shell. Radius ≈ 1. */
const Core = ({ state, detail, animate }: CoreProps) => {
  const blob = useRef<Mesh>(null);
  const shell = useRef<LineSegments>(null);

  const { geometry, material, shellGeometry, shellMaterial } = useMemo(() => {
    const geometry = new IcosahedronGeometry(1, detail);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.2 },
        uGlow: { value: 1 },
        uBase: { value: new Color(CORE) },
        uRim: { value: new Color(ACCENT) },
        uHot: { value: new Color(EMBER) },
        uBg: { value: new Color(BG) },
      },
    });
    const shellGeometry = new EdgesGeometry(new IcosahedronGeometry(1.42, 1));
    const shellMaterial = new LineBasicMaterial({
      color: new Color(ACCENT_BRIGHT),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    return { geometry, material, shellGeometry, shellMaterial };
  }, [detail]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
    },
    [geometry, material, shellGeometry, shellMaterial]
  );

  useFrame((frame, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { glow, amp } = state.current;
    material.uniforms.uGlow.value = glow;
    material.uniforms.uAmp.value = amp;
    shellMaterial.opacity = 0.4 * glow * glow;
    if (!animate) return;

    material.uniforms.uTime.value = frame.clock.elapsedTime;
    if (blob.current) blob.current.rotation.y += delta * 0.1;
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.07;
      shell.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <>
      <mesh ref={blob} geometry={geometry} material={material} />
      <lineSegments ref={shell} geometry={shellGeometry} material={shellMaterial} />
    </>
  );
};

export default Core;
