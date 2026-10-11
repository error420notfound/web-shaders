import { chromium, expect } from "@playwright/test";
import process from "node:process";
/* global navigator */
const base = process.env.MOTION_PWA_URL || "http://127.0.0.1:4173/web-shaders/";
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext(),
    page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}?gpu=off`);
  await expect(
    page.getByRole("button", { name: "Motion Designer", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(page.getByLabel("Motion project name")).toBeVisible();
  await page.getByLabel("Motion project name").fill("Offline motion project");
  await expect(page.locator(".saved-state:visible")).toHaveText(
    "All changes saved",
  );
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(page.getByLabel("Motion project name")).toHaveValue(
    "Offline motion project",
  );
  await expect(
    page
      .frameLocator('iframe[title="Motion scene preview"]')
      .getByRole("heading", { name: "Make something move." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    "PASS production /web-shaders/ base path, service worker, offline reload, cached lazy workspace and local persistence",
  );
} finally {
  await browser.close();
}
