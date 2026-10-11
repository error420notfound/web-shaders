import { describe, it, expect } from "vitest";
import { createProject, makeLayer } from "../../data/starters";
import { registry, propError } from "../../data/registry";
import { parseProject, cloneLayer, flatten } from "./schema";
import { editHistory, undo, redo } from "./history";
import { generateCode, codeWarnings } from "../export/code";

describe("verified package and project format", () => {
  it("accepts every installed component default", () => {
    for (const e of registry)
      for (const [key, p] of Object.entries(e.props))
        expect(propError(p.default, p), `${e.name}.${key}`).toBeUndefined();
  });
  it("validates and round-trips all six starters", () => {
    for (let i = 0; i < 6; i++) {
      const p = createProject(i);
      expect(parseProject(JSON.parse(JSON.stringify(p)))).toEqual(p);
    }
  });
  it("rejects unknown components, props, versions and unavailable assets without mutating input", () => {
    for (const change of [
      (p: any) => (p.schemaVersion = 99),
      (p: any) => (p.layers[0].type = "MissingComponent"),
      (p: any) => (p.layers[0].props.fakeProperty = 123),
      (p: any) => (p.preview.image = "blob:missing"),
    ]) {
      const p = createProject(0);
      change(p);
      const before = JSON.stringify(p);
      expect(() => parseProject(p)).toThrow();
      expect(JSON.stringify(p)).toBe(before);
    }
  });
  it("rejects invalid ranges and duplicate IDs", () => {
    const p = createProject(0);
    p.layers[0].modifiers.opacity = 2;
    expect(() => parseProject(p)).toThrow(/opacity/);
    p.layers[0].modifiers.opacity = 1;
    p.layers.push(structuredClone(p.layers[0]));
    expect(() => parseProject(p)).toThrow(/Duplicate/);
  });
  it("duplicates nested trees and remaps internal references", () => {
    const child = makeLayer("Circle");
    const root = makeLayer("Group", {}, [child]);
    root.modifiers.maskSource = child.id;
    const clone = cloneLayer(root);
    expect(clone.modifiers.maskSource).toBe(clone.children[0].id);
    expect(flatten([clone]).map((l) => l.id)).not.toEqual(
      flatten([root]).map((l) => l.id),
    );
  });
});
describe("undo and export", () => {
  it("coalesces a long pointer drag and keeps separate drags distinct", () => {
    const p = createProject(0);
    const initial = { present: p, past: [], future: [], changedAt: 0 };
    const first = editHistory(
      initial,
      { ...p, name: "First" },
      "slider",
      100,
      true,
    );
    const next = editHistory(
      first,
      { ...p, name: "Last" },
      "slider",
      4000,
      true,
    );
    expect(next.past).toHaveLength(1);
    expect(
      editHistory(
        { ...next, group: undefined },
        { ...p, name: "Second drag" },
        "slider",
        4100,
        true,
      ).past,
    ).toHaveLength(2);
  });
  it("coalesces rapid property changes and supports redo", () => {
    const p = createProject(0);
    let h = { present: p, past: [], future: [], changedAt: 0 } as Parameters<
      typeof editHistory
    >[0];
    h = editHistory(h, { ...p, name: "One" }, "name", 100);
    h = editHistory(h, { ...p, name: "Two" }, "name", 200);
    expect(h.past).toHaveLength(1);
    expect(undo(h).present.name).toBe(p.name);
    expect(redo(undo(h)).present.name).toBe("Two");
  });
  it("exports actual nested components and optional section content", () => {
    const result = generateCode(createProject(2), true);
    expect(result.code).toContain("Shader, Glass, LinearGradient");
    expect(result.code).toContain("</Glass>");
    expect(result.code).toContain("onUnavailable");
    expect(result.code).toContain("prefers-reduced-motion");
    expect(result.code).toContain("<section");
    expect(result.warnings).toEqual([]);
  });
  it("warns and blocks when custom source is missing", () => {
    const p = createProject(0);
    p.layers[0].type = "CustomExample";
    expect(codeWarnings(p)[0]).toContain("source");
    expect(generateCode(p).code).toContain("Export blocked");
  });
});
