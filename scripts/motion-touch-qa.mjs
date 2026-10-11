import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import process from "node:process";
const base = process.env.MOTION_QA_URL || "http://127.0.0.1:5173";
const project = JSON.parse(
  await fs.readFile("output/qa/motion-animation-project.json", "utf8"),
);
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${base}/?gpu=off`);
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .tap();
  await page
    .getByLabel("Import motion project JSON", { exact: true })
    .setInputFiles("output/qa/motion-animation-project.json");
  await expect(
    page.getByLabel("Motion project name", { exact: true }),
  ).toHaveValue(project.name);
  await page
    .getByRole("button", { name: "Library & hierarchy", exact: true })
    .tap();
  await page
    .getByLabel("Active motion scene", { exact: true })
    .selectOption(project.scenes.at(-1).id);
  await page.getByRole("button", { name: "Close timeline", exact: true }).tap();
  await page
    .locator(".motion-tree-row")
    .filter({ hasText: "Heading" })
    .first()
    .tap();
  await page.getByRole("button", { name: "Inspector", exact: true }).tap();
  await page.getByRole("button", { name: "Animation", exact: true }).tap();
  await page
    .getByRole("button", {
      name: "Animation timeline 1 animations",
      exact: true,
    })
    .tap();
  const key = page.getByRole("button", {
      name: "opacity keyframe at 0.500 seconds",
      exact: true,
    }),
    box = await key.boundingBox();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box.x + box.width / 2 + 25, y: box.y + box.height / 2 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    page.getByRole("button", {
      name: "opacity keyframe at 0.750 seconds",
      exact: true,
    }),
  ).toHaveCount(1);
  await page.keyboard.press("Control+z");
  await expect(
    page.getByRole("button", {
      name: "opacity keyframe at 0.500 seconds",
      exact: true,
    }),
  ).toHaveCount(1);
  console.log(
    "PASS mobile touch keyframe dragging and single-transaction keyboard undo",
  );
} finally {
  await browser.close();
}
