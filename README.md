# Zaid Ahmed — Portfolio

An immersive 3D portfolio built with **Next.js (App Router, static export)**, **Tailwind CSS v4**,
**three.js** (via React Three Fiber), **GSAP + ScrollTrigger**, **Lenis** and **Framer Motion**.
Deployed to GitHub Pages at `/portfolio`.

---

## 📁 Project Structure

```text
├── .github/workflows/      # GitHub Pages deploy (npm ci → next build → ./out)
├── public/
│   ├── data/               # page-data.json, work-data.json, resume PDF
│   └── images/             # PNG/JPEG sources + generated .webp (what the site loads)
├── scripts/
│   └── optimize-images.mjs # PNG → resized WebP for the project screenshots
└── src/
    ├── app/
    │   ├── (en)/ (ar)/     # English at /, Arabic (RTL) at /ar/
    │   ├── fonts.ts        # Syne (display), Geist, Geist Mono, IBM Plex Sans Arabic
    │   ├── globals.css     # Theme tokens, glass, grain, split-text, reveal, Lenis CSS
    │   └── components/
    │       ├── fx/         # Global motion layer
    │       │   ├── smooth-scroll.tsx  # Lenis ↔ GSAP ticker ↔ ScrollTrigger
    │       │   ├── loader.tsx         # Intro with real progress % (fonts + hero first frame, ≤2s)
    │       │   ├── cursor.tsx         # Custom cursor (links, data-cursor, 3D objects)
    │       │   ├── split-title.tsx    # Staggered letter reveal (whole words for Arabic)
    │       │   ├── counter.tsx · magnetic.tsx · tilt.tsx · reveal.tsx
    │       ├── three/      # WebGL — always loaded with next/dynamic({ ssr: false })
    │       │   ├── hero-scene.tsx     # Hero + About backdrop: embers, bloom
        │       │   ├── orbit-rings.tsx    # Tilted orbits with travelling satellites
    │       │   ├── embers.tsx         # GPU-animated rising ember particles
    │       │   ├── skills-sphere.tsx  # Draggable sphere of skill logos and tags
    │       │   ├── work-distortion.tsx# Shader overlay for the cursor-following project preview
    │       │   ├── contact-scene.tsx  # Orbits around the CTA + a thinner ember field
    │       │   └── use-scene-gate.ts  # Lazy-mount near viewport + pause off-screen + tier gating
    │       ├── home/       # Sections: journey (hero+about wrapper), hero-section, about-me,
    │       │               # experience-sec, education-skills, latest-work, certificates, contact
    │       ├── layout/     # header, footer, logo
    │       └── shared/     # icons, copy-email, language-switch, rich-text, section-heading
    ├── data/content.ts     # Language-independent data (links, tech names, projects)
    ├── i18n/               # Locale config + dictionaries (en.ts defines the shape, ar.ts matches)
    ├── lib/                # device tiers, GSAP/Lenis handles, shared stores, theme colors
    └── utils/image.ts      # basePath-aware asset paths
```

## 🌐 Languages

The site ships in **English (default)** at `/` and **Arabic (RTL)** at `/ar/`.
All visible copy lives in `src/i18n/dictionaries/` — `en.ts` defines the shape,
and `ar.ts` must match it (TypeScript enforces this). Brand names, links and
tech names stay shared in `src/data/content.ts` and `public/data/*.json`.

RTL is handled with logical properties and `rtl:` variants. The work index and the skills sphere's idle
spin mirror for Arabic.

Fonts: Syne (display) and Geist (body) come first in every stack, IBM Plex Sans Arabic
after them. The Latin fonts set `adjustFontFallback: false` because their generated
fallback face is `local(Arial)`, which has Arabic glyphs and would otherwise beat Plex.

## ⚡ Performance & accessibility

- **Device tiers** (`src/lib/device.ts`): `high` (full scenes + post-processing),
  `mobile` (fewer particles, no post-processing, DPR ≤ 1.5) and `fallback` (no WebGL,
  software rendering, low memory or Save-Data → static gradients). DPR is capped at 2.
- Every scene is code-split, mounts only when its section nears the viewport, and
  switches to `frameloop="never"` when off-screen. The work overlay runs on `"demand"`.
- `prefers-reduced-motion`: no Lenis, no custom cursor, no preview lag,
  static 3D frames, no reveal animations.
- All content is server-rendered HTML; the canvases are decorative (`aria-hidden`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 (no basePath in development)
```

Other scripts:

```bash
npm run build      # static export to ./out (uses the /portfolio basePath)
npm run typecheck
npm run images     # regenerate .webp files after adding/replacing PNGs in public/images/work
```

To add a project: drop the PNG in `public/images/work/`, run `npm run images`, and add an
entry to `public/data/work-data.json` pointing at the `.webp` file.

## Deploy to GitHub Pages

Pushing to `main` runs `.github/workflows/nextjs.yml`, which builds and publishes `./out`.
In the repository settings, **Pages → Source** must be set to **GitHub Actions**.
The `/portfolio` basePath in `next.config.ts` must match the repository name.
