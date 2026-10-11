import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { Buffer } from "node:buffer";
import process from "node:process";
/* global document, window */
export async function runAnimationQA(browser, root) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    acceptDownloads: true,
  });
  const page = await context.newPage(),
    errors = [],
    checks = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const pass = (name) => {
    checks.push(name);
    console.log(`PASS ${name}`);
  };
  await page.goto("http://127.0.0.1:5173/?gpu=off");
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Animation timeline/ }).click();
  const seek = async (n) => {
    const field = page.getByLabel("Seek seconds", { exact: true });
    await field.fill(String(n));
    await field.press("Enter");
  };
  const angle = page.getByLabel("Angle", { exact: true });
  await page
    .locator("details.property-group")
    .filter({ has: angle })
    .locator("summary")
    .click();
  await expect(angle).toBeVisible();
  await page
    .getByRole("combobox", { name: "Angle source", exact: true })
    .selectOption("auto-animate");
  await page
    .getByRole("combobox", { name: "Angle source", exact: true })
    .selectOption("static");
  await page
    .getByRole("combobox", { name: "Angle source", exact: true })
    .selectOption("auto-animate");
  await page
    .getByRole("button", { name: "Add or select Angle keyframe", exact: true })
    .click();
  await seek(2);
  await angle.fill("245");
  await expect(page.getByText("Staged", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Add or select Angle keyframe", exact: true })
    .click();
  await seek(1);
  await expect(angle).toHaveValue("185");
  await seek(0);
  await page
    .getByRole("button", { name: "Add or select Angle keyframe", exact: true })
    .click();
  await page.getByLabel("Keyframe easing").selectOption("ease-in");
  await seek(1);
  await expect(angle).toHaveValue("155");
  pass("Two keys, staged authoring, reverse seeking and easing");
  await angle.fill("200");
  await seek(0.5);
  await expect(angle).toHaveValue("132.5");
  await expect(page.getByText("Staged", { exact: true })).toHaveCount(0);
  await page.getByLabel("Auto Key", { exact: true }).check();
  await seek(1);
  await angle.fill("180");
  await expect(
    page.getByRole("button", {
      name: "props.angle keyframe at 1 seconds",
      exact: true,
    }),
  ).toHaveCount(1);
  await page.getByLabel("Auto Key", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "props.angle keyframe at 1 seconds",
      exact: true,
    }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  pass("Staged discard, Auto Key and undo/redo");
  const keyAt = (n) =>
    page.getByRole("button", {
      name: `props.angle keyframe at ${n} seconds`,
      exact: true,
    });
  const dragKey = async (from, offset, cancel = false) => {
    const box = await keyAt(from).boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2 + offset,
      box.y + box.height / 2,
      { steps: 5 },
    );
    if (cancel) await page.keyboard.press("Escape");
    await page.mouse.up();
  };
  await dragKey(1, 50);
  await expect(keyAt(1.5)).toHaveCount(1);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(keyAt(1)).toHaveCount(1);
  await expect(keyAt(1.5)).toHaveCount(0);
  await dragKey(1, 25, true);
  await expect(keyAt(1)).toHaveCount(1);
  await dragKey(1, 100);
  await expect(keyAt(1)).toHaveCount(1);
  await keyAt(2).click();
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await seek(3);
  await page.getByRole("button", { name: "Paste", exact: true }).click();
  await expect(keyAt(3)).toHaveCount(1);
  await page.getByRole("button", { name: "Delete keys", exact: true }).click();
  await expect(keyAt(3)).toHaveCount(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(keyAt(3)).toHaveCount(1);
  await keyAt(3).click();
  await page.getByRole("button", { name: "Delete keys", exact: true }).click();
  await page.getByLabel("Duration", { exact: true }).fill("1");
  await page.getByLabel("Duration", { exact: true }).press("Enter");
  await expect(page.getByRole("alert")).toContainText("Move or delete keys");
  await page
    .getByLabel("Angle animation ownership", { exact: true })
    .selectOption("base");
  await expect(angle).toHaveValue("125");
  await page
    .getByLabel("Angle animation ownership", { exact: true })
    .selectOption("timeline");
  await expect(keyAt(2)).toHaveCount(1);
  pass(
    "Keyframe drag transactions, Escape, collisions, copy/paste, deletion and ownership restore",
  );
  await page.getByLabel("Timeline loop mode").selectOption("loop");
  await page
    .getByRole("button", { name: "Play timeline", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause timeline", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pause timeline", exact: true })
    .click();
  await page.getByLabel("Search effects").fill("solid color");
  await page
    .getByRole("button", { name: "Solid Color Textures", exact: true })
    .click();
  await seek(0);
  await page
    .getByRole("button", {
      name: "Add or select Opacity keyframe",
      exact: true,
    })
    .click();
  await seek(2);
  await page.getByLabel("Opacity", { exact: true }).fill("0.2");
  await page
    .getByRole("button", {
      name: "Add or select Opacity keyframe",
      exact: true,
    })
    .click();
  await seek(1);
  await expect(page.getByLabel("Opacity", { exact: true })).toHaveValue("0.6");
  pass("Playback and synchronized tracks on two layers");
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: path.join(root, "animation-desktop.png") });
  await page.reload();
  await expect(
    page.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Animation timeline/ }).click();
  await expect(page.locator(".timeline-track")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "Play timeline", exact: true }),
  ).toBeVisible();
  pass("Autosave refresh retains animation and loads paused");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page.getByRole("button", { name: "Project JSON", exact: true }).click();
  const jsonDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download JSON", exact: true })
    .click();
  const json = await jsonDownload;
  await json.saveAs(path.join(root, "animation.shader.json"));
  const project = JSON.parse(
    await fs.readFile(path.join(root, "animation.shader.json"), "utf8"),
  );
  expect(project.schemaVersion).toBe(2);
  expect(project.animation.tracks).toHaveLength(2);
  expect(project.layers[0].drivers.angle.config.type).toBe("auto-animate");
  expect(project.layers[0].drivers.angle.enabled).toBe(true);
  await page
    .getByRole("button", { name: "React / TypeScript", exact: true })
    .click();
  const codeDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download TSX", exact: true }).click();
  await (await codeDownload).saveAs(path.join(root, "AnimatedComposition.tsx"));
  expect(
    await fs.readFile(path.join(root, "AnimatedComposition.tsx"), "utf8"),
  ).toContain("evaluateTimeline(animationDocument");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.getByLabel("Import project JSON file").setInputFiles({
    name: "animation.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await expect(page.locator(".timeline-track")).toHaveCount(2);
  pass("JSON and self-contained animated TSX export and JSON reimport");
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(
    page.getByLabel("Timeline playhead", { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: path.join(root, "animation-tablet.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Timeline playhead", { exact: true }).focus();
  await page
    .getByLabel("Timeline playhead", { exact: true })
    .press("ArrowRight");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: path.join(root, "animation-mobile.png") });
  await page
    .getByRole("button", { name: "Close timeline", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByLabel("Enable shader preview for timeline editing", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel("Enable shader preview for timeline editing", { exact: true })
    .check();
  await page
    .getByLabel("Enable shader preview for timeline editing", { exact: true })
    .uncheck();
  pass(
    "Tablet/mobile timeline access, keyboard seeking and reduced-motion opt-in",
  );
  expect(errors).toEqual([]);
  await context.close();
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touch = await touchContext.newPage();
  await touch.goto("http://127.0.0.1:5173/?gpu=off");
  await expect(
    touch.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await touch
    .getByLabel("Import project JSON file")
    .setInputFiles({
      name: "touch.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(project)),
    });
  await touch.getByRole("button", { name: /Animation timeline/ }).tap();
  await touch.locator(".ruler-times").tap({ position: { x: 150, y: 10 } });
  await expect(touch.getByLabel("Current timeline time")).toContainText(
    "00:00:01:15",
  );
  const touchKey = touch.getByRole("button", {
    name: "props.angle keyframe at 2 seconds",
    exact: true,
  });
  const box = await touchKey.boundingBox();
  const cdp = await touchContext.newCDPSession(touch);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box.x + box.width / 2 + 50, y: box.y + box.height / 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    touch.getByRole("button", {
      name: "props.angle keyframe at 2.5 seconds",
      exact: true,
    }),
  ).toHaveCount(1);
  pass("Touch-device ruler seeking and keyframe dragging");
  await touchContext.close();
  // Live GPU check is separate from authoring QA and reports availability honestly.
  const gpuContext = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  const gpu = await gpuContext.newPage();
  await gpu.goto("http://127.0.0.1:5173/");
  await expect(
    gpu.getByText("All changes saved", { exact: true }),
  ).toBeVisible();
  await gpu
    .waitForFunction(() => !document.querySelector(".status-loading"), {
      timeout: 15000,
    })
    .catch(() => {});
  const gpuReady = (await gpu.locator(".status-ready").count()) > 0;
  if (gpuReady) {
    const canvas = gpu.locator(".shader-surface canvas").first();
    await canvas.evaluate((el) => {
      el.dataset.animationIdentity = "stable";
    });
    await gpu.getByRole("button", { name: /Animation timeline/ }).click();
    await gpu.getByLabel("Seek seconds", { exact: true }).fill("2");
    await gpu.getByLabel("Seek seconds", { exact: true }).press("Enter");
    await expect(canvas).toHaveAttribute("data-animation-identity", "stable");
    pass("Actual WebGPU canvas remains mounted during seeking");
  } else
    console.log(
      "INFO WebGPU unavailable in this browser; live shader pixels were not verified",
    );
  await fs.writeFile(
    path.join(root, "animation-gpu.json"),
    JSON.stringify({ gpuReady }, null, 2),
  );
  const exportedPage = await gpuContext.newPage();
  const exportErrors = [];
  exportedPage.on("pageerror", (e) => exportErrors.push(e.message));
  await exportedPage.goto(
    "http://127.0.0.1:5173/scripts/generated/animated.html",
  );
  await expect(exportedPage.locator(".shader-composition")).toBeVisible();
  const result = await exportedPage.evaluate(async () => {
    const runtime = await import("/scripts/generated/Animated.tsx");
    const doc = runtime.emptyAnimation();
    doc.loopMode = "ping-pong";
    return {
      end: runtime.playbackTime(doc, 5).time,
      reverse: runtime.playbackTime(doc, 7).time,
    };
  });
  expect(result).toEqual({ end: 5, reverse: 3 });
  expect(exportErrors).toEqual([]);
  pass(
    "Runnable animated React export loads in the browser with the portable runtime",
  );
  await gpuContext.close();
  await fs.writeFile(
    path.join(root, "animation-results.json"),
    JSON.stringify({ checks, errors, gpuReady }, null, 2),
  );
}
if (process.argv[1]?.endsWith("animation-qa.mjs")) {
  const root = path.resolve("output/qa");
  await fs.mkdir(root, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    await runAnimationQA(browser, root);
  } finally {
    await browser.close();
  }
}
