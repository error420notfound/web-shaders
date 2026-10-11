# Integrated animation authoring

## Architecture and compatibility

The editor still uses the existing React/Shaders canvas, verified component registry, recursive layers, strict Zod validation, snapshot history, IndexedDB stores and TSX/CSS export workflow. Audited installed versions: React 19.3.0, Vite 7.3.7, Tailwind 4.3.3, Shaders 4.0.4, Zod 4.6.5, Radix Dialog 1.2.0, Bootstrap Icons 1.13.2, idb 8.0.4, Vitest 5.0.3 and Playwright 1.64.0.

`features/animation/runtime.ts` contains the portable document types and pure evaluation, easing, interpolation and range-time mapping. `schema.ts` validates animation data; `bindings.ts` limits authoring to verified properties and explicit shared modifiers. `commands.ts` implements key insertion/deletion/movement. `playback.ts` owns one elapsed-time requestAnimationFrame clock and external-store subscriptions. `editor.tsx` owns authoring selection, temporary transaction previews and Auto Key. The timeline and property diamonds consume those services.

The saved document contains no React, WebGPU, DOM, Motion or GSAP objects. Playback and scrubbing do not change projects. The renderer subscribes per layer and updates the existing keyed Shaders components through public React props; unrelated editor state does not update each frame. Property controls subscribe to their own evaluated value rather than the whole playback time.

No new dependency was installed. CSS handles restrained interface transitions; neither Motion nor GSAP provides a necessary capability here. A CSS named-color table was copied from the existing MIT-licensed `color-name` package with its license retained.

Shaders' public React props support reactive updates. The installed component implementation updates uniforms and metadata through its normal effects; the editor does not access those internals. Official reference: https://shaders.com/docs/guide/props-reactivity.

There is no public global native shader pause/seek API in this integration. Timeline time deterministically controls authored properties. Procedural effect time, simulation state, automatic shader drivers and pointer input can evolve independently. Timeline stop holds authored values, while the existing app-motion button still substitutes driver rest values. Native shader animation may continue. Hidden documents retain the existing canvas-unmount cleanup behavior; timeline playback pauses and requires an explicit Play on return.

## Document and migration

Projects now use schema version 2 and include `animation`: duration in seconds, integer nominal frame rate, playback range, loop mode, and tracks. Each track binds a stable `layerId` plus a restricted property path (`props.angle`, `modifiers.opacity`, or a supported transform field), records its interpolation strategy and enabled state, and contains stable keyframe IDs, timestamps, validated values and outgoing easing.

Version 1 projects migrate on read to an empty 5-second, 30-fps document, full playback range and no loop. IDs, timestamps, assets, layer configuration and IndexedDB stores are preserved. Normal autosave writes version 2. No database reset or destructive storage upgrade occurs. Older version-1-only editors cannot read version 2.

Keys sort deterministically. Duplicate IDs/bindings/timestamps, near-identical timestamps, non-finite values, invalid ranges and incompatible values are rejected. Missing layers or removed properties retain inactive tracks with visible warnings and are excluded from rendering/source exports. Layer deletion removes descendant tracks in the same undo command. Layer duplication clones animation and remaps all affected IDs. Duration cannot be shortened across existing keys.

Default playback is paused at time zero on project load; Auto Key is off. Playback speed, selection, staged values, panel sizing/zoom and Auto Key are session controls rather than saved composition settings.

## Authoring and controls

Open **Animation timeline** below the canvas. On desktop drag the upper separator to resize, or focus it and use Up/Down. On tablet/mobile the panel becomes a drawer, initially focused on the selected layer; **Show all tracks** reveals the complete composition.

Use the property diamond to insert the displayed value at the playhead. At an existing timestamp, the diamond selects the key. Editing there changes that key. Between keys, Auto Key inserts automatically when enabled. Otherwise editing pauses and stages a temporary preview: insert with the diamond to save, Cancel to discard, or seek to discard automatically. Staged values never appear in exported files.

An enabled timeline track owns its property ahead of a shader driver. Disabling/removing the track restores the retained driver/static value. Shader-source switching to Static now disables and retains the driver; selecting its previous type restores the configuration. Explicit property reset can discard driver configuration.

Select a marker to inspect its exact time, value and outgoing easing. Shift/Ctrl/Cmd-click selects multiple keys, including across tracks. Drag horizontally to move the selection; snapping uses nominal frames, and Alt disables it. A gesture previews changes and commits one undo step on release. Escape/pointer cancellation discards the gesture; timestamp collisions cancel the final drag. Remove the last key to remove its track. Copy/paste preserves offsets, validates destination compatibility, and rejects collisions; Duplicate offsets by one frame. The clipboard is internal to the timeline session.

Playback supports play/pause, stop, return to range start, continuous seek, frame stepping, signed speeds, full duration, range editing, loop and ping-pong. The clock uses elapsed absolute time, not frame counts. Timecode uses the selected nominal frame rate. Manual seek may reach the full duration even when playback uses a shorter range. Ordinary loops wrap at the range end; ping-pong includes both turnarounds.

