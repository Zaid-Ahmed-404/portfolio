# Next.js Application

A modern web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 📁 Project Structure

```text
├── .github/             # GitHub Workflows / CI/CD actions
├── public/             # Static assets (images, SVGs, fonts)
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── components/ # Reusable UI components
│   │   ├── types/      # TypeScript interfaces and type declarations
│   │   ├── favicon.ico # Favicon icon
│   │   ├── globals.css # Global CSS & Tailwind styling
│   │   ├── (ar)/       # Arabic root layout + page, served at /
│   │   └── (en)/       # English root layout + page, served at /en/
│   ├── data/           # Language-independent content (links, tech names)
│   ├── i18n/           # Locale config + dictionaries (ar.ts, en.ts)
│   └── utils/          # Helper functions and utilities (e.g., image.ts)
├── .gitignore          # Git ignore file
└── eslint.config.mjs   # ESLint configuration
```

## 🌐 Languages

The site ships in **Arabic (default, RTL)** at `/` and **English** at `/en/`.
All visible copy lives in `src/i18n/dictionaries/` — `en.ts` defines the shape,
and `ar.ts` must match it (TypeScript enforces this). Brand names, links and
tech names stay shared in `src/data/content.ts` and `public/data/*.json`.

## For local installing

```bash
npm install
```

## For local running

```bash
npm run dev
```

