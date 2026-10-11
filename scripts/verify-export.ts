import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createProject } from "../src/data/starters";
import { parseProject } from "../src/features/compositions/schema";
import { generateCode } from "../src/features/export/code";
import { bindings } from "../src/features/animation/bindings";
import { putKey } from "../src/features/animation/commands";
import {
  evaluateTimeline,
  playbackTime,
} from "../src/features/animation/runtime";
import runtimeSource from "../src/features/animation/runtime-source.json";

const folder = path.resolve("scripts/generated");
fs.mkdirSync(folder, { recursive: true });
const files: string[] = [];
for (let i = 0; i < 6; i++) {
  const p = parseProject(createProject(i));
  const output = generateCode(p, true);
  const file = path.join(folder, `Starter${i}.tsx`);
  fs.writeFileSync(file, output.code);
  files.push(file);
}
const animated = createProject(2);
for (const layer of [animated.layers[0], animated.layers[0].children[0]]) {
  const binding = bindings(layer).find((b) => b.path === "modifiers.opacity")!;
  animated.animation = putKey(animated.animation, layer.id, binding, 0, 0.2);
  animated.animation = putKey(animated.animation, layer.id, binding, 2, 0.9);
  animated.animation.tracks.at(-1)!.keyframes[0].easing = {
    type: "bezier",
    points: [0.25, 0.1, 0.25, 1],
  };
  layer.modifiers.transform = { rotation: 45, scale: 1 };
}
animated.animation.loopMode = "ping-pong";
const animatedOutput = generateCode(parseProject(animated), true);
fs.writeFileSync(path.join(folder, "Animated.tsx"), animatedOutput.code);
files.push(path.join(folder, "Animated.tsx"));
assert.ok(
  animatedOutput.code.includes(runtimeSource),
  "Export must embed the editor runtime verbatim",
);
const portable = ts.transpileModule(runtimeSource, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const sandbox = { exports: {} as Record<string, (...args: any[]) => any> };
vm.runInNewContext(portable, sandbox);
for (const loopMode of ["none", "loop", "ping-pong"] as const) {
  const doc = { ...animated.animation, loopMode };
  for (const absolute of [-1, 0, 0.25, 1, 2, 4.999, 5, 5.001, 7, 10]) {
    const time = playbackTime(doc, absolute).time;
    assert.equal(
      JSON.stringify(sandbox.exports.playbackTime(doc, absolute)),
      JSON.stringify(playbackTime(doc, absolute)),
    );
    assert.equal(
      JSON.stringify(sandbox.exports.evaluateTimeline(doc, time)),
      JSON.stringify(evaluateTimeline(doc, time)),
    );
  }
}
fs.writeFileSync(
  path.join(folder, "shader-composition.css"),
  generateCode(createProject(2), true).css,
);
fs.writeFileSync(
  path.join(folder, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Export verification</title><style>body{margin:0;min-height:100vh;background:#faf9f7}#root{max-width:960px;margin:40px auto}</style></head><body><div id="root"></div><script type="module">import React from 'react';import {createRoot} from 'react-dom/client';import Composition from './Starter2.tsx';createRoot(document.getElementById('root')).render(React.createElement(Composition));</script></body></html>`,
);
fs.writeFileSync(
  path.join(folder, "animated.html"),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Animated export verification</title></head><body><div id="root"></div><script type="module">import React from "react";import {createRoot} from "react-dom/client";import Composition from "./Animated.tsx";createRoot(document.getElementById("root")).render(React.createElement(Composition));</script></body></html>',
);
fs.writeFileSync(path.join(folder, "assets.d.ts"), "declare module '*.css';\n");
files.push(path.join(folder, "assets.d.ts"));
const program = ts.createProgram(files, {
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  esModuleInterop: true,
});
const errors = ts.getPreEmitDiagnostics(program);
if (errors.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: (f) => f,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else
  console.log(
    "Six static exports and the nested animated export type-check against shaders@4.0.4; portable timing/value equivalence passed for every loop mode.",
  );
