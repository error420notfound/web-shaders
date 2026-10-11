import { chromium, expect } from "@playwright/test";
import { Buffer } from "node:buffer";
/* global document, window */
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("output/qa");
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const results = [];
async function run(name, fn) {
  await fn();
  results.push(name);
  console.log(`PASS ${name}`);
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/?gpu=off");
await expect(
  page.getByText("All changes saved", { exact: true }),
).toBeVisible();
await run("Controlled WebGPU fallback keeps editor usable", async () => {
  await expect(page.locator(".fallback-note")).toContainText(
    "WebGPU unavailable · static background",
  );
  await expect(page.getByLabel("Color A hex")).toBeVisible();
});
await run("Edit properties, undo and redo", async () => {
  const c = page.getByLabel("Color A hex");
  await c.fill("#aabbcc");
  await c.press("Enter");
  await expect(c).toHaveValue("#aabbcc");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(c).toHaveValue("#f3d3ba");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(c).toHaveValue("#aabbcc");
});
await run(
  "Add, select, rename, duplicate, hide and reorder layers",
  async () => {
    await page.getByLabel("Search effects").fill("circle");
    await page
      .getByRole("button", { name: "Circle Shapes", exact: true })
      .click();
    await page.getByLabel("Layer name").fill("Focus object");
    await page.getByLabel("Layer name").press("Enter");
    await expect(
      page.getByRole("button", { name: "Focus object Circle", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Hide Focus object", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Show Focus object", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Show Focus object", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Duplicate Focus object", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Move Focus object down", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Focus object copy Circle", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Delete Focus object copy", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Focus object Circle", exact: true })
      .click();
    const from = page
      .getByRole("button", { name: "Focus object Circle", exact: true })
      .locator("..");
    const to = page
      .getByRole("button", {
        name: "Linear Gradient LinearGradient",
        exact: true,
      })
      .locator("..");
    await from.dragTo(to);
    await expect(
      page.locator(".layer-list .layer-select").first(),
    ).toContainText("Focus object");
  },
);
await run("Nested wrapper composition", async () => {
  await page.getByLabel("Search effects").fill("blur");
  await page
    .getByRole("button", { name: "Blur Blurs · child effect", exact: true })
    .click();
  await expect(page.getByLabel("Layer name")).toHaveValue("Blur");
  await expect(
    page.getByRole("button", { name: "Focus object Circle", exact: true }),
  ).toBeVisible();
});
await run(
  "Website content and item context with embedded local image",
  async () => {
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    await page.getByLabel("Heading", { exact: true }).fill("Studio preview");
    await expect(
      page.getByRole("heading", { name: "Studio preview" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Item Background", exact: true })
      .click();
    await page.getByLabel("Image scale", { exact: true }).fill("80");
    await page
      .getByLabel("Upload preview image", { exact: true })
      .setInputFiles("public/sample-object.svg");
    await expect(page.locator(".preview-object")).toHaveAttribute(
      "src",
      /^data:image\/svg\+xml;base64,/,
    );
  },
);
let exported;
await run(
  "JSON export, reload, validated import and rejected-data preservation",
  async () => {
    await page.getByLabel("Project name").fill("QA Composition");
    await expect(
      page.getByText("All changes saved", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Export", exact: true }).click();
    await page
      .getByRole("button", { name: "Project JSON", exact: true })
      .click();
    const promise = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download JSON", exact: true })
      .click();
    const dl = await promise;
    await dl.saveAs(path.join(root, "round-trip.shader.json"));
    exported = JSON.parse(
      await fs.readFile(path.join(root, "round-trip.shader.json"), "utf8"),
    );
    expect(exported.preview.image).toMatch(/^data:image/);
    expect(exported.layers.some((l) => l.type === "Blur")).toBeTruthy();
    await page
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();
    await page.reload();
    await expect(page.getByLabel("Project name")).toHaveValue("QA Composition");
    await expect(page.locator(".preview-object")).toHaveAttribute(
      "src",
      /^data:image/,
    );
    await page.getByLabel("Import project JSON file").setInputFiles({
      name: "roundtrip.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({ ...exported, name: "Imported composition" }),
      ),
    });
    await expect(page.getByLabel("Project name")).toHaveValue(
      "Imported composition",
    );
    const bad = {
      ...exported,
      schemaVersion: 99,
      unknown: { keep: "exactly" },
    };
    await page.getByLabel("Import project JSON file").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(bad)),
    });
    await expect(
      page.getByRole("heading", { name: "Project import rejected" }),
    ).toBeVisible();
    await page.getByText("Original file data", { exact: true }).click();
    await expect(page.getByLabel("Rejected project JSON")).toHaveValue(
      JSON.stringify(bad),
    );
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page
      .getByRole("button", { name: "Dismiss error", exact: true })
      .click();
  },
);
await run("React code and CSS downloads", async () => {
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page
    .getByRole("button", { name: "React / TypeScript", exact: true })
    .click();
  await expect(page.locator(".code-output")).toContainText(
    "from 'shaders/react'",
  );
  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download TSX", exact: true }).click();
  await (await wait).saveAs(path.join(root, "ShaderComposition.tsx"));
  await page
    .getByText("CSS sizing example · shader-composition.css", { exact: true })
    .click();
  const css = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSS", exact: true }).click();
  await (await css).saveAs(path.join(root, "shader-composition.css"));
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
});
await run(
  "Create blank project, open saved project, duplicate and confirm delete",
  async () => {
    async function menu(name) {
      await page.getByLabel("Project actions", { exact: true }).click();
      await page.getByRole("button", { name, exact: true }).click();
    }
    await menu("New composition");
    await page.getByRole("button", { name: /Blank canvas/ }).click();
    await expect(
      page.getByText("Blank composition · add your first effect", {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByLabel("Search effects").fill("blur");
    await page
      .getByRole("button", { name: "Blur Blurs · child effect", exact: true })
      .click();
    await page.getByLabel("Search effects").fill("linear gradient");
    await page
      .getByRole("button", { name: "Linear Gradient Textures", exact: true })
      .click();
    await menu("Open local project");
    await page
      .getByRole("button", { name: /Imported composition Item Background/ })
      .click();
    await expect(page.getByLabel("Project name")).toHaveValue(
      "Imported composition",
    );
    await menu("Duplicate project");
    await expect(page.getByLabel("Project name")).toHaveValue(
      "Imported composition copy",
    );
    await expect(
      page.getByText("All changes saved", { exact: true }),
    ).toBeVisible();
    await menu("Delete project");
    await expect(
      page.getByRole("heading", { name: "Delete saved project?" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Delete project", exact: true })
      .click();
    await expect(page.getByLabel("Project name")).not.toHaveValue(
      "Imported composition copy",
    );
  },
);
await page
  .getByRole("button", { name: "Website Section", exact: true })
  .click();
await page.getByRole("button", { name: "Preview", exact: true }).click();
await page.screenshot({ path: path.join(root, "desktop.png") });
await run(
  "Mobile preview and drawer editing without viewport overflow",
  async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("button", { name: "mobile preview", exact: true })
      .click();
    await page.getByRole("button", { name: "Inspector", exact: true }).click();
    await expect(page.getByLabel("Heading", { exact: true })).toBeVisible();
    await page.getByLabel("Heading", { exact: true }).fill("Mobile studio");
    await page.getByRole("button", { name: "Inspector", exact: true }).click();
    await page
      .getByRole("button", { name: "Library & layers", exact: true })
      .click();
    await page.getByLabel("Search effects").fill("solid color");
    await page
      .getByRole("button", { name: "Solid Color Textures", exact: true })
      .click();
    await page.getByRole("button", { name: "Inspector", exact: true }).click();
    await expect(page.getByLabel("Layer name")).toHaveValue("Solid Color");
    await page.screenshot({ path: path.join(root, "mobile-controls.png") });
    await page.getByRole("button", { name: "Inspector", exact: true }).click();
    await page.screenshot({ path: path.join(root, "mobile.png") });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  },
);
await run("Reduced-motion fallback", async () => {
  await page.getByLabel("Reduced motion preview", { exact: true }).check();
  await expect(page.locator(".fallback-note")).toContainText(
    "Reduced motion · static preview",
  );
});
expect(errors).toEqual([]);
await fs.writeFile(
  path.join(root, "results.json"),
  JSON.stringify({ results, consoleErrors: errors }, null, 2),
);
const { runAnimationQA } = await import("./animation-qa.mjs");
await runAnimationQA(browser, root);
await browser.close();
console.log(
  `${results.length} browser workflow checks passed; no page errors.`,
);
