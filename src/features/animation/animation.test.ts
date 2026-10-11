import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import { createProject, makeLayer } from "../../data/starters";
import { parseProject } from "../compositions/schema";
import { bindings, bindingError } from "./bindings";
import { putKey, moveKeys, deleteKeys } from "./commands";
import {
  evaluateTimeline,
  evaluateTrack,
  playbackTime,
  ease,
  interpolate,
  rgba,
  emptyAnimation,
} from "./runtime";
import type { Track } from "./runtime";
import { normalizeColor } from "./colors";
import { AnimationPlayback } from "./playback";
import { editHistory, undo, redo } from "../compositions/history";
import { generateCode } from "../export/code";
import runtimeSource from "./runtime-source.json";
const numeric = (): Track => ({
  id: "t",
  layerId: "layer",
  propertyPath: "props.angle",
  enabled: true,
  interpolation: "number",
  keyframes: [
    { id: "a", time: 0, value: 0, easing: { type: "linear" } },
    { id: "b", time: 2, value: 360, easing: { type: "linear" } },
  ],
});
describe("animation document and commands", () => {
  it("migrates v1 without mutating stored data or IDs", () => {
    const p = createProject(0);
    const original = { ...p, schemaVersion: 1 } as Record<string, unknown>;
    delete original.animation;
    const result = parseProject(original);
    expect(result.animation).toEqual(emptyAnimation());
    expect(result.id).toBe(p.id);
    expect(original.schemaVersion).toBe(1);
    expect(() => parseProject({ ...p, schemaVersion: 1 })).toThrow(
      /must not contain animation/,
    );
  });
  it("sorts keys; rejects duplicate IDs, bindings, timestamps, invalid values and ranges", () => {
    const p = createProject(0);
    const track = { ...numeric(), layerId: p.layers[0].id };
    p.animation.tracks = [track];
    track.keyframes.reverse();
    expect(parseProject(p).animation.tracks[0].keyframes[0].time).toBe(0);
    const mutate = [
      (q: typeof p) => q.animation.tracks.push(structuredClone(track)),
      (q: typeof p) => (q.animation.tracks[0].keyframes[1].id = "b"),
      (q: typeof p) => (q.animation.tracks[0].keyframes[1].time = 2),
      (q: typeof p) => (q.animation.tracks[0].keyframes[0].value = "bad"),
      (q: typeof p) => (q.animation.range.end = 6),
      (q: typeof p) =>
        (q.animation.tracks[0].keyframes[0].easing = {
          type: "bezier",
          points: [-1, 0, 1, 1],
        }),
    ];
    for (const fn of mutate) {
      const q = structuredClone(p);
      fn(q);
      expect(() => parseProject(q)).toThrow();
    }
  });
  it("retains missing bindings with a warning, validates present bindings", () => {
    const p = createProject(0);
    p.animation.tracks = [numeric()];
    expect(parseProject(p).animation.tracks).toHaveLength(1);
    expect(bindingError(numeric())).toMatch(/missing/);
    p.animation.tracks[0].layerId = p.layers[0].id;
    p.animation.tracks[0].propertyPath = "props.deletedProperty";
    expect(parseProject(p).animation.tracks).toHaveLength(1);
    p.animation.tracks[0].propertyPath = "modifiers.opacity";
    expect(() => parseProject(p)).toThrow(/Maximum/);
  });
  it("inserts and updates keys, clamps moves, rejects collisions atomically and removes last keys", () => {
    const p = createProject(0),
      layer = p.layers[0],
      b = bindings(layer).find((b) => b.path === "props.angle")!;
    let doc = putKey(p.animation, layer.id, b, 0, 10);
    doc = putKey(doc, layer.id, b, 2, 20);
    doc = putKey(doc, layer.id, b, 2, 30);
    expect(doc.tracks[0].keyframes).toHaveLength(2);
    expect(evaluateTimeline(doc, 1)[layer.id][b.path]).toBe(20);
    const ids = new Set([doc.tracks[0].keyframes[1].id]);
    expect(() => moveKeys(doc, ids, -2)).toThrow(/timestamp/);
    expect(doc.tracks[0].keyframes[1].time).toBe(2);
    expect(moveKeys(doc, ids, 100).tracks[0].keyframes[1].time).toBe(5);
    expect(
      deleteKeys(doc, new Set(doc.tracks[0].keyframes.map((k) => k.id))).tracks,
    ).toEqual([]);
  });
});
describe("deterministic evaluation", () => {
  it("evaluates endpoints, exact keys, arbitrary reverse seeks and authored revolutions", () => {
    const t = numeric();
    for (const time of [2, 1, 0, 1.5, 0.5, 5, -1])
      expect(evaluateTrack(t, time)).toBe(
        Math.max(0, Math.min(360, time * 180)),
      );
    expect(evaluateTrack({ ...t, keyframes: [] }, 1)).toBeUndefined();
    expect(evaluateTrack({ ...t, enabled: false }, 1)).toBeUndefined();
    t.keyframes[1].value = 1080;
    expect(evaluateTrack(t, 1)).toBe(540);
  });
  it("supports easing presets, hold and cubic-bezier", () => {
    expect(ease({ type: "ease-in" }, 0.5)).toBe(0.25);
    expect(ease({ type: "ease-out" }, 0.5)).toBe(0.75);
    expect(ease({ type: "ease-in-out" }, 0.5)).toBe(0.5);
    expect(ease({ type: "hold" }, 0.999)).toBe(0);
    expect(ease({ type: "hold" }, 1)).toBe(1);
    expect(ease({ type: "bezier", points: [0, 0, 1, 1] }, 0.5)).toBeCloseTo(
      0.5,
      8,
    );
    expect(
      ease({ type: "bezier", points: [0.25, 0.1, 0.25, 1] }, 0.5),
    ).toBeCloseTo(0.8024, 3);
  });
  it("interpolates vectors and positions and holds discrete values", () => {
    expect(interpolate("vector", [0, 2], [2, 4], 0.5)).toEqual([1, 3]);
    expect(
      interpolate("position", { x: 0, y: 1 }, { x: 1, y: 0 }, 0.5),
    ).toEqual({ x: 0.5, y: 0.5 });
    expect(interpolate("discrete", false, true, 0.9)).toBe(false);
    expect(interpolate("discrete", "a", "b", 1)).toBe("b");
  });
  it("normalizes CSS colors and interpolates perceptually with premultiplied alpha", () => {
    expect(normalizeColor("red")).toBe(normalizeColor("#ff0000"));
    expect(normalizeColor("hsl(120 100% 50%)")).toBe(normalizeColor("#00ff00"));
    expect(normalizeColor("rgb(100% 0% 0% / 50%)")).toBe(
      "rgba(255, 0, 0, 0.5)",
    );
    expect(normalizeColor("oklab(0.5 0 0)")).toMatch(/^rgba/);
    expect(() => normalizeColor("garbage")).toThrow();
    const value = rgba(
      interpolate("color", "#ff000000", "#0000ff", 0.5) as string,
    );
    expect(value[0]).toBeCloseTo(0, 5);
    expect(value[2]).toBeCloseTo(1, 5);
    expect(value[3]).toBe(0.5);
    expect(
      rgba(interpolate("color", "#000", "#fff", 0.5) as string)[0],
    ).toBeCloseTo(0.3886, 3);
  });
  it("maps loop, ping-pong, negative time and exact boundaries", () => {
    const doc = emptyAnimation();
    doc.range = { start: 1, end: 3 };
    expect(playbackTime(doc, 4).time).toBe(3);
    doc.loopMode = "loop";
    expect(playbackTime(doc, 3).time).toBe(1);
    expect(playbackTime(doc, 0).time).toBe(2);
    doc.loopMode = "ping-pong";
    expect(playbackTime(doc, 3).time).toBe(3);
    expect(playbackTime(doc, 4).time).toBe(2);
    expect(playbackTime(doc, 5).time).toBe(1);
  });
});
describe("playback and history", () => {
  afterEach(() => vi.unstubAllGlobals());
  function clock() {
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    return new AnimationPlayback();
  }
  it("uses elapsed time, one clock, reverse speed and preserves ping-pong direction on resume", () => {
    let callback: FrameRequestCallback = () => {};
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const raf = vi.fn((fn: FrameRequestCallback) => {
      callback = fn;
      return 1;
    });
    vi.stubGlobal("requestAnimationFrame", raf);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const playback = new AnimationPlayback();
    playback.play();
    playback.play();
    expect(raf).toHaveBeenCalledTimes(1);
    now = 2200;
    callback(now);
    expect(playback.time).toBeCloseTo(2.2);
    now = 10000;
    callback(now);
    expect(playback.time).toBe(5);
    expect(playback.playing).toBe(false);
    playback.seek(4);
    playback.setSpeed(-1);
    playback.play();
    now = 11000;
    callback(now);
    expect(playback.time).toBe(3);
    playback.pause();
    playback.setSpeed(1);
    playback.document.loopMode = "ping-pong";
    playback.seek(0);
    playback.play();
    now = 18000;
    callback(now);
    expect(playback.time).toBe(3);
    playback.pause();
    playback.play();
    now = 19000;
    callback(now);
    expect(playback.time).toBe(2);
    playback.dispose();
    expect(playback.playing).toBe(false);
    vi.restoreAllMocks();
  });
  it("timeline precedence, disabled-track restore, orphan filtering and staged values", () => {
    const p = createProject(0),
      layer = p.layers[0],
      playback = clock(),
      binding = bindings(layer).find((b) => b.path === "props.angle")!;
    layer.drivers.angle = {
      rest: 125,
      config: {
        type: "auto-animate",
        mode: "loop",
        outputMin: 0,
        outputMax: 360,
      },
    };
    const doc = putKey(p.animation, layer.id, binding, 0, 30);
    doc.tracks.push(numeric());
    playback.configure(doc, [layer]);
    expect(playback.layerSnapshot(layer.id)[binding.path]).toBe(30);
    expect(playback.layerSnapshot("layer")).toEqual({});
    playback.stage(layer.id, binding.path, 45);
    expect(playback.layerSnapshot(layer.id)[binding.path]).toBe(45);
    playback.seek(1);
    expect(playback.layerSnapshot(layer.id)[binding.path]).toBe(30);
    doc.tracks[0].enabled = false;
    playback.configure(doc, [layer]);
    expect(playback.layerSnapshot(layer.id)).toEqual({});
    expect(layer.drivers.angle.rest).toBe(125);
  });
  it("keeps seeking out of project history and restores committed edits", () => {
    const p = createProject(0),
      binding = bindings(p.layers[0]).find((b) => b.path === "props.angle")!;
    const next = {
      ...p,
      animation: putKey(p.animation, p.layers[0].id, binding, 0, 30),
    };
    const h = editHistory(
      { present: p, past: [], future: [], changedAt: 0 },
      next,
    );
    const playback = clock();
    playback.configure(next.animation, next.layers);
    playback.seek(2);
    playback.seek(0);
    expect(h.past).toHaveLength(1);
    expect(undo(h).present.animation.tracks).toHaveLength(0);
    expect(redo(undo(h)).present.animation.tracks).toHaveLength(1);
  });
  it("excludes unsupported structures and includes nested-layer transform bindings", () => {
    const layer = makeLayer("Circle");
    expect(
      bindings(layer).some((b) => b.path === "modifiers.transform.rotation"),
    ).toBe(true);
    expect(
      bindings(makeLayer("ImageTexture")).some((b) => b.path === "props.url"),
    ).toBe(false);
  });
});
describe("portable exports", () => {
  it("embeds the exact shared runtime and applies values after driver configs", () => {
    expect(runtimeSource).toBe(
      fs.readFileSync(new URL("./runtime.ts", import.meta.url), "utf8"),
    );
    const p = createProject(0),
      layer = p.layers[0],
      b = bindings(layer).find((b) => b.path === "props.angle")!;
    p.animation = putKey(p.animation, layer.id, b, 0, 10);
    p.animation = putKey(p.animation, layer.id, b, 2, 50);
    const code = generateCode(p).code;
    expect(code).toContain(runtimeSource);
    expect(code).toContain("evaluateTimeline(animationDocument");
    expect(code).not.toContain("IndexedDB");
    const imported = parseProject(JSON.parse(JSON.stringify(p)));
    expect(evaluateTimeline(imported.animation, 1)).toEqual(
      evaluateTimeline(p.animation, 1),
    );
  });
});
