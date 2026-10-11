/* global document, getComputedStyle */
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import process from "node:process";
const base = process.env.MOTION_EXPORT_QA_URL || "http://127.0.0.1:4321";
const samples = JSON.parse(
  await fs.readFile("output/qa/motion-preview-samples.json", "utf8"),
);
const browser = await chromium.launch();
try {
  const page = await browser.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/animated/`);
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-motion-export]")].every(
      (el) => el.motionRuntime,
    ),
  );
  for (const sample of samples) {
    const state = await page
      .locator("[data-motion-export]")
      .first()
      .evaluate((root, time) => {
        for (const timeline of root.motionRuntime.timelines.values())
          timeline.pause(time, false);
        const style = getComputedStyle(root.querySelector("h2"));
        return { opacity: Number(style.opacity), transform: style.transform };
      }, sample.time);
    expect(state.opacity).toBeCloseTo(sample.opacity, 3);
    expect(state.transform).toBe(sample.transform);
  }
  const independent = await page.evaluate(() => {
    const [a, b] = document.querySelectorAll("[data-motion-export]");
    for (const t of a.motionRuntime.timelines.values()) t.pause(0.3, false);
    for (const t of b.motionRuntime.timelines.values()) t.pause(1.8, false);
    return [a, b].map((root) =>
      Number(getComputedStyle(root.querySelector("h2")).opacity),
    );
  });
  expect(independent[1]).toBeGreaterThan(independent[0]);
  await page.getByRole("link", { name: "Other page" }).click();
  await page.waitForURL("**/other/");
  await page.goBack();
  await page.waitForURL("**/animated/");
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-motion-export]")].every(
      (el) => el.motionRuntime,
    ),
  );
  await expect(page.locator("[data-motion-export]")).toHaveCount(2);
  expect(errors).toEqual([]);
  await page.screenshot({ path: "output/qa/motion-animated-export.png" });
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: "reduce",
    });
    const p = await context.newPage();
    await p.goto(`${base}/animated/`);
    await expect(p.getByRole("heading").first()).toBeVisible();
    expect(
      await p
        .getByRole("heading")
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
    await context.close();
  }
  console.log(
    "PASS animated Astro preview/export interpolation equivalence, independent instances, navigation cleanup, reduced motion, JavaScript-disabled markup",
  );
} finally {
  await browser.close();
}
