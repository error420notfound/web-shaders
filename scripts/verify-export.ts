import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createProject } from "../src/data/starters";
import { parseProject } from "../src/features/compositions/schema";
import { generateCode } from "../src/features/export/code";

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
fs.writeFileSync(
  path.join(folder, "shader-composition.css"),
  generateCode(createProject(2), true).css,
);
fs.writeFileSync(
  path.join(folder, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Export verification</title><style>body{margin:0;min-height:100vh;background:#faf9f7}#root{max-width:960px;margin:40px auto}</style></head><body><div id="root"></div><script type="module">import React from 'react';import {createRoot} from 'react-dom/client';import Composition from './Starter2.tsx';createRoot(document.getElementById('root')).render(React.createElement(Composition));</script></body></html>`,
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
    "All six generated compositions, including nested Glass / FilmGrain and automatic drivers, type-check against shaders@4.0.4.",
  );
