# ATLAS — The Imagined City

An immersive Mediterranean city experience built with React, Vite and Three.js.

## Visual direction

Contemporary Mediterranean architecture, warm ivory stone, terracotta roofs, olive greenery, winding walkable streets, coastal atmosphere and golden-hour lighting.

## Stack

- React + Vite
- Three.js + OrbitControls
- lucide-react
- Responsive editorial interface

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## City plan

Eight connected districts orbit the Grand Piazza: Old Quarter, Grand Piazza, Villa Terraces, Garden Quarter, Atelier District, Market Arcade, Sunset Heights and Observatory Hill.

## Repository guide

- `src/Atlas.jsx` — application, district data and procedural Three.js scene.
- `src/styles.css` — editorial UI and responsive styles.
- `public/atlas-mark.svg` — custom ATLAS favicon.
- `ATLAS_ASSET_REGISTER.md` — generated 3D asset task IDs and export status.
- `ANTIGRAVITY_PROMPT.md` — detailed implementation, quality and deployment handoff.
- `.github/workflows/ci.yml` — automated production build check.

## 3D assets

The current city uses procedural geometry as its reliable fallback. Generated Meshy models have not yet been integrated because Meshy rejected GLB downloads on the current plan with an upgrade-required message. See the asset register for task IDs and the integration rules.

## Deployment

The intended deployment is Vercel with the GitHub repository connected, Vite framework detection, root directory `/`, build command `npm run build`, and output directory `dist`. The connected Vercel integration returned a permission error when trying to create the project, so no live URL is claimed here.

## Antigravity handoff

Open `ANTIGRAVITY_PROMPT.md` and use it as the implementation brief. Continue from the existing code; do not start a fresh project or discard the existing city.
