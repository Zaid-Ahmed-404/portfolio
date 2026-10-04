"use client";

import type { Device } from "@/lib/device";
import { workHoverStore } from "@/lib/store";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, type Mesh, type Texture } from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uAlpha;
  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uMouse;
  uniform vec2 uFrac;   // visible fraction of the image (object-fit: cover)
  uniform vec2 uRes;    // frame size in px
  uniform float uRadius;
  varying vec2 vUv;

  // object-fit: cover; object-position: top
  vec2 cover(vec2 uv) {
    return vec2(0.5 + (uv.x - 0.5) * uFrac.x, 1.0 - (1.0 - uv.y) * uFrac.y);
  }

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 d = vUv - uMouse;
    d.x *= aspect;
    float dist = length(d);

    // A lens around the pointer + a decaying ripple + a slow liquid wave.
    float lens = smoothstep(0.5, 0.0, dist);
    float ripple = sin(dist * 26.0 - uTime * 4.5) * exp(-dist * 4.0);
    vec2 dir = d / max(dist, 1e-4);
    vec2 offset = dir * (ripple * 0.010 + lens * 0.035) * uStrength;
    offset.x /= aspect;
    offset += vec2(sin(vUv.y * 9.0 + uTime * 1.4), cos(vUv.x * 7.0 + uTime * 1.1)) * 0.004 * uStrength;

    vec2 st = vUv - offset;
    float shift = (0.002 + lens * 0.006) * uStrength;
    float r = texture2D(uTexture, cover(st + vec2(shift, 0.0))).r;
    float g = texture2D(uTexture, cover(st)).g;
    float b = texture2D(uTexture, cover(st - vec2(shift, 0.0))).b;

    vec2 px = (vUv - 0.5) * uRes;
    float mask = 1.0 - smoothstep(-1.0, 0.5, roundedBox(px, uRes * 0.5, uRadius));

    gl_FragColor = vec4(r, g, b, uAlpha * mask);
    #include <colorspace_fragment>
  }
`;

const textureCache = new Map<string, Texture>();
const loader = new TextureLoader();

const loadTexture = (src: string, onReady: (t: Texture) => void) => {
  const cached = textureCache.get(src);
  if (cached?.image) return onReady(cached);
  loader.load(src, (texture) => {
    texture.colorSpace = SRGBColorSpace;
    textureCache.set(src, texture);
    onReady(texture);
  });
};

const DistortionPlane = () => {
  const mesh = useRef<Mesh>(null);
  const { size, invalidate } = useThree();

  const state = useRef({
    src: "",
    texture: null as Texture | null,
    alpha: 0,
    strength: 0,
    mouse: new Vector2(0.5, 0.5),
    pointer: new Vector2(0.5, 0.5),
    radius: 0,
    lastEl: null as HTMLElement | null,
    lastX: 0,
    lastY: 0,
    velocity: 0,
  });

  // Built imperatively so per-frame uniform writes go straight to the live material.
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTexture: { value: null as Texture | null },
          uAlpha: { value: 0 },
          uTime: { value: 0 },
          uStrength: { value: 0 },
          uMouse: { value: new Vector2(0.5, 0.5) },
          uFrac: { value: new Vector2(1, 1) },
          uRes: { value: new Vector2(1, 1) },
          uRadius: { value: 0 },
        },
      }),
    []
  );
  const uniforms = material.uniforms;

  useEffect(() => () => material.dispose(), [material]);

  // Wake the (demand-driven) loop whenever hover state changes.
  useEffect(() => workHoverStore.subscribe(() => invalidate()), [invalidate]);

  useFrame((frame, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const s = state.current;
    const { el, src, mouse } = workHoverStore.get();

    if (el && src !== s.src) {
      s.src = src;
      s.radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      loadTexture(src, (texture) => {
        if (s.src !== src) return;
        // Swapping images (moving to another project) sends a ripple through the frame.
        if (s.texture && s.texture !== texture) s.strength = 1.2;
        s.texture = texture;
        uniforms.uTexture.value = texture;
        invalidate();
      });
    }
    if (el) s.lastEl = el;

    const target = s.lastEl;
    // Keep showing the previous image until the next one has loaded (no flicker between rows).
    const visible = !!el && !!s.texture;
    s.alpha += ((visible ? 1 : 0) - s.alpha) * Math.min(1, delta * (visible ? 6 : 8));
    // A burst on enter that settles to a gentle, pointer-following distortion.
    s.strength += ((visible ? 0.55 : 0) - s.strength) * Math.min(1, delta * 3);
    s.mouse.lerp(s.pointer.set(mouse[0], mouse[1]), Math.min(1, delta * 8));

    if (target && mesh.current && s.texture) {
      const rect = target.getBoundingClientRect();

      // A moving frame (e.g. a cursor-following preview) warps with its speed.
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const speed = Math.hypot(cx - s.lastX, cy - s.lastY) / Math.max(delta, 1e-3);
      s.lastX = cx;
      s.lastY = cy;
      s.velocity += (Math.min(speed / 1500, 1) - s.velocity) * Math.min(1, delta * 6);
      mesh.current.position.set(rect.left + rect.width / 2 - size.width / 2, size.height / 2 - (rect.top + rect.height / 2), 0);
      mesh.current.scale.set(rect.width, rect.height, 1);

      const image = s.texture.image as { width: number; height: number };
      const scale = Math.max(rect.width / image.width, rect.height / image.height);
      uniforms.uFrac.value.set(rect.width / (image.width * scale), rect.height / (image.height * scale));
      uniforms.uRes.value.set(rect.width, rect.height);
      uniforms.uRadius.value = s.radius;
    }

    uniforms.uAlpha.value = s.alpha;
    uniforms.uStrength.value = s.strength + (1 - s.alpha) * 0.6 + s.velocity * 0.9;
    uniforms.uMouse.value.copy(s.mouse);
    uniforms.uTime.value = frame.clock.elapsedTime;

    if (mesh.current) mesh.current.visible = s.alpha > 0.002;
    if (el || s.alpha > 0.002) invalidate();
    else s.lastEl = null;
  });

  return (
    <mesh ref={mesh} material={material} visible={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

/** Fixed, click-through overlay that renders the hovered project image with a shader distortion. */
const WorkDistortion = ({ device, active }: { device: Device; active: boolean }) => (
  <Canvas
    orthographic
    camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
    frameloop={active ? "demand" : "never"}
    dpr={device.dpr}
    gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none" }}
  >
    <DistortionPlane />
  </Canvas>
);

export default WorkDistortion;
