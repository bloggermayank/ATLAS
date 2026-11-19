# ATLAS — Antigravity Build & Finish Brief

You are taking over an existing project. **Continue and finish the current ATLAS website; do not restart, replace the design, or create a fresh Vite app.** Inspect the current implementation first, preserve its working parts, then implement, test, and deploy the finished experience.

## 1. Project identity

- Project: **ATLAS — The Imagined City**
- GitHub repository: https://github.com/bloggermayank/ATLAS
- Production branch: `main`
- Stack: React + Vite + Three.js + OrbitControls + lucide-react
- Main application: `src/Atlas.jsx`
- Main styles: `src/styles.css`
- Entry point: `src/main.jsx`
- HTML shell: `index.html`
- Brand asset: `public/atlas-mark.svg`
- Existing build check: `.github/workflows/ci.yml`

Do not use Figma. Work directly from the repository.

## 2. Creative direction — non-negotiable

Create a **contemporary, believable Mediterranean coastal town**, not a cartoon, low-poly toy town, generic game map, or generic SaaS landing page.

Art direction:
- Realistic Mediterranean architecture, warm golden-hour sunlight.
- Ivory limestone, aged pale plaster, travertine paving and muted terracotta roofs.
- Olive trees, cypress accents, bougainvillea, small planted courtyards and shaded arcades.
- Arches, loggias, balconies, stone stairways, terraces and winding pedestrian lanes.
- A visible coast, calm blue-green sea and distant horizon.
- Soft atmospheric haze, natural shadows and a warm editorial colour grade.
- Refined editorial typography: Playfair Display for expressive headings, DM Sans for UI/body.
- UI palette should remain restrained: limestone paper, forest green, burnt terracotta, muted gold and deep olive.
- The 3D world is the centrepiece. The website UI should frame it elegantly without covering the city.

The site should feel like entering a real place and slowly discovering its neighbourhoods. Avoid excessive cards, dashboards, gradients, glowing sci-fi elements, emoji UI, loud gamification or unnecessary interface chrome.

## 3. Approved city plan — keep all eight connected districts

Grand Piazza is the central civic hub. All districts must connect through walkable streets and paths; do not turn them into separate isolated levels or teleport-only scenes.

1. **Old Quarter** — northwest; narrow heritage lanes, intimate courtyards and older stone façades.
2. **Grand Piazza** — centre; generous stone square and sculptural fountain.
3. **Villa Terraces** — south; stepped hillside residences, gardens, loggias and sea-facing terraces.
4. **Garden Quarter** — north; botanical paths, olive groves, fountains and shaded walks.
5. **Atelier District** — east; expressive contemporary architecture, workshops and galleries.
6. **Market Arcade** — west; three-arch market passage, small shops, cafés and public life.
7. **Sunset Heights** — southwest; belvederes and panoramic terraces.
8. **Observatory Hill** — northeast; signature pavilion and elevated lookout.

Keep the district names, descriptions and general layout already represented in `src/Atlas.jsx`. You may refine coordinates, scale and pathing to make the actual 3D town coherent, but retain the eight-district concept.

## 4. Current repository — inspect before editing

Read these files before making changes:
- `src/Atlas.jsx`
- `src/styles.css`
- `src/main.jsx`
- `index.html`
- `package.json`
- `package-lock.json`
- `README.md`
- `ATLAS_ASSET_REGISTER.md`

The current site already includes:
- Editorial hero section and navigation.
- Interactive Three.js city canvas with OrbitControls.
- Day/night lighting toggle.
- Eight-district directory and selected-district information panel.
- District selection and animated camera focus.
- Responsive CSS.
- Procedural building, roof, window, paving, fountain, lookout, tree and coastline stand-ins.

Preserve and improve this. Do not remove existing sections just to make the build easier.

## 5. Meshy asset register and integration rules

These are real generated Meshy task IDs. Use them to identify models in the Meshy workspace; do not invent public model URLs.

