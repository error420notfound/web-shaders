# Motion Designer animation authoring

Motion Designer is the existing local-first DOM/SVG workspace, reached using the **Motion Designer** toolbar switch. Shader projects and the shader animation runtime remain separate.

## Authoring controls

Create a scene with **+ Scene**, add a **Heading**, and select it in the preview or hierarchy. Choose **Animation** in the inspector, then **Add Animation**. The default entrance is Fade + Slide. Fade, Slide, Scale, Rotate and Clip Reveal presets also expand into editable properties.

The inspector edits From, To, From-To and Keyframes, enabled X/Y, scaleX/scaleY, rotation, opacity, transform origin and clip-path values, start time, duration, delay, easing, repeat, repeat delay and yoyo. Keyframe selection exposes its time, values and segment easing. Changing duration rescales local keyframe times. Clear or delete animations using the inspector.

The timeline opens on the first animation and when reopening an animated scene. Desktop supports collapsing and vertical resizing; tablet/mobile use a focused bottom drawer. It contains element/property tracks, duration bars, markers, ruler, playhead, zoom, frame/seconds display, Play/Pause, Stop, Restart, Undo/Redo and **Show all tracks**. Drag bars to move start times, their right edge to resize duration, and keys to change their local time. Numeric fields provide alternatives. A gesture commits once; Escape or pointer cancellation restores its starting document. Overlapping keyframe times are rejected. Insert a keyframe at a playhead strictly inside an animation; existing endpoint times produce a useful error.

Element selection filters tracks. Track/key selection opens the Animation inspector. Component instance tracks are derived from their definition; select them or **Edit component animation** to open the original editable definition rather than creating a second animation copy.

**Edit** allows element selection and deterministic GSAP scrubbing. **Test triggers** enables real load, viewport entry, hover, click and ScrollTrigger behavior. Trigger targets and scroll containers are selectable. Viewport controls include threshold/margin/once/reverse-on-exit; hover includes reverse/reset; click includes play/pause/reverse/toggle. Scroll controls include start/end, scrub/smoothing, pin and toggle actions. The iframe has an explicit scroll container and preview spacers. Use native scrolling for scroll-controlled playback; its tracks are labeled separately. Timeline seeking is a diagnostic sequence preview, not simulated physical scrolling.

## Document, history and lifecycle

Scene/component sequences are the persistent animation source. Tracks are derived. Existing strict version-1 motion documents remain compatible: missing keyframe IDs are normalized on parse and retained on save; per-keyframe easing is optional. All authored times use seconds; frame display uses 60 fps without snapping saved values. Infinite repeats use a finite first-cycle authoring range.

Motion history and IndexedDB storage retain animation edits, autosave, explicit Ctrl/Cmd+S, JSON import/export and undo/redo. Temporary pointer edits are not autosaved. Runtime timelines, playback state and selections are session-only. The GSAP compiler copies saved values before passing them to GSAP, avoiding runtime metadata mutation. Cleanup reverts applied styles and removes timelines, observers, listeners and triggers on rebuild, scene/workspace changes and unmount.

Animated component conversion moves internal sequences into the reusable definition and remaps external targets. Detachment materializes inherited animation targets. Deleting elements cleans dependent animation/trigger references in the same history transaction. Compatible component replacement maps matching tree positions/types; incompatible animated targets produce an explicit error and can be preserved by detaching first.

The generic controls, timeline layout, timecode and gesture conventions are reused from Shader Designer. Shader bindings/evaluation remain separate from GSAP DOM playback.

## Exports

**Export ? Download project JSON** preserves the complete document. **Download scene** and **Download component** produce Astro or vanilla ZIP bundles. Static selections still export without GSAP dependencies. Animated selections include the same dependency-injected compiler used by the editor, scoped node/instance targets, animation data, runtime initialization and lifecycle cleanup.

For Astro, install GSAP (`npm install gsap`) and copy the component, CSS and both JavaScript files together; merge `public/` assets. Multiple instances initialize independently and clean up during ClientRouter navigation. For animated vanilla output, run `npm install`, `npm run dev` and `npm run build` using its included package.json. Reduced-motion and JavaScript-disabled exports retain readable base styles. External images retain network dependencies.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and `npm run verify:export`.