Shortcuts: Space plays/pauses; K inserts the focused inspector property. With timeline focus, Left/Right step, Home seeks to range start, Delete/Backspace removes keys, Ctrl/Cmd+C/V copies/pastes and Ctrl/Cmd+D duplicates. Existing undo/redo/save shortcuts remain. Input, slider, editable content and dialog keyboard behavior takes priority; buttons retain normal Space activation. Controls have labels and visible browser/project focus styles; touch controls do not depend on hover.

Reduced-motion users retain the static preview and paused timeline. **Enable shader preview for timeline editing** is an explicit session opt-in, reset when loading another project. Editing and exports remain available without WebGPU.

## Interpolation and export

Numbers, opacity, transforms and compatible numeric coordinates interpolate mathematically. Rotation preserves authored revolutions. Boolean/enumerated values hold until the next key regardless of easing. Resource references and arbitrary structures are excluded. The evaluator holds first/last values outside each track's key span and works independently of evaluation history or timeline visibility.

Easing supports linear, quadratic ease-in/out/in-out, hold and custom cubic Bézier numeric controls. Bézier x coordinates must be in [0,1]; y coordinates are finite. Overshooting easing progress is clipped to [0,1] to preserve registry property bounds.

Authored colors accept named CSS colors, hex, rgb(a), hsl(a), OKLab, OKLCH and `color(srgb ...)`, normalized to serializable sRGB rgba. Interpolation uses premultiplied-alpha OKLab with explicit sRGB gamut clipping. CSS variables, relative colors, wide-gamut `color()` spaces and other CSS color functions remain available for static properties but require conversion to a supported format for timeline keys.

JSON includes complete animation plus retained drivers. Animated React exports embed the exact portable runtime source, serialized tracks, centralized playback and reactive property overrides after driver props. The TSX and CSS files remain independent of editor components, registry, history and IndexedDB. Missing bindings are retained in JSON and warned/omitted from runnable source. Reduced motion and GPU failure use the existing accessible static fallback.

`scripts/sync-animation-runtime.mjs` synchronizes the export source payload before dev, test, build and export verification. Tests assert byte-for-byte source equality. `verify:export` type-checks the six original exports plus a nested animated composition against installed public types, and executes the embedded runtime in a separate VM to compare values/timing across arbitrary seeks and every loop mode. `scripts/generated/animated.html` is a runnable Vite-served fixture.

## Verification and remaining limits

Added files:

- `src/features/animation/`: `runtime.ts`, `schema.ts`, `bindings.ts`, `commands.ts`, `playback.ts`, `editor.tsx`, `colors.ts`, `animation.test.ts`, synchronized `runtime-source.json`, and MIT `color-names.json` / `color-names.LICENSE`.
- `src/components/timeline/`: `TimelinePanel.tsx` and `AnimatedProperty.tsx`.
- `scripts/animation-qa.mjs`, `scripts/sync-animation-runtime.mjs`, and this document.

Modified integration files: `src/app/App.tsx`; controls `Primitives.tsx` and `PropertyControl.tsx`; editor `Canvas.tsx`, `Inspector.tsx`, and `ExportDialog.tsx`; `src/data/starters.ts`; composition `schema.ts` and `workshop.test.ts`; renderer `ShaderRenderer.tsx`; export `code.ts`; `src/styles/global.css`; `scripts/browser-qa.mjs`; `scripts/verify-export.ts`; `package.json`; and `README.md`. No package dependency or IndexedDB store was replaced.

Run typecheck, lint, test, build and verify:export using the package scripts. `node scripts/browser-qa.mjs` runs the original editor regressions and new animation flows; `node scripts/animation-qa.mjs` runs animation QA alone. Artifacts are under ignored `output/qa/`.

Automated coverage includes version migration, validation, deterministic ordering, interpolation/easing/colors, endpoints, loop/ping-pong/reverse seeking, missing bindings, source ownership, staged discard, elapsed-time playback, pause/resume direction, history and portable runtime equivalence. Browser coverage exercises two-layer authoring, editing/easing, Auto Key, drag transactions, Escape/collision handling, copy/paste/delete, undo/redo, duration rejection, ownership restore, save/reload/import/export, responsive drawers and reduced-motion opt-in.

The available headless Chromium reports WebGPU unavailable. Authoring/fallback, emulated touch scrubbing/key dragging, the runnable React export and exported runtime behavior are verified; actual GPU pixels and a mounted canvas during scrubbing require a WebGPU-capable browser. The QA script attempts that check and records availability rather than treating fallback as GPU success. Physical-device touch and long-running GPU performance measurements remain follow-up checks. A visual Bézier graph is deferred; precise numeric curve controls are implemented. Full native shader-time seeking would require a future public Shaders API.