| Asset | Geometry task | Texture task | Notes |
|---|---|---|---|
| Observatory Pavilion | `01a1efab-e041-76a0-8ea3-98b18cc7d667` | `01a1efae-0c76-7429-9d77-4026eb208012` | Signature hilltop landmark, geometry and texture completed |
| Grand Piazza Fountain | `01a1f1ab-1664-71d9-9fa8-10eea7d4c8be` | `01a1f1b0-5d3e-7532-8605-a39c0475720e` | Geometry and texture completed |
| Old Quarter Townhouse | `01a1f1b2-122c-71f0-bf93-0e56e53988da` | `01a1f1b2-cf05-7302-afea-cca2ac6a4044` | Geometry and texture completed; inspect mesh dimensions carefully |
| Market Arcade | `01a1f1b6-d881-77d0-946e-5a0b83eeae86` | `01a1f1b9-40d8-71ec-9e80-c0afb97e6c01` | Geometry and texture completed |
| Villa Terraces Villa | `01a1f1bb-39e6-7507-a00f-9bfed8377db2` | To be generated after geometry succeeds | Geometry task was in progress at handoff time |

**Critical export constraint:** a GLB download attempt from the connected Meshy account returned an upgrade-required error. The models have not been integrated into the repository yet. Do not pretend they are in `public/models`, do not fetch expiring Meshy preview URLs as if they were production assets, and do not create fake model files. The user may need to export/download GLBs from Meshy after the plan restriction is resolved.

Townhouse generated dimensions were approximately **0.984 × 1.000 × 0.088**. This is an unusually thin façade-like result. Do not use it as a full-depth building without inspecting its geometry, normals, UVs, and thickness. It may be more appropriate as a façade layer. The fountain dimensions were approximately **1.90 × 1.50 × 1.90**. Market Arcade geometry dimensions were approximately **1.00 × 0.70 × 1.00**. Normalize all imported model scales from their bounding boxes; never assume a common unit scale across generated models.

When GLBs become available:
1. Put them in a clear folder such as `public/models/` with descriptive names.
2. Add a small asset manifest (filename, intended district, base scale, rotation, offset).
3. Load using Three.js `GLTFLoader`.
4. Normalize each imported model using `Box3` / its bounding box, with editable per-asset scale and rotation overrides.
5. Enable shadows and correctly handle material colour space, roughness, metalness, and texture maps.
6. Keep procedural fallbacks so the city remains fully usable if a GLB is missing or fails to load.
7. Dispose geometry, materials and textures correctly on teardown.
8. Only remove a procedural landmark after the GLB has been confirmed to render correctly on desktop and mobile.

## 6. Required technical work

### A. Make the 3D city feel like a cohesive place
- Improve terrain and district elevation transitions. Introduce gentle rolling ground and stepped terraces where appropriate.
- Replace obvious repeated box clusters with varied Mediterranean building typologies: narrow townhouse, courtyard house, villa, market arcade, studio/gallery, garden pavilion and landmark.
- Give buildings believable façade depth, roof thickness, window recesses, balconies, stairs, parapets, chimneys and occasional awnings.
- Improve the street network so every neighbourhood is visibly linked to Grand Piazza. Add secondary lanes and small squares.
- Develop the coastline with a readable promenade, seawall/beach/rock edge, shallow water band and distant horizon/island silhouettes.
- Add varied olive trees, slender cypress, planter beds and restrained bougainvillea. Avoid a repetitive grid of identical trees.
- Give each district a clear silhouette and visual character while keeping a unified architectural language.
- Keep the scene performant: instance repeated foliage/props where sensible, reduce unnecessary draw calls, use sensible shadow map coverage, and cap pixel ratio for mobile.

