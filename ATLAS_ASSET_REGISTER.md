# ATLAS — 3D Asset Register

**Visual target:** contemporary Mediterranean, believable limestone and terracotta architecture, warm golden-hour light.

## Generated Meshy assets

| Asset | Geometry task | Texture task | Latest state |
|---|---|---|---|
| Observatory Pavilion | `01a1efab-e041-76a0-8ea3-98b18cc7d667` | `01a1efae-0c76-7429-9d77-4026eb208012` | Geometry and texture complete |
| Grand Piazza Fountain | `01a1f1ab-1664-71d9-9fa8-10eea7d4c8be` | `01a1f1b0-5d3e-7532-8605-a39c0475720e` | Geometry and texture complete |
| Old Quarter Townhouse | `01a1f1b2-122c-71f0-bf93-0e56e53988da` | `01a1f1b2-cf05-7302-afea-cca2ac6a4044` | Geometry and texture complete; generated mesh is unusually thin |
| Market Arcade | `01a1f1b6-d881-77d0-946e-5a0b83eeae86` | `01a1f1b9-40d8-71ec-9e80-c0afb97e6c01` | Geometry and texture complete |
| Villa Terraces Villa | `01a1f1bb-39e6-7507-a00f-9bfed8377db2` | `01a1f1bd-3b49-736b-aa31-651fc3898e9d` | Geometry complete; final texture task was processing at handoff |

## Important dimensions from Meshy

- Grand Piazza Fountain: approximately 1.90 × 1.50 × 1.90 generated units.
- Old Quarter Townhouse: approximately 0.984 × 1.000 × 0.088 — façade-like and unusually thin; do not use as a complete building without inspection.
- Market Arcade: approximately 1.00 × 0.704 × 1.00.
- Villa: approximately 1.00 × 0.978 × 0.967.

Normalize all imported assets from actual bounding boxes. These are generated dimensions, not guaranteed real-world metres.

## Export constraint

A GLB download attempt from Meshy returned an upgrade-required error. None of the above assets should be described as integrated in the repository until the actual GLB files are exported and tested. The current Three.js procedural city is the working fallback.

## Credit status

- Last verified remaining Meshy balance: **0 credits** after starting the Villa texture task.
- No additional Meshy generation should be attempted unless the user adds credits.
- Texture task IDs are preserved above for checking status in Meshy.

## Integration policy

1. Save verified exported GLBs under `public/models/`.
2. Load them via Three.js `GLTFLoader`.
3. Add a model manifest with scale, rotation, offset and intended district.
4. Inspect meshes, dimensions, materials, texture maps, UVs and normals.
5. Keep procedural fallbacks until each model works on desktop and mobile.
6. Never use an expiring preview URL as a production model URL.
