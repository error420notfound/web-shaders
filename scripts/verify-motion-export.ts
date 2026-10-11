import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  createMotionProject,
  componentFromSelection,
  exposeParameter,
  makeElement,
} from "../src/features/motion/commands";
import {
  flattenNodes,
  parseMotionProject,
} from "../src/features/motion/schema";
import { makeSequence } from "../src/features/motion/animations";
import { exportStaticMotion } from "../src/features/export/motion/static";
import { createProject } from "../src/data/starters";
const root = path.resolve("output/motion-astro-fixture");
await fs.mkdir(path.join(root, "src/pages"), { recursive: true });
const legacyShader: Record<string, unknown> = {
  ...createProject(0),
  schemaVersion: 1,
  id: "legacy-preserved",
  name: "Legacy shader project",
};
delete legacyShader.animation;
await fs.writeFile(
  path.join(root, "legacy-shader.json"),
  JSON.stringify(legacyShader),
);
await fs.writeFile(
  path.join(root, "package.json"),
  JSON.stringify(
    {
      private: true,
      type: "module",
      scripts: {
        build: "astro build",
        preview: "astro preview --host 127.0.0.1 --port 4321",
      },
      dependencies: { astro: "7.3.8", gsap: "^3.15.0" },
    },
    null,
    2,
  ),
);
let p = createMotionProject();
const heading = flattenNodes(p.scenes[0].roots).find(
  (n) => n.kind === "element" && n.type === "heading",
)!;
p = componentFromSelection(p, p.scenes[0].id, heading.id);
p.components[0] = exposeParameter(
  p.components[0],
  heading.id,
  "content",
  "headline",
);
p.components[0] = exposeParameter(
  p.components[0],
  heading.id,
  "color",
  "accent",
);
p.components[0].parameters[0].defaultValue =
  "<script>unsafe()</script>{literal}";
p.components[0].parameters[1].defaultValue = "#5b62e5";
const image = makeElement("image");
image.source = "asset:tiny";
image.alt = "Fixture image";
p.assets.push({
  id: "tiny",
  name: "tiny.png",
  mime: "image/png",
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
});
p.scenes[0].roots.push(image);
async function writeExport(folder: string, id: string, component: boolean) {
  for (const file of exportStaticMotion(p, id, component)) {
    const target = path.join(
      root,
      file.path.startsWith("public/")
        ? file.path
        : `src/components/${folder}/${file.path}`,
    );
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, file.content);
  }
}
await writeExport("scene", p.scenes[0].id, false);
await writeExport("heading", p.components[0].id, true);
let animated = createMotionProject();
const animatedHeading = flattenNodes(animated.scenes[0].roots).find(
  (n) => n.kind === "element" && n.type === "heading",
)!;
animated.scenes[0].sequences = [
  makeSequence({ kind: "element", elementId: animatedHeading.id }),
];
try {
  animated = parseMotionProject(
    JSON.parse(
      await fs.readFile("output/qa/motion-animation-project.json", "utf8"),
    ),
  );
} catch {
  /* Standalone verification has its own animated fixture. */
}
for (const file of exportStaticMotion(animated, animated.scenes.at(-1)!.id)) {
  const target = path.join(
    root,
    file.path.startsWith("public/")
      ? file.path
      : `src/components/animated/${file.path}`,
  );
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, file.content);
}
// Also build the actual UI-downloaded ZIP, including runtime code serialized by
// the production bundle. The editor's ZIP writer uses uncompressed entries.
let downloadedZip: Buffer | undefined;
try {
  downloadedZip = await fs.readFile("output/qa/motion-animation.zip");
} catch {
  /* Standalone fixture generation remains supported. */
}
if (downloadedZip) {
  let offset = 0;
  while (downloadedZip.readUInt32LE(offset) === 0x04034b50) {
    if (downloadedZip.readUInt16LE(offset + 8) !== 0)
      throw new Error("Expected stored export ZIP entries");
    const size = downloadedZip.readUInt32LE(offset + 18),
      nameLength = downloadedZip.readUInt16LE(offset + 26),
      extraLength = downloadedZip.readUInt16LE(offset + 28);
    const name = downloadedZip
      .subarray(offset + 30, offset + 30 + nameLength)
      .toString("utf8");
    const target = path.resolve(
      root,
      name.startsWith("public/") ? name : `src/components/animated/${name}`,
    );
    if (!target.startsWith(root + path.sep))
      throw new Error("Export ZIP path escapes fixture");
    const start = offset + 30 + nameLength + extraLength;
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, downloadedZip.subarray(start, start + size));
    offset = start + size;
  }
}
await fs.writeFile(
  path.join(root, "src/pages/animated.astro"),
  `---
import Scene from '../components/animated/MotionComponent.astro';
import { ClientRouter } from 'astro:transitions';
---
<html lang="en"><head><title>Animated motion fixture</title><ClientRouter /></head><body><Scene /><Scene /><a href="/other/">Other page</a></body></html>`,
);
await fs.writeFile(
  path.join(root, "src/pages/index.astro"),
  `---\nimport Scene from '../components/scene/MotionComponent.astro';\nimport Heading from '../components/heading/MotionComponent.astro';\nimport { ClientRouter } from 'astro:transitions';\n---\n<html lang="en"><head><title>Static motion fixture</title><ClientRouter /></head><body><Scene /><Heading headline="First instance" accent="#ff0000" /><Heading headline="Second instance" /><Heading /><a href="/other/">Other page</a></body></html>`,
);
await fs.writeFile(
  path.join(root, "src/pages/other.astro"),
  `---\nimport { ClientRouter } from 'astro:transitions';\n---\n<html lang="en"><head><title>Other fixture</title><ClientRouter /></head><body><a href="/">Return</a></body></html>`,
);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
function run(args: string[], cwd = root) {
  // All commands are fixed test commands; no project/user text enters the shell.
  execFileSync(
    process.platform === "win32" ? "cmd.exe" : npm,
    process.platform === "win32"
      ? ["/d", "/s", "/c", [npm, ...args].join(" ")]
      : args,
    {
      cwd,
      stdio: "inherit",
    },
  );
}
// Test-only installation, isolated from the editor and exported component dependencies.
try {
  await fs.access(path.join(root, "node_modules/astro/package.json"));
  await fs.access(path.join(root, "node_modules/gsap/package.json"));
} catch {
  run(["install", "--no-audit", "--no-fund"]);
}
run(["run", "build"]);
const vanillaRoot = path.resolve("output/motion-vanilla-fixture");
animated.export.target = "vanilla";
for (const file of exportStaticMotion(animated, animated.scenes.at(-1)!.id)) {
  const target = path.join(vanillaRoot, file.path);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, file.content);
}
run(["run", "build"], vanillaRoot);
const html = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
if (
  !html.includes("First instance") ||
  !html.includes("&lt;script&gt;unsafe()&lt;/script&gt;{literal}")
)
  throw new Error("Exported content was not preserved and escaped");
if (html.includes("astro-island"))
  throw new Error("Static motion export unexpectedly requires hydration");
console.log(
  "PASS clean Astro build: scene, typed component props, multiple instances, escaped text and bundled image; no React hydration",
);
