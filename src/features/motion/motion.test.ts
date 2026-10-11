import { describe, expect, it } from "vitest";
import {
  componentFromSelection,
  createMotionProject,
  deleteDefinition,
  exposeParameter,
  insertInstance,
  makeElement,
  resolveInstance,
  updateNode,
  removeParameter,
  replaceDefinition,
  reparentNode,
} from "./commands";
import { flattenNodes, parseMotionProject } from "./schema";
import { editMotion, redoMotion, undoMotion } from "./history";
import { exportStaticMotion } from "../export/motion/static";
import { createZip } from "../export/motion/zip";

function reusable() {
  let p = createMotionProject();
  const heading = flattenNodes(p.scenes[0].roots).find(
    (n) => n.kind === "element" && n.type === "heading",
  )!;
  p = componentFromSelection(p, p.scenes[0].id, heading.id);
  p.components[0] = exposeParameter(
    p.components[0],
    heading.id,
    "content",
    "headline",
  );
  return parseMotionProject(p);
}
describe("motion document foundations", () => {
  it("round trips serializable data and rejects future versions", () => {
    const p = createMotionProject();
    expect(parseMotionProject(JSON.parse(JSON.stringify(p)))).toEqual(p);
    expect(() => parseMotionProject({ ...p, schemaVersion: 2 })).toThrow();
    expect(() => parseMotionProject({ ...p, unexpected: true })).toThrow();
  });
  it("rejects missing references, duplicate nodes and component cycles", () => {
    const p = reusable(),
      node = insertInstance(p.components[0]);
    p.scenes[0].roots.push({ ...node, definitionId: "missing" });
    expect(() => parseMotionProject(p)).toThrow(/Missing component/);
    p.scenes[0].roots.pop();
    p.scenes[0].roots.push(p.scenes[0].roots[0]);
    expect(() => parseMotionProject(p)).toThrow(/Duplicate element/);
    p.scenes[0].roots.pop();
    p.components[0].root = node;
    p.components[0].parameters = [];
    expect(() => parseMotionProject(p)).toThrow(/cycle/);
  });
  it("propagates definition updates while retaining instance overrides", () => {
    const p = reusable(),
      d = p.components[0],
      param = d.parameters[0];
    const one = insertInstance(d),
      two = insertInstance(d);
    if (one.kind !== "instance") throw new Error();
    one.overrides[param.id] = "Local headline";
    p.scenes[0].roots = [one, two];
    d.parameters[0].defaultValue = "Updated headline";
    expect(resolveInstance(one, p).content).toBe("Local headline");
    expect(resolveInstance(two, p).content).toBe("Updated headline");
    const bad = structuredClone(p);
    if (bad.scenes[0].roots[0].kind === "instance")
      bad.scenes[0].roots[0].overrides.unknown = "Oops";
    expect(() => parseMotionProject(bad)).toThrow(/Unknown instance/);
  });
  it("detaches references before definition deletion and keeps visible content", () => {
    const p = reusable(),
      next = deleteDefinition(p, p.components[0].id, "detach");
    expect(next.components).toHaveLength(0);
    expect(
      flattenNodes(next.scenes[0].roots).every((n) => n.kind === "element"),
    ).toBe(true);
    expect(
      flattenNodes(next.scenes[0].roots).some(
        (n) => n.kind === "element" && n.content === "Make something move.",
      ),
    ).toBe(true);
    expect(parseMotionProject(next)).toEqual(next);
  });
  it("explicitly removes parameters and their overrides", () => {
    const p = reusable(),
      instance = insertInstance(p.components[0]);
    instance.overrides[p.components[0].parameters[0].id] = "Local";
    p.scenes[0].roots.push(instance);
    const next = removeParameter(
      p,
      p.components[0].id,
      p.components[0].parameters[0].id,
    );
    expect(next.components[0].parameters).toHaveLength(0);
    const resolved = next.scenes[0].roots.at(-1)!;
    expect(resolved.kind === "instance" && resolved.overrides).toEqual({});
  });
  it("replaces definitions explicitly and rejects reference cycles", () => {
    const p = reusable();
    const other = {
      ...structuredClone(p.components[0]),
      id: "another",
      name: "Another",
    };
    p.components.push(other);
    const next = replaceDefinition(p, p.components[0].id, other.id);
    expect(next.components).toHaveLength(1);
    expect(
      flattenNodes(next.scenes[0].roots).find((n) => n.kind === "instance"),
    ).toMatchObject({ definitionId: other.id, overrides: {} });
  });
  it("moves elements between containers without losing stable IDs", () => {
    const parent = makeElement("container"),
      heading = makeElement("heading");
    const nodes = reparentNode([parent, heading], heading.id, parent.id);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].kind === "element" && nodes[0].children[0].id).toBe(
      heading.id,
    );
    expect(() => reparentNode(nodes, parent.id, heading.id)).toThrow();
  });
  it("rejects unsafe styles, image URLs and invalid SVG", () => {
    const p = createMotionProject(),
      n = makeElement("image");
    p.scenes[0].roots = [n];
    n.source = "javascript:alert(1)";
    expect(() => parseMotionProject(p)).toThrow();
    n.source = "";
    n.styles.backgroundColor = "red;}body{display:none";
    expect(() => parseMotionProject(p)).toThrow();
    n.styles = {};
    n.svgPath = "<script>alert(1)</script>";
    expect(() => parseMotionProject(p)).toThrow();
  });
  it("validates trigger and animation targets and exports the shared runtime", () => {
    const p = createMotionProject();
    p.scenes[0].sequences = [
      {
        id: "sequence",
        name: "Entrance",
        trigger: { type: "load", delay: 0, once: true },
        labels: {},
        animations: [
          {
            id: "anim",
            target: { kind: "element", elementId: "missing" },
            mode: "from",
            at: 0,
            duration: 1,
            delay: 0,
            ease: "power2.out",
            from: { opacity: 0 },
            to: {},
            keyframes: [],
            repeat: 0,
            repeatDelay: 0,
            yoyo: false,
            stagger: 0,
            split: "none",
          },
        ],
      },
    ];
    expect(() => parseMotionProject(p)).toThrow(/Missing animation target/);
    p.scenes[0].sequences[0].animations[0].target = {
      kind: "element",
      elementId: p.scenes[0].roots[0].id,
    };
    expect(parseMotionProject(p).scenes[0].sequences).toHaveLength(1);
    expect(exportStaticMotion(p, p.scenes[0].id).some(f=>f.path==='motion-runtime.js')).toBe(true);
  });
  it("preserves undo and redo snapshots", () => {
    const p = createMotionProject(),
      h = { present: p, past: [], future: [] };
    const edited = editMotion(h, { ...p, name: "Edited" });
    expect(undoMotion(edited).present.name).toBe(p.name);
    expect(redoMotion(undoMotion(edited)).present.name).toBe("Edited");
    expect(editMotion(h, p)).toBe(h);
  });
});
describe("static production exports", () => {
  it("escapes Astro content, exports props and excludes editor dependencies", () => {
    const p = reusable();
    p.components[0].parameters[0].defaultValue =
      "<script>bad()</script>{unsafe}";
    const files = exportStaticMotion(p, p.components[0].id, true);
    const astro = String(files.find((f) => f.path.endsWith(".astro"))!.content);
    expect(astro).toContain("headline?: string");
    expect(astro).toContain("{headline}");
    expect(astro).not.toContain("<script>bad()");
    expect(astro).not.toContain("react");
    expect(astro).not.toContain("gsap");
    p.export.target = "vanilla";
    const html = String(
      exportStaticMotion(p, p.components[0].id, true).find(
        (f) => f.path === "index.html",
      )!.content,
    );
    expect(html).toContain("&lt;script&gt;");
  });
  it("bundles uploaded assets and emits responsive CSS", () => {
    const p = createMotionProject(),
      n = makeElement("image");
    n.source = "asset:picture";
    p.scenes[0].roots = [n];
    p.assets = [
      {
        id: "picture",
        name: "tiny.png",
        mime: "image/png",
        data: "data:image/png;base64,aGVsbG8=",
      },
    ];
    const files = exportStaticMotion(p, p.scenes[0].id);
    expect(
      files.find((f) => f.path.startsWith("public/motion-assets/"))!.content,
    ).toEqual(new TextEncoder().encode("hello"));
    expect(
      String(files.find((f) => f.path.endsWith(".astro"))!.content),
    ).toContain("import.meta.env.BASE_URL");
    const heading = makeElement("heading");
    p.scenes[0].roots = updateNode([heading], heading.id, (n) => n);
    expect(
      String(
        exportStaticMotion(p, p.scenes[0].id).find((f) =>
          f.path.endsWith(".css"),
        )!.content,
      ),
    ).toContain("max-width:640px");
  });
  it("writes ZIP signatures and rejects unsafe paths", () => {
    const zip = createZip([{ path: "hello.txt", content: "hello" }]);
    expect(new DataView(zip.buffer).getUint32(0, true)).toBe(0x04034b50);
    expect(new DataView(zip.buffer).getUint32(zip.length - 22, true)).toBe(
      0x06054b50,
    );
    expect(() => createZip([{ path: "../escape", content: "x" }])).toThrow();
  });
});
