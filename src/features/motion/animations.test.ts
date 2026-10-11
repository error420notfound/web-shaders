import { describe, it, expect } from "vitest";
import {
  makeSequence,
  applyPreset,
  resizeAnimation,
  addKeyframe,
  moveKeyframe,
  resolvedSequences,
  cleanSequences,
} from "./animations";
import {
  createMotionProject,
  componentFromSelection,
  detachMotionInstance,
  deleteDefinition,
  insertInstance,
  makeElement,
  replaceDefinition,
} from "./commands";
import { parseMotionProject, flattenNodes } from "./schema";
import { exportStaticMotion } from "../export/motion/static";
import { editMotion, undoMotion, redoMotion } from "./history";

function animated() {
  const p = createMotionProject(),
    node = flattenNodes(p.scenes[0].roots).find(
      (n) => n.kind === "element" && n.type === "heading",
    )!;
  p.scenes[0].sequences = [
    makeSequence({ kind: "element", elementId: node.id }),
  ];
  return { p, node };
}
describe("motion animation authoring", () => {
  it("resolves nested reusable animation targets and preserves them on detachment", () => {
    const { p, node } = animated();
    const inner = componentFromSelection(p, p.scenes[0].id, node.id);
    const wrapper = makeElement("group");
    wrapper.children = [insertInstance(inner.components[0])];
    const outer = {
      ...inner.components[0],
      id: crypto.randomUUID(),
      root: wrapper,
      sequences: [],
      parameters: [],
    };
    inner.components.push(outer);
    const instance = insertInstance(outer);
    inner.scenes[0].roots = [instance];
    const expanded = resolvedSequences(inner.scenes[0].roots, [], inner);
    expect(expanded).toHaveLength(1);
    inner.scenes[0].sequences = expanded;
    expect(parseMotionProject(inner)).toEqual(inner);
    inner.scenes[0].sequences = [];
    const detached = detachMotionInstance(
      inner,
      inner.scenes[0].id,
      instance.id,
    );
    expect(detached.scenes[0].sequences).toHaveLength(1);
    expect(parseMotionProject(detached)).toEqual(detached);
  });
  it("normalizes legacy keyframes and retains stable IDs and easing on round trip", () => {
    const { p } = animated(),
      a = p.scenes[0].sequences[0].animations[0];
    a.mode = "keyframes";
    const old = JSON.parse(JSON.stringify(p));
    old.scenes[0].sequences[0].animations[0].keyframes = [
      { time: 0, values: { x: 0 } },
      { time: 1, values: { x: 20 }, ease: "none" },
    ];
    const normalized = parseMotionProject(old);
    expect(
      normalized.scenes[0].sequences[0].animations[0].keyframes[0].id,
    ).toBeTruthy();
    expect(parseMotionProject(JSON.parse(JSON.stringify(normalized)))).toEqual(
      normalized,
    );
  });
  it("presets remain editable and preserve timing/target/trigger", () => {
    const { p } = animated(),
      a = p.scenes[0].sequences[0].animations[0];
    const next = applyPreset({ ...a, duration: 3 }, "Clip Reveal");
    expect(next.from.clipPath).toBe("inset(0 100% 0 0)");
    expect(next.duration).toBe(3);
    expect(next.target).toEqual(a.target);
  });
  it("adds interpolated keys, rescales duration, sorts moves, and rejects overlaps", () => {
    const { p } = animated();
    const a = p.scenes[0].sequences[0].animations[0],
      next = addKeyframe(a, 0.5);
    expect(next.keyframes[1].values.opacity).toBe(0.5);
    expect(resizeAnimation(next, 2).keyframes[1].time).toBe(1);
    const moved = moveKeyframe(next, next.keyframes[1].id, 0.75);
    expect(moved.keyframes[1].time).toBe(0.75);
    expect(() => moveKeyframe(next, next.keyframes[1].id, 1)).toThrow(
      /overlaps/,
    );
    expect(() => addKeyframe(a, 0)).toThrow(/exists/);
    expect(() => resizeAnimation(a, 0)).toThrow();
  });
  it("supports one history commit for a completed gesture and preserves redo", () => {
    const { p } = animated(),
      next = structuredClone(p);
    next.scenes[0].sequences[0].animations[0].duration = 2;
    const h = editMotion({ present: p, past: [], future: [] }, next);
    expect(h.past).toHaveLength(1);
    expect(undoMotion(h).present).toEqual(p);
    expect(
      redoMotion(undoMotion(h)).present.scenes[0].sequences[0].animations[0]
        .duration,
    ).toBe(2);
  });
  it("converts an animated selection into a reusable definition and resolves independent instances", () => {
    const { p, node } = animated();
    const next = componentFromSelection(p, p.scenes[0].id, node.id),
      d = next.components[0];
    expect(d.sequences).toHaveLength(1);
    expect(next.scenes[0].sequences).toHaveLength(0);
    next.scenes[0].roots.push(insertInstance(d));
    const sequences = resolvedSequences(next.scenes[0].roots, [], next);
    expect(sequences).toHaveLength(2);
    expect(sequences[0].animations[0].target).not.toEqual(
      sequences[1].animations[0].target,
    );
  });
  it("detaches and deletes definitions without losing inherited animations", () => {
    const { p, node } = animated();
    const next = componentFromSelection(p, p.scenes[0].id, node.id),
      instance = flattenNodes(next.scenes[0].roots).find(
        (n) => n.kind === "instance",
      )!;
    const detached = detachMotionInstance(next, next.scenes[0].id, instance.id);
    expect(detached.scenes[0].sequences).toHaveLength(1);
    expect(detached.scenes[0].sequences[0].animations[0].target).toEqual({
      kind: "element",
      elementId: instance.id,
    });
    expect(parseMotionProject(detached)).toEqual(detached);
    expect(
      deleteDefinition(next, next.components[0].id, "detach").scenes[0]
        .sequences,
    ).toHaveLength(1);
  });
  it("cleans deleted targets and trigger-dependent sequences together", () => {
    const { p } = animated();
    const s = p.scenes[0].sequences[0];
    expect(cleanSequences([s], [], p)).toEqual([]);
    s.trigger = {
      type: "hover",
      target: s.animations[0].target,
      leave: "reverse",
    };
    expect(cleanSequences([s], [], p)).toEqual([]);
  });
  it("remaps external animation targets when replacing compatible definitions", () => {
    const { p, node } = animated();
    p.scenes[0].sequences = [];
    let next = componentFromSelection(p, p.scenes[0].id, node.id);
    const instance = flattenNodes(next.scenes[0].roots).find(
      (n) => n.kind === "instance",
    )!;
    const newRoot = makeElement("heading");
    next.components.push({
      ...next.components[0],
      id: crypto.randomUUID(),
      root: newRoot,
    });
    next.scenes[0].sequences = [
      makeSequence({
        kind: "instance",
        instanceId: instance.id,
        elementId: node.id,
      }),
    ];
    next = replaceDefinition(
      next,
      next.components[0].id,
      next.components[1].id,
    );
    expect(next.scenes[0].sequences[0].animations[0].target.elementId).toBe(
      newRoot.id,
    );
  });
  it("exports only selected sequences, scopes targets, shares compiler, and rejects unsupported options", () => {
    const { p } = animated();
    let files = exportStaticMotion(p, p.scenes[0].id);
    expect(
      String(files.find((f) => f.path === "MotionComponent.astro")?.content),
    ).toContain("data-motion-sequences");
    expect(
      String(files.find((f) => f.path === "motion-runtime.js")?.content),
    ).toContain("createMotionRuntime");
    expect(
      String(files.find((f) => f.path === "motion-init.js")?.content),
    ).toContain("astro:before-swap");
    p.export.target = "vanilla";
    files = exportStaticMotion(p, p.scenes[0].id);
    expect(files.some((f) => f.path === "package.json")).toBe(true);
    p.scenes[0].sequences[0].animations[0].split = "chars";
    expect(() => exportStaticMotion(p, p.scenes[0].id)).toThrow(
      /not supported/,
    );
  });
});
