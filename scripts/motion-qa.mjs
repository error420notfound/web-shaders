import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import process from "node:process";
const base = process.env.MOTION_QA_URL || "http://127.0.0.1:5173";
await fs.mkdir("output/qa", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    acceptDownloads: true,
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/?gpu=off`);
  await expect(
    page
      .locator(".saved-state:visible")
      .filter({ hasText: "All changes saved" }),
  ).toBeVisible();
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Shader retained");
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(page.getByLabel("Motion project name")).toBeVisible();
  await expect(
    page
      .locator(".saved-state:visible")
      .filter({ hasText: "All changes saved" }),
  ).toBeVisible();
  await page.getByLabel("Motion project name").fill("Motion QA project");
  const frame = page.frameLocator('iframe[title="Motion scene preview"]');
  await expect(
    frame.getByRole("heading", { name: "Make something move." }),
  ).toBeVisible();
  await frame.getByRole("heading", { name: "Make something move." }).click();
  await page.getByLabel("Text content", { exact: true }).fill("QA headline");
  await page.getByLabel("Text content", { exact: true }).blur();
  await expect(
    frame.getByRole("heading", { name: "QA headline" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Create component", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit Heading definition" }).click();
  await page.getByLabel("Public prop name").fill("headline");
  await page
    .getByRole("button", { name: "Expose property", exact: true })
    .click();
  await page.getByRole("button", { name: "Back to scene" }).click();
  await page
    .getByRole("button", { name: "Insert Heading", exact: true })
    .click();
  await page.getByLabel("Parameter headline").fill("Instance override");
  await page.getByLabel("Parameter headline").blur();
  await expect(
    frame.getByRole("heading", { name: "Instance override" }),
  ).toBeVisible();
  await page.getByLabel("Move into container").selectOption({ label: "Section" });
  await page.getByRole("button", { name: "Edit Heading definition" }).click();
  await page.getByLabel("headline default").fill("Updated definition");
  await page.getByLabel("headline default").blur();
  await page.getByRole("button", { name: "Back to scene" }).click();
  await expect(frame.getByRole("heading", { name: "Updated definition" })).toBeVisible();
  await expect(frame.getByRole("heading", { name: "Instance override" })).toBeVisible();
  // Select the overridden instance for the existing undo/redo check.
  await frame.getByRole("heading", { name: "Instance override" }).click();
  await page
    .getByRole("button", { name: "Shader Designer", exact: true })
    .click();
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "Shader retained",
  );
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(
    frame.getByRole("heading", { name: "Instance override" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Undo motion edit" }).click();
  await expect(frame.getByRole("heading", { name: "Updated definition" })).toHaveCount(0);
  await page.getByRole("button", { name: "Redo motion edit" }).click();
  await expect(
    frame.getByRole("heading", { name: "Instance override" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download scene",exact:true }).click();
  await (await dl).saveAs("output/qa/motion-static.zip");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(
    page
      .locator(".saved-state:visible")
      .filter({ hasText: "All changes saved" }),
  ).toBeVisible();
  await page.screenshot({
    path: "output/qa/motion-desktop.png",
    fullPage: true,
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(page.getByLabel("Motion project name")).toHaveValue(
    "Motion QA project",
  );
  await expect(
    frame.getByRole("heading", { name: "Instance override" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Inspector", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Element inspector" }),
  ).toBeVisible();
  await page.screenshot({
    path: "output/qa/motion-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Close inspector", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Element inspector" })).toBeHidden();
  expect(errors).toEqual([]);
  console.log(
    "PASS motion scene editing, component overrides, workspace history, static export, reload, mobile drawer; no page errors",
  );
} finally {
  await browser.close();
}
