import fs from "node:fs";
import { URL } from "node:url";
// Keep the portable export source byte-for-byte equal to the editor runtime.
const source = fs.readFileSync(
  new URL("../src/features/animation/runtime.ts", import.meta.url),
  "utf8",
);
const target = new URL(
  "../src/features/animation/runtime-source.json",
  import.meta.url,
);
const content = JSON.stringify(source) + "\n";
if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content)
  fs.writeFileSync(target, content);
