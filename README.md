# Shader Workshop

A personal, client-side composition editor built with React 19, TypeScript, Vite, Tailwind CSS 4, Radix Dialog, Bootstrap Icons, Zod, and IndexedDB. No backend or account is required.

## Run

Use Node **24.12 or newer in the 24.x line** (tested with 24.21.0), or a current compatible Node 22 release. The development server is local to this computer.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**. For a production build and local preview:

```sh
npm run build
npm run preview
```

The deployable, static application is in `dist/`. Production builds use the `/web-shaders/` base path; local development stays at `/`. Open the URL printed by `npm run preview`, including `/web-shaders/`. Serve it over HTTPS or localhost for WebGPU.

## GitHub Pages and installation

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys `dist/` on pushes to `main`, or through **Actions → Deploy GitHub Pages → Run workflow**. In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The production URL is **https://error420notfound.github.io/web-shaders/**. The repository name, Vite production base, canonical/share URL, and social image URLs must be updated together if the site moves.

The app includes a manifest, icons, Apple touch icon, and a production-only service worker. Use your browser's install action to launch it in a standalone window. On iPhone/iPad, use Safari's **Share → Add to Home Screen**. The layout accounts for display cutouts and the home indicator. Safari/WebKit without usable WebGPU shows a static preview while editing, local storage, import, and export remain available.

After the first successful online load and service-worker installation, the app shell, bundled fonts, sample object, shader engine, and six starter compositions are available offline. External media URLs may still need a network connection. Offline launch depends on the browser retaining its cached site data. Projects remain in IndexedDB; installing does not create a cloud backup. Export JSON to keep portable copies.

Updates download in the background and wait until all app tabs/windows close before activating. They never force a reload during editing. Close all app windows and reopen while online to pick up a downloaded update. `npm run dev` does not install a service worker; use the production preview to check offline behavior.

The toolbar's **Share app** button shares the public app URL through the device's native share sheet, copies it when native sharing is unavailable, or displays a selectable link when clipboard access is blocked. Social link previews use the bundled 1200×630 card; local composition data is not included.

## Editor

- First use opens **Quiet Gradient Field**. Project → New provides a blank composition and six editable starters.
- Search the 200-component library or choose one of its ten actual package categories. A child effect wraps the selected layer; when an empty child effect is selected, adding a component fills it. Other additions become top-level layers.
- Select a layer to rename it and edit its verified component props. The stack provides visibility, duplication, deletion, sibling drag/drop and keyboard-accessible move buttons. Expand/collapse nested children. Shared compositing and transforms are separate from component props.
- Website Section previews provide editable text, content alignment/position/visibility, colours, aspect ratios and device widths. Item Background places a **2D image** over the composition with scale/position controls. The local FORM SVG is an illustration, not a 3D model. Uploads are embedded as data URIs in JSON.
- Desktop uses three panels; tablet collapses the library into a drawer; mobile gives the canvas priority and opens library/layers or inspector drawers.
- Undo/redo covers project, layer, property and preview edits. Pointer slider drags form one undo step; rapid keyboard/text edits are grouped within 700 ms. History is session-only, with up to 100 snapshots. Ctrl/Cmd Z, Shift Z, Y, and S are supported outside text editing; `/` opens library search.
- Project actions include New, Open, Duplicate, Rename, Import and confirmed Delete. Autosave writes after 400 ms of inactivity, flushes when switching projects, and reports quota/storage failures. Export JSON to keep a portable backup: IndexedDB is scoped to this browser profile and origin, and clearing site data deletes the local workspace.

## Verified Shaders foundation

**`shaders@4.0.4` is pinned**, with the package's **MIT** license. Its official install command is `npm install shaders`; this repository's lockfile resolves the pinned version. React components are imported from **`shaders/react`**. The official React setup supports React 18 and 19. This app uses React 19.

Sources:

- [React quickstart](https://shaders.com/docs/guide/react/quickstart)
- [React integration](https://shaders.com/react)
- [Composing effects](https://shaders.com/docs/guide/composing-effects)
- [Dynamic props](https://shaders.com/docs/guide/dynamic-props)
- [Design editor overview](https://shaders.com/docs/guide/quick-tour-of-the-design-editor)
- Installed `node_modules/shaders/package.json`, `dist/registry.js`, component `dist/core/shaders/*/index.d.ts`, `dist/react/components/*.d.ts`, `dist/core/types.d.ts`, and `dist/react/Shader.js`.

The installed registry has **200 components, 1,908 component props and ten categories**: Adjustments, Blurs, Distortions, Interactive, Shape Effects, Shapes, Stylize, Textures, Transitions and Utilities. All component defaults were checked against the generated type definitions. The complete component/property/default/driver inventory is [docs/verified-components.md](docs/verified-components.md); the machine-readable registry is `src/data/verified-registry.json`. Examples include LinearGradient, RadialGradient, FractalNoise, FilmGrain, Glass, Aurora, Circle, Blur, Group, ImageTexture and their **own** declared props.

`node scripts/build-registry.mjs` regenerates these files from the installed package. It reads each core declaration through the TypeScript compiler and each React wrapper for `PropDriver` support. Controls are authored from verified UI metadata: colours, numbers/ranges, positions, enumerations, booleans, text, media uploads and structured JSON for lists/gradient stops/shapes. JSON editors are intentional advanced controls, not invented sliders. Allowed values are validated before committing.

**Metadata gaps:** 47 props lack UI definitions: 23 `shapeSdfUrl` strings, 23 derived `shapeType` values, and Form3D's derived `shape3dType`. The small explicit registry in the generator gives the declared SDF string a URL/text field and leaves the derived values read-only. Shape configuration uses the package's documented serialized JSON, with derived props left to the renderer. No guessed shape-type select is exposed. Some recursive package props permit arbitrary JSON by their installed declarations; validation follows those declarations rather than inventing tighter structures.

**Package inconsistency:** SmokeFlow's `colorSpace` default is `"OKLAB"`, while its UI options use lowercase `"oklab"`. Its core type accepts a string. We preserve and label the package default as an additional menu choice. Some installed defaults also sit outside registry UI ranges; verified package defaults remain valid and resettable.

### Composition and motion

One `<Shader>` renders ordered children. Later siblings are drawn on top. Filters/child effects nest their inputs as React children. Workshop's tree follows this model; it is not the Shaders design editor's internal document format. Shaders' separate design editor exports code; Workshop provides its own UI and code generator over the public package APIs.

Shared props exposed in v1 are `id`, `visible`, `opacity`, `blendMode`, `maskSource`, `maskType`, and `transform` (`offsetX`, `offsetY`, `scale`, `rotation`). The supported 20 blend modes and four mask channels come from installed types. Other verified layout props (`boundingBox`, `flow`, `absolute`, `renderOrder`, transform anchors/edge treatment) are intentionally not exposed as shared controls in this version. The layer tree determines order.

Only React props whose wrapper accepts `PropDriver` receive drivers. Workshop supports `auto-animate` (loop/ping-pong, speed, easing, output endpoints), `mouse-position`, `mouse`, and `map` (another layer/channel). Speed can be negative to reverse an automatic loop. No scroll driver was found in the public driver union, so none is provided.

The toolbar **pauses Workshop-authored drivers**, replacing them with saved rest values. Shaders has **no public global pause prop**; native effect animation can continue. Reduced-motion mode uses a static base-colour preview, preserving text/image aids and the editor controls; system `prefers-reduced-motion` enforces this behavior. GPU rendering unmounts when the document is hidden or static preview is selected, letting the official React integration clean up its renderer/resources. It remounts when needed.

### GPU and fallback

Shaders needs a browser/OS/GPU combination supporting **WebGPU**, in a secure context. A browser with `navigator.gpu` may still lack a usable adapter. Loading, ready, `onUnavailable` and render errors are handled; React renderer errors have a boundary. An unavailable GPU displays the saved base colour, sample content/object and a clear status while editing/export continue. Project → **Simulate WebGPU unavailable**, or `?gpu=off`, provides a controlled verification path.

All 200 components are available, but only representative compositions have been GPU-rendered here. Individual effects can have their own device, media, font, or performance constraints. Complex combinations are not guaranteed to run on every GPU. Media URLs can need CORS or network access; embedded uploads/default local item imagery avoid that dependency. `disableTelemetry` is set on Workshop and generated Shader instances.

## Versioned project format

The source of truth is `src/features/compositions/schema.ts`, a strict Zod schema. JSON uses `schemaVersion: 2`; version 1 projects migrate on read without resetting storage. The format includes:

| Field                                  | Meaning                                                                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`, `name`, `createdAt`, `updatedAt` | Project identity and ISO timestamps                                                                                                           |
| `context`                              | `website` or `item`                                                                                                                           |
| `preview`                              | Colours, copy, visibility, alignment/position, device width, aspect ratio, embedded image/name and placement                                  |
| `layers`                               | Ordered recursive array; each layer has ID, name, component type, visibility, sparse explicit `props`, `drivers`, `modifiers`, and `children` |
| `drivers[prop]`                        | Verified Shaders `config` plus a validated static `rest` value                                                                                |
| `animation`                           | Duration, nominal frame rate, playback range, loop mode, property tracks, typed keyframes and serializable easing                              |

Sparse props use the defaults of pinned 4.0.4. The format is pretty-printed for editing/version control. Imports reject unsupported versions, unknown fields/components/props, invalid types/ranges/choices, duplicate layer IDs and missing source references/local preview assets. No unknown data is silently stripped: errors show paths and preserve the original file in a read-only details panel with a download action. Importing a valid project with an existing project ID intentionally replaces that saved local project. Maximum supported tree size is 500 layers / 16 nesting levels.

## Export

Export provides copy/download of project JSON or a React/TypeScript composition, plus a separate `shader-composition.css` sizing example. The default output excludes preview text and the item image. Website compositions can explicitly include the section wrapper and sample content. Its CTA is a styled preview label; connect it to your website's real destination/action.

Generated code recreates layer IDs, hierarchy, visibility, props, shared modifiers and drivers, uses only needed Shaders imports, and includes `onUnavailable`, an accessible static fallback and reduced-motion handling. Copy referenced local shader media assets to the target site or use embedded data. A missing custom component produces a source warning and blocks TSX generation; importing/authoring custom components is deferred.

`npm run verify:export` generates and type-checks all six starter components and a nested animated composition against installed React/Shaders types, and compares the embedded portable runtime with editor evaluation across every loop mode. These are checked examples, not a guarantee of production behavior across all devices or arbitrary combinations.

## Animation timeline

Open the collapsible timeline beneath the canvas, then use a property diamond to insert a key at the playhead. Move the playhead, edit the value and insert again. Auto Key is off by default: between existing keys edits are staged until deliberately inserted, and seeking discards the staged value. Playback, scrubbing and selection never create project history entries.

The timeline provides multitrack editing, easing and numeric Bézier controls, transactional dragging, selection/copy/paste/duplicate/delete, zoom, playback ranges, looping, ping-pong and signed playback speed. Desktop resizing and tablet/mobile drawers preserve the canvas and inspector. JSON and self-contained React TSX exports include animation. Shader drivers remain configured while timeline tracks take precedence; disabling a track restores the prior source.

Timeline seeking is deterministic for authored properties. Native procedural shader clocks and pointer drivers remain independent because this integration has no public global shader-time seek API. Reduced motion retains the static preview with an explicit session opt-in for shader preview. See [animation architecture, controls, compatibility and verification](docs/animation.md) for details.

## Verification commands

```sh
npm run typecheck
npm run lint
npm test
npm run verify:export
npm run build
```

For repeatable browser QA, keep `npm run dev` running in another terminal:

```sh
npx playwright install chromium
node scripts/browser-qa.mjs
```

Screenshots, downloaded round-trip files and results go to ignored `output/qa/`. See [docs/verification.md](docs/verification.md) for the observed results and limits.

## Structure and scope

`app/` owns workspace/state; `components/editor/` owns the panels; `components/controls/` supplies reusable inputs; `features/compositions/` holds schema/history/storage; `features/renderer/` isolates Shaders and fallback; `features/export/` generates files; `data/` contains verified metadata/starters; `styles/` contains editor tokens/layout.

Deferred: GLB/USDZ/Three.js/3D editing, custom WGSL/component authoring, cross-parent drag/reparenting, scroll drivers, shared bounding-box/flow authoring, a global native-animation pause, accounts, cloud storage, collaboration, composition publishing, billing and analytics. A future 3D renderer can be added alongside the existing renderer without changing the local workspace shell.