With the editor at localhost:5173, run `npm run qa:motion`, `npm run qa:motion-animation`, and `node scripts/browser-qa.mjs`. The animation suite exercises the heading entrance workflow, numeric edits, seeking, key insertion/drag, duration scaling, bar dragging, cancellation, undo/redo, playback, all five trigger types, repeat/yoyo, save/reload, JSON/ZIP download, and desktop/tablet/mobile. Screenshots and preview samples are saved under `output/qa/`.

Run `npm run verify:motion-export` after the animation suite. It builds an isolated Astro fixture with static and animated exports and GSAP. Start it with `npm run preview --prefix output/motion-astro-fixture`, then run `npm run qa:motion-export`, `npm run qa:motion-animated-export`, and `npm run qa:motion-vanilla-export`. The verifier also builds the actual UI-downloaded Astro ZIP, including the compiler serialized by the production bundle. The animated suite compares exported opacity/transforms to editor samples at matching times, verifies independent instances and ClientRouter navigation, and checks reduced-motion and JavaScript-disabled output.

Production/offline checks use `npm run qa:motion-pwa` against the built preview. Browser plugin is unavailable in this session; validation uses the repository's Playwright installation.

## Boundaries

Text splitting/stagger, nested sequence authoring and shader insertion are outside this release. Imported split/stagger options remain in JSON and produce explicit preview/source-export errors rather than being discarded. Nested reusable components are rendered with instance paths; editing nested definitions remains available from the library. Physical-device touch, Safari/Firefox and live shader pixels require separate device testing. `npm run qa:motion-touch` verifies Chromium CDP touch dragging followed by a single keyboard undo; it does not establish native device tap behavior after a drag. Native tap synthesis after the raw CDP drag was unavailable in the emulator.

## Implementation files

The following files were added or edited for animation completion; pre-existing workspace changes were retained.

- Dependencies/scripts: `package.json`, `package-lock.json`.
- Workspace integration: `src/app/workspaces/MotionWorkspace.tsx`.
- Motion UI: `src/components/motion/AnimationInspector.tsx`, `src/components/motion/MotionTimeline.tsx`, `src/components/motion/MotionCanvas.tsx`, `src/components/motion/MotionInspector.tsx`; styles in `src/styles/global.css`.
- Document/commands: `src/features/motion/schema.ts`, `src/features/motion/commands.ts`, `src/features/motion/animations.ts`.
- Shared editor/runtime: `src/features/motion/editor.tsx`, `src/features/motion/runtime.js`, `src/features/motion/runtime.d.ts`.
- Export compiler: `src/features/export/motion/static.ts` (existing function name retained for compatibility).
- Unit tests: `src/features/motion/motion.test.ts`, `src/features/motion/animations.test.ts`.
- Browser/export verification: `scripts/motion-qa.mjs`, `scripts/motion-animation-qa.mjs`, `scripts/motion-touch-qa.mjs`, `scripts/verify-motion-export.ts`, `scripts/motion-animated-export-qa.mjs`, `scripts/motion-vanilla-export-qa.mjs`.
- Documentation: `README.md`, `docs/motion.md`.

## Verified results

Typecheck and lint pass. All 46 unit tests pass. The production build passes with the existing large shader bundle and dependency annotation warnings. Shader source export verification and the existing ten browser workflows plus shader animation suite pass.

The complete Motion heading workflow passes against both the development server and built `/web-shaders/` application at 1440?1000, 820?1180 and 390?844. Page identity, meaningful rendered controls, absence of a framework overlay, console errors/page exceptions, real state changes, gesture cancellation/history, all triggers, repeat/yoyo, reload persistence and downloads are verified. Switching to Shader Designer during Motion playback releases playback and returns paused.

Static Astro export, typed props, escaping, assets, multiple instances, navigation, reduced motion, JavaScript-disabled markup and IndexedDB v1?v2 preservation pass. Animated Astro and vanilla output match editor opacity/transforms at 0, 0.3, 0.9, 1.8 and 2 seconds. Animated Astro instances remain independent and clean up on navigation. Production service-worker caching, offline reload and local persistence pass.

Screenshot evidence is under `output/qa/`: `motion-animation-desktop.png` shows the Animation inspector and visual timeline together; `motion-animation-tablet.png`, `motion-animation-mobile.png` and `motion-animation-mobile-inspector.png` cover responsive drawers. `motion-animated-export.png` shows the exported Astro fixture.
