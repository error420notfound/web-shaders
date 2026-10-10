# Verification results

Verified locally on 11 October 2026 using Node 24.21.0, Windows, React 19 and shaders 4.0.4.

## Automated checks

- `npm run typecheck`: passes.
- `npm run lint`: passes.
- `npm test`: 9 tests pass. Every one of the 1,908 installed component defaults is accepted; six starters round-trip; unknown components/properties/versions/assets and invalid values are rejected; nested cloning remaps IDs; undo/redo and drag coalescing work; export includes verified APIs; missing custom source warns and blocks TSX.
- `npm run verify:export`: all six generated TSX compositions type-check against installed React and Shaders declarations, including FilmGrain/FractalNoise, Glass/LinearGradient, and automatic drivers.
- `npm run build`: successful production build to `dist/`.
- `npm audit --audit-level=low`: zero reported vulnerabilities after upgrading the test runner.

## Browser workflows

`node scripts/browser-qa.mjs` passes ten checks using Playwright Chromium, at **1440 × 960** and **390 × 844**, with controlled GPU unavailability:

1. Static fallback status and functional editor controls.
2. Colour edits, undo, redo.
3. Add/select/rename/duplicate/hide/show/delete, move buttons and sibling drag/drop.
4. Nested child-effect wrapping.
5. Editable website content, context switch and embedded local SVG upload/image scale.
6. Downloaded JSON, IndexedDB save/reload, validated import and exact rejected-file preservation.
7. React TSX and CSS download actions.
8. New blank project, fill an empty child effect, reopen, duplicate and confirmed deletion.
9. Mobile canvas, library/inspector drawer editing and no document-width overflow.
10. Reduced-motion static preview.

No uncaught browser page errors occurred. QA artifacts are in ignored `output/qa/`: screenshots, round-trip JSON, downloaded TSX/CSS and `results.json`. They are generated evidence, not source assets.

## Live GPU / visual check

The connected Brave browser successfully rendered Quiet Gradient Field and Soft Refractive Glass using WebGPU. The nested Glass sphere, gradient and section copy were visually inspected. A separately mounted generated `Starter2.tsx` rendered the same nested effect through its own exported component/CSS. No runtime errors appeared on that export page. The installed Shaders/TypeGPU package emits a development warning about omitted `in.uv` externals; these representative effects still rendered correctly. Transient Vite HMR messages during file rewrites did not recur in the fresh export page or automated workflow runs.

Desktop and mobile screenshots were inspected alongside the accepted design concept. The charcoal toolbar, warm panels, indigo controls and three-region hierarchy were carried into the implementation. The functional UI uses actual package component names and symbolic library icons instead of invented shader thumbnails and concept-only selection handles. Preview content is editable website copy. Mobile uses a portrait ratio by default when switching from the standard 16:9 desktop frame, so copy remains readable; the ratio remains editable.

## Limits

This verifies representative GPU output and the editor workflow, not every possible combination of 200 effects or every browser/graphics driver. GPU availability depends on browser, secure context, OS and hardware. Reduced motion uses the static background because the package has no global native-animation pause. Workshop's toolbar pauses only its authored drivers.

The full component library creates a large lazy renderer chunk (about **3.4 MB minified / 751 KB gzip**), and the compiled editor/metadata is about **1 MB / 207 KB gzip**. Vite reports its normal large-chunk advisory; Rollup also removes two misplaced third-party Zod purity annotations. These are build warnings, not build failures. A future per-component loader or smaller curated library could reduce download size.

No production-ready claim is made for arbitrary exports. The six starter exports compile, and the nested Glass export has been browser-rendered. Custom component authoring/import, GLB/USDZ and 3D preview, scroll drivers and a service worker are deferred as described in README.
