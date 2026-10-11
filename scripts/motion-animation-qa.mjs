/* global document, getComputedStyle, innerWidth */
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import process from "node:process";
const base = process.env.MOTION_QA_URL || "http://127.0.0.1:5173";
const out = "output/qa";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      acceptDownloads: true,
    }),
    errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.goto(`${base}/?gpu=off`);
  await expect(page).toHaveTitle('Shader Workshop');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await page.getByRole("button", { name: "New", exact: true }).click();
  await page
    .getByRole("button", { name: "Create new motion project", exact: true })
    .click();
  await page
    .getByLabel("Motion project name", { exact: true })
    .fill("Animation authoring QA");
  await page.getByRole("button", { name: "+ Scene", exact: true }).click();
  await page.getByRole("button", { name: "heading", exact: true }).click();
  await page.getByRole("button", { name: "Animation", exact: true }).click();
  await expect(
    page.getByText("No animations on this element.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add Animation", exact: true })
    .click();
  await page
    .getByLabel("Animation preset", { exact: true })
    .selectOption("Fade + Slide");
  async function field(label, value) {
    const input = page.getByLabel(label, { exact: true });
    await input.fill(String(value));
    await input.blur();
  }
  await page.getByLabel("Animate x", { exact: true }).check();
  await field("x initial", -30);
  await field("x final", 0);
  await field("y initial", 60);
  await field("opacity initial", 0);
  await field("Duration", 2);
  await page
    .getByLabel("Animation easing", { exact: true })
    .selectOption("none");
  const frame = page.frameLocator('iframe[title="Motion scene preview"]');
  async function sample() {
    return frame.locator("h2").evaluate((el) => {
      const style = getComputedStyle(el);
      return { opacity: Number(style.opacity), transform: style.transform };
    });
  }
  await page.getByLabel("Motion playhead", { exact: true }).fill("0.5");
  expect((await sample()).opacity).toBeCloseTo(0.25, 3);
  await page
    .locator(".motion-timeline-detail")
    .getByRole("button", { name: "Add keyframe at playhead", exact: true })
    .click();
  await expect(page.getByLabel("Keyframe time", { exact: true })).toHaveValue(
    "0.5",
  );
  const marker = page.getByRole("button", {
    name: "opacity keyframe at 0.500 seconds",
    exact: true,
  });
  const rect = await marker.boundingBox();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    rect.x + rect.width / 2 + 25,
    rect.y + rect.height / 2,
    { steps: 5 },
  );
  await page.mouse.up();
  expect(
    Number(
      await page.getByLabel("Keyframe time", { exact: true }).inputValue(),
    ),
  ).toBeCloseTo(0.75, 2);
  await page
    .getByRole("button", { name: "Undo timeline edit", exact: true })
    .click();
  await expect(page.getByLabel("Keyframe time", { exact: true })).toHaveValue(
    "0.5",
  );
  await page
    .getByRole("button", { name: "Redo timeline edit", exact: true })
    .click();
  expect(
    Number(
      await page.getByLabel("Keyframe time", { exact: true }).inputValue(),
    ),
  ).toBeCloseTo(0.75, 2);
  await field("Duration", 3);
  expect(
    Number(
      await page.getByLabel("Keyframe time", { exact: true }).inputValue(),
    ),
  ).toBeCloseTo(1.125, 2);
  await field("Duration", 2);
  const bar = page.locator(".motion-tween-bar").first();
  const br = await bar.boundingBox();
  await page.mouse.move(br.x + 20, br.y + 10);
  await page.mouse.down();
  await page.mouse.move(br.x + 40, br.y + 10, { steps: 4 });
  await page.mouse.up();
  expect(
    Number(await page.getByLabel("Start time", { exact: true }).inputValue()),
  ).toBeCloseTo(0.2, 2);
  await page
    .getByRole("button", { name: "Undo timeline edit", exact: true })
    .click();
  await expect(page.getByLabel("Start time", { exact: true })).toHaveValue("0");
  const cancelRect = await bar.boundingBox();
  await page.mouse.move(cancelRect.x + 20, cancelRect.y + 10);
  await page.mouse.down();
  await page.mouse.move(cancelRect.x + 40, cancelRect.y + 10, { steps: 3 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.getByLabel("Start time", { exact: true })).toHaveValue("0");
  await page
    .getByRole("button", { name: "Restart motion timeline", exact: true })
    .click();
  await page.waitForTimeout(250);
  await page
    .getByRole("button", { name: "Pause motion timeline", exact: true })
    .click();
  expect(
    Number(
      (await page.getByLabel("Motion timeline time").innerText())
        .split("·")[1]
        .replace("s", "")
        .trim(),
    ),
  ).toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Stop motion timeline", exact: true })
    .click();
  for (const mode of ["from", "to", "fromTo"]) {
    await page.getByLabel("Animation type", { exact: true }).selectOption(mode);
    await page.getByLabel("Motion playhead", { exact: true }).fill("1");
    expect((await sample()).opacity).toBeGreaterThanOrEqual(0);
  }
  await page
    .getByLabel("Animation preset", { exact: true })
    .selectOption("Fade + Slide");
  await field("Duration", 2);
  await page
    .getByLabel("Animation easing", { exact: true })
    .selectOption("none");
  for (const trigger of ["hover", "click", "viewport", "scroll", "load"]) {
    await page
      .getByLabel("Animation trigger", { exact: true })
      .selectOption(trigger);
    await page
      .getByRole("button", { name: "Test triggers", exact: true })
      .click();
    if (trigger === "hover") await frame.locator("h2").hover();
    if (trigger === "click") await frame.locator("h2").click();
    if (trigger === "viewport")
      await frame
        .locator("#motion-root")
        .evaluate((el) => (el.scrollTop = 600));
    if (trigger === "scroll") {
      await frame.locator("#motion-root").evaluate((el) => (el.scrollTop = 0));
      await page.waitForTimeout(150);
      const before = (await sample()).opacity;
      await frame
        .locator("#motion-root")
        .evaluate((el) => (el.scrollTop = 700));
      await page.waitForTimeout(200);
      expect((await sample()).opacity).toBeGreaterThan(before);
    } else {
      await page.waitForTimeout(200);
      expect((await sample()).opacity).toBeGreaterThan(0);
    }
    await page.getByRole("button", { name: "Edit", exact: true }).click();
  }
  await field("Repeat", 1);
  await page.getByText("Yoyo", { exact: true }).check();
  await page.getByLabel("Motion playhead", { exact: true }).fill("3");
  expect((await sample()).opacity).toBeCloseTo(0.5, 2);
  await field("Repeat", 0);
  await page.getByText("Yoyo", { exact: true }).uncheck();
  await page.getByLabel("Motion playhead", { exact: true }).fill("0.5");
  await page
    .locator(".motion-timeline-detail")
    .getByRole("button", { name: "Add keyframe at playhead", exact: true })
    .click();
  const golden = [];
  for (const time of [0, 0.3, 0.9, 1.8, 2]) {
    await page
      .getByLabel("Motion playhead", { exact: true })
      .fill(String(time));
    golden.push({ time, ...(await sample()) });
  }
  await fs.writeFile(
    `${out}/motion-preview-samples.json`,
    JSON.stringify(golden, null, 2),
  );
  await page.getByLabel("Motion playhead", { exact: true }).fill("0.9");
  await expect(page.locator(".motion-workshop .saved-state")).toHaveText(
    "All changes saved",
  );
  await page.locator(".motion-inspector").evaluate((el) => (el.scrollTop = 0));
  await page.screenshot({ path: `${out}/motion-animation-desktop.png` });
  await page.getByRole('button',{name:'Play motion timeline',exact:true}).click();
  await page.getByRole('button',{name:'Shader Designer',exact:true}).click();
  await expect(page.getByLabel('Project name',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Motion Designer',exact:true}).click();
  await expect(page.getByRole('button',{name:'Play motion timeline',exact:true})).toBeVisible();
  await page.getByLabel('Motion playhead',{exact:true}).fill('0.9');
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const jsonDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download project JSON", exact: true })
    .click();
  await (await jsonDownload).saveAs(`${out}/motion-animation-project.json`);
  const doc = JSON.parse(
    await fs.readFile(`${out}/motion-animation-project.json`, "utf8"),
  );
  const anim = doc.scenes.at(-1).sequences[0].animations[0];
  expect(anim.keyframes).toHaveLength(3);
  expect(Object.keys(anim.from).sort()).toEqual(["opacity", "y"]);
  const zipDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download scene", exact: true })
    .click();
  await (await zipDownload).saveAs(`${out}/motion-animation.zip`);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Motion Designer", exact: true })
    .click();
  await page
    .getByLabel("Active motion scene", { exact: true })
    .selectOption(doc.scenes.at(-1).id);
  await page
    .locator(".motion-tree-row")
    .filter({ hasText: "Heading" })
    .first()
    .click();
  await page.getByRole("button", { name: "Animation", exact: true }).click();
  await expect(page.getByLabel("Duration", { exact: true })).toHaveValue("2");
  await expect(page.getByLabel("Animation type", { exact: true })).toHaveValue(
    "keyframes",
  );
  await page.getByLabel("Motion playhead", { exact: true }).fill("0.9");
  expect((await sample()).opacity).toBeCloseTo(
    golden.find((s) => s.time === 0.9).opacity,
    3,
  );
  for (const [label, width, height] of [
    ["tablet", 820, 1180],
    ["mobile", 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    if (!(await page.locator(".motion-inspector").isVisible()))
      await page
        .getByRole("button", { name: "Inspector", exact: true })
        .click();
    await expect(page.getByLabel("Duration", { exact: true })).toBeVisible();
    if (label === "mobile") {
      await page
        .getByRole("button", { name: "Close timeline", exact: true })
        .click();
      await page
        .getByLabel("Duration", { exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${out}/motion-animation-mobile-inspector.png`,
      });
      await page
        .getByRole("button", {
          name: "Animation timeline 1 animations",
          exact: true,
        })
        .click();
    }
    await page.screenshot({ path: `${out}/motion-animation-${label}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
  console.log(
    "PASS motion animation workflow, scrubbing, gestures/cancel/history, all triggers, repeat/yoyo, persistence, export download, desktop/tablet/mobile, no page errors",
  );
} finally {
  await browser.close();
}
