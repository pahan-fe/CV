# Pavel Zagvozdin — CV

Personal CV website built with Nuxt 4, TypeScript, and Canvas 2D effects.

**Live:** [pahanz.dev](https://www.pahanz.dev/)

## Tech Stack

- **Framework:** Nuxt 4, Vue 3, TypeScript
- **Fonts:** Darker Grotesque, DM Sans, JetBrains Mono
- **Effects:** Canvas 2D (starfield / symbiotes), CSS conic-gradient animations
- **PWA:** Offline support via Workbox
- **SEO:** Schema.org, Open Graph, sitemap, robots.txt
- **Deploy:** Vercel

## Setup

```bash
yarn install
yarn dev
```

## Build

```bash
yarn build
node .output/server/index.mjs
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Development server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn lint` | Run ESLint |
| `yarn typecheck` | Run type checking |
