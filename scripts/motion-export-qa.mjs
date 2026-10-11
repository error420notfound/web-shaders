/* global indexedDB */
import { chromium, expect } from "@playwright/test";
import process from "node:process";
import fs from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
try {
  for (const disabled of [false, true]) {
    const context = await browser.newContext({
      javaScriptEnabled: !disabled,
      reducedMotion: "reduce",
    });
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4321/");
    await expect(
      page.getByRole("heading", { name: "First instance" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Second instance" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "<script>unsafe()</script>{literal}",
        exact: true,
      }),
    ).toHaveCount(2);
    await expect(page.locator("astro-island")).toHaveCount(0);
    expect(
      await page
        .getByAltText("Fixture image")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
    await page.getByRole("link", { name: "Other page" }).click();
    await page.getByRole("link", { name: "Return" }).click();
    await expect(
      page.getByRole("heading", { name: "First instance" }),
    ).toHaveCount(1);
    expect(errors).toEqual([]);
    await context.close();
    console.log(
      `PASS Astro browser multiple instances, escaped text, image, navigation, reduced motion; JavaScript ${disabled ? "disabled" : "enabled"}`,
    );
  }
  const context = await browser.newContext(),
    page = await context.newPage();
  const base = process.env.MOTION_QA_URL || "http://127.0.0.1:5173";
  await page.route("**/migration-bootstrap", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Migration setup</body></html>",
    }),
  );
  await page.goto(`${base}/migration-bootstrap`);
  await page.evaluate(
    (legacy) =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open("shader-workshop", 1);
        request.onupgradeneeded = () => {
          request.result.createObjectStore("projects", { keyPath: "id" });
          request.result.createObjectStore("settings");
        };
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result,
            tx = db.transaction(["projects", "settings"], "readwrite");
          const p = legacy;
          // Seed a real version-1 shader document and legacy settings.
          tx.objectStore("projects").put(p);
          tx.objectStore("settings").put("sentinel", "legacy-custom-setting");
          tx.objectStore("settings").put(p.id, "active");
          tx.oncomplete = () => {
            db.close();
            resolve(true);
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
    JSON.parse(
      await fs.readFile(
        "output/motion-astro-fixture/legacy-shader.json",
        "utf8",
      ),
    ),
  );
  await page.goto(`${base}/?gpu=off`);
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "Legacy shader project",
  );
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await expect(page.getByLabel("Motion project name")).toBeVisible();
  const preserved = await page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("shader-workshop");
        r.onerror = () => reject(r.error);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction(["projects", "settings"]),
            p = tx.objectStore("projects").get("legacy-preserved"),
            s = tx.objectStore("settings").get("legacy-custom-setting");
          tx.oncomplete = () => {
            resolve({
              version: db.version,
              name: p.result.name,
              setting: s.result,
              stores: Array.from(db.objectStoreNames),
            });
            db.close();
          };
        };
      }),
  );
  expect(preserved).toMatchObject({
    version: 2,
    name: "Legacy shader project",
    setting: "sentinel",
    stores: ["motion-assets", "motion-projects", "projects", "settings"],
  });
  console.log(
    "PASS IndexedDB v1→v2 upgrade preserves original projects/settings and adds motion stores",
  );
  await context.close();
} finally {
  await browser.close();
}