### B. Improve interaction and navigation
- Preserve OrbitControls for drag/orbit and zoom.
- Add clear, discoverable interaction hints that accurately describe actual controls.
- Add a reliable district selector (the directory already exists) that smoothly frames the selected district.
- Building clicks should resolve to the correct district; use explicit userData/metadata on selectable meshes rather than guessing the nearest district from a clicked mesh position.
- Avoid double-click-only discovery on touch screens. Support single tap on mobile or provide equivalent district buttons.
- Ensure a district click from the directory scrolls to the 3D world and opens the correct district panel.
- Add a reset / overview action and a clear close/back action for the district information panel.
- Prevent camera focus animations from fighting the user's active drag. Cancel previous focus animations and respect user interaction.
- Keep day/night switching consistent and avoid unnecessary full scene rebuilds if it can be implemented cleanly.
- Add loading and WebGL-unavailable fallbacks with a clear message instead of a blank area.

### C. Make the site production-ready
- Check for console errors, missing assets, React warnings, inaccessible buttons, text contrast issues and mobile overflow.
- Respect `prefers-reduced-motion`.
- Add accessible labels to icon-only buttons and keyboard focus styles.
- Ensure fonts have sensible fallbacks if Google Fonts cannot load.
- Use semantic headings and navigation.
- Verify the page at 1440px desktop, 1024px tablet, 390px mobile and 360px mobile.
- Keep the first load reasonably light. Avoid adding large libraries or remote assets without a clear need.
- Audit dependency versions and reconcile `package.json` with `package-lock.json`; keep a reproducible install command.
- Run:
  ```bash
  npm install
  npm run build
  ```
  Fix all build errors before declaring completion.
- Keep `.github/workflows/ci.yml` working. It currently runs an install and production build on pushes and pull requests to main.

### D. Improve the story and content without inventing a real destination
ATLAS is an imagined Mediterranean city. Do not describe it as a real location or add real-world travel claims, bookings, addresses or opening hours. Keep copy evocative, concise and specific to the eight approved neighbourhoods.

## 7. Deploy and Git workflow

- Work in the existing `bloggermayank/ATLAS` repository and commit to `main` unless there is a good reason to use a preview branch.
- Do not delete the existing project or force-push.
- Use meaningful commits.
- The Vercel integration previously returned **403 permission denied** when attempting to create a linked project under the selected team. No Vercel project was found under that team. Do not claim the site is deployed.
- Check whether the user has connected the repository to Vercel or another host. If not, prepare the repo correctly and explain the exact manual linking action needed.
- Vercel build settings should be: framework **Vite**, root directory **/**, install command **npm install**, build command **npm run build**, output directory **dist**.
- After deployment, verify the production URL actually loads and that the WebGL scene works. Do not invent a deployment URL.

## 8. Definition of done

Do not call the task complete until:
- The existing site runs locally and `npm run build` passes.
- All eight districts are reachable from the UI and are physically connected by the street network.
- Camera framing and district details stay in sync.
- Touch users can select districts and navigate the city.
- Day/night mode, overview/reset, responsive layout and fallback behaviour work.
- The visual direction reads as contemporary Mediterranean, not generic low-poly city.
- Generated Meshy assets are integrated only if actual GLB files can be exported and verified; otherwise procedural stand-ins remain intentionally active and this limitation is documented.
- The final site is deployed and tested, or the remaining hosting permission step is clearly stated.
- Update `README.md` with accurate setup/deploy instructions and update `ATLAS_ASSET_REGISTER.md` with final model states and actual filenames.

## 9. Execution order

1. Inspect the repository and run the current build before changing anything.
2. Fix any existing build/runtime errors and package-lock mismatch.
3. Improve scene layout, district tagging and interactions.
4. Improve the Mediterranean architecture, coastline, foliage, shadows and mobile performance.
5. Integrate verified model files if available; otherwise keep fallbacks.
6. Run build and device-size checks, fix issues.
7. Commit all changes.
8. Deploy and verify if permissions allow.
9. Return a concise completion report listing commits, test result, deployed URL (only if verified), and any remaining manual steps.

**Do the work, not just write another plan. Keep the current app and make it substantially better.**
