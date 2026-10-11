/* global getComputedStyle */
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { URL } from 'node:url';
const root = path.resolve("output/motion-vanilla-fixture/dist");
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = path.resolve(root, name === "/" ? "index.html" : `.${name}`);
    if (!file.startsWith(root + path.sep)) throw new Error("Invalid path");
    const body = await fs.readFile(file);
    res.setHeader(
      "Content-Type",
      file.endsWith(".js")
        ? "text/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : file.endsWith(".html")
            ? "text/html"
            : "application/octet-stream",
    );
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch();
try {
  const page = await browser.newPage(),
    errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const samples = JSON.parse(
    await fs.readFile("output/qa/motion-preview-samples.json", "utf8"),
  );
  for (const sample of samples) {
    const actual = await page
      .locator("[data-motion-export]")
      .evaluate((root, time) => {
        for (const tl of root.motionRuntime.timelines.values())
          tl.pause(time, false);
        const style = getComputedStyle(root.querySelector("h2"));
        return { opacity: Number(style.opacity), transform: style.transform };
      }, sample.time);
    expect(actual.opacity).toBeCloseTo(sample.opacity, 3);
    expect(actual.transform).toBe(sample.transform);
  }
  expect(errors).toEqual([]);
  console.log(
    "PASS built vanilla export reproduces editor opacity/transforms at matching sample times",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
