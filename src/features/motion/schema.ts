import { z } from "zod";

const id = z.string().min(1).max(200);
const finite = z.number().finite();
export const elementKinds = [
  "heading",
  "paragraph",
  "text",
  "container",
  "group",
  "image",
  "button",
  "shape",
  "svg",
] as const;
export const styleKeys = [
  "display",
  "flexDirection",
  "flexWrap",
  "gridTemplateColumns",
  "position",
  "width",
  "height",
  "minHeight",
  "maxWidth",
  "padding",
  "gap",
  "alignItems",
  "justifyContent",
  "overflow",
  "borderRadius",
  "backgroundColor",
  "color",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "zIndex",
  "top",
  "left",
  "margin",
  "border",
  "opacity",
  "transform",
] as const;
export type StyleKey = (typeof styleKeys)[number];
// Only declarative values: no url(), CSS imports, expressions or injected rules.
const styleValue = z.union([
  finite,
  z
    .string()
    .max(500)
    .refine(
      (v) => !/[{};<>\\]|url\s*\(|expression\s*\(|@import/i.test(v),
      "Unsafe CSS value",
    ),
]);
const styles = z.partialRecord(z.enum(styleKeys), styleValue);
export type Styles = z.infer<typeof styles>;
export const safeUrl = z
  .string()
  .max(10000)
  .refine(
    (v) => !v || /^(https?:\/\/|\/[^/]|\.\/|asset:)/i.test(v),
    "Use an HTTPS, local, or uploaded asset URL",
  );
const nodeBase = {
  id,
  name: z.string().min(1).max(200),
  styles,
  responsive: z.strictObject({ tablet: styles, mobile: styles }),
};
export interface ElementNode {
  kind: "element";
  id: string;
  name: string;
  type: (typeof elementKinds)[number];
  content: string;
  source: string;
  alt: string;
  svgPath: string;
  styles: Styles;
  responsive: { tablet: Styles; mobile: Styles };
  children: MotionNode[];
}
export interface InstanceNode {
  kind: "instance";
  id: string;
  name: string;
  definitionId: string;
  overrides: Record<string, string | number>;
  styles: Styles;
  responsive: { tablet: Styles; mobile: Styles };
}
export type MotionNode = ElementNode | InstanceNode;
export const nodeSchema: z.ZodType<MotionNode> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    z.strictObject({
      ...nodeBase,
      kind: z.literal("element"),
      type: z.enum(elementKinds),
      content: z.string().max(100000),
      source: safeUrl,
      alt: z.string().max(1000),
      svgPath: z
        .string()
        .max(100000)
        .regex(
          /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+eE-]*$/,
          "Only SVG path data is supported",
        ),
      children: z.array(nodeSchema).max(1000),
    }),
    z.strictObject({
      ...nodeBase,
      kind: z.literal("instance"),
      definitionId: id,
      overrides: z.record(id, z.union([z.string().max(100000), finite])),
    }),
  ]),
);
export const targetSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("element"), elementId: id }),
  z.strictObject({
    kind: z.literal("instance"),
    instanceId: id,
    elementId: id,
  }),
]);
export type Target = z.infer<typeof targetSchema>;
const values = z.record(
  z
    .string()
    .regex(
      /^(x|y|scaleX|scaleY|rotation|opacity|transformOrigin|skewX|skewY|width|height|backgroundColor|color|borderRadius|clipPath|filter|strokeDashoffset|--[\w-]+)$/,
    ),
  styleValue,
);
export const triggerSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("load"),
    delay: finite.min(0),
    once: z.boolean(),
  }),
  z.strictObject({
    type: z.literal("viewport"),
    target: targetSchema,
    threshold: finite.min(0).max(1),
    rootMargin: z.string().regex(/^-?\d+(px|%)?( -?\d+(px|%)?){0,3}$/),
    once: z.boolean(),
    reverseOnExit: z.boolean(),
  }),
  z.strictObject({
    type: z.literal("hover"),
    target: targetSchema,
    leave: z.enum(["reverse", "reset"]),
  }),
  z.strictObject({
    type: z.literal("click"),
    target: targetSchema,
    action: z.enum(["play", "pause", "reverse", "toggle"]),
  }),
  z.strictObject({
    type: z.literal("scroll"),
    target: targetSchema,
    start: z.string().max(200),
    end: z.string().max(200),
    scrub: z.union([z.boolean(), finite.min(0)]),
    pin: z.boolean(),
    toggleActions: z.string().max(100),
    scrollContainer: targetSchema.nullable(),
  }),
]);
export const animationSchema = z.strictObject({
  id,
  target: targetSchema,
  mode: z.enum(["from", "to", "fromTo", "keyframes"]),
  at: finite.min(0),
  duration: finite.positive(),
  delay: finite.min(0),
  ease: z.enum([
    "none",
    "power1.in",
    "power1.out",
    "power1.inOut",
    "power2.out",
    "power2.inOut",
    "back.out",
  ]),
  from: values,
  to: values,
  keyframes: z
    .array(
      z.strictObject({
        id: id.default(() => crypto.randomUUID()),
        time: finite.min(0),
        values,
        ease: z
          .enum([
            "none",
            "power1.in",
            "power1.out",
            "power1.inOut",
            "power2.out",
            "power2.inOut",
            "back.out",
          ])
          .optional(),
      }),
    )
    .max(10000),
  repeat: z.number().int().min(-1).max(1000),
  repeatDelay: finite.min(0),
  yoyo: z.boolean(),
  stagger: finite.min(0),
  split: z.enum(["none", "words", "chars", "lines"]),
});
export type MotionAnimation = z.infer<typeof animationSchema>;
export const sequenceSchema = z.strictObject({
  id,
  name: z.string().min(1),
  trigger: triggerSchema,
  labels: z.record(id, finite.min(0)),
  animations: z.array(animationSchema).max(5000),
});
export type Sequence = z.infer<typeof sequenceSchema>;
export const parameterSchema = z.strictObject({
  id,
  name: z
    .string()
    .regex(/^[A-Za-z][A-Za-z0-9_]*$/)
    .refine(
      (v) =>
        ![
          "__proto__",
          "constructor",
          "prototype",
          "style",
          "Astro",
          "Props",
          "arguments",
          "eval",
          "undefined",
          "null",
          "true",
          "false",
          "break",
          "case",
          "catch",
          "class",
          "const",
          "continue",
          "debugger",
          "default",
          "delete",
          "do",
          "else",
          "enum",
          "export",
          "extends",
          "finally",
          "for",
          "function",
          "if",
          "implements",
          "import",
          "in",
          "instanceof",
          "interface",
          "let",
          "new",
          "package",
          "private",
          "protected",
          "public",
          "return",
          "static",
          "super",
          "switch",
          "this",
          "throw",
          "try",
          "typeof",
          "var",
          "void",
          "while",
          "with",
          "yield",
          "await",
        ].includes(v),
      "Reserved parameter name",
    ),
  targetId: id,
  property: z.enum([
    "content",
    "source",
    "color",
    "backgroundColor",
    "fontSize",
    "width",
    "height",
  ]),
  defaultValue: z.union([z.string(), finite]),
});
export type Parameter = z.infer<typeof parameterSchema>;
export const definitionSchema = z.strictObject({
  id,
  name: z.string().min(1),
  description: z.string(),
  version: z.number().int().positive(),
  root: nodeSchema,
  parameters: z.array(parameterSchema),
  sequences: z.array(sequenceSchema),
});
export type Definition = z.infer<typeof definitionSchema>;
const sceneSchema = z.strictObject({
  id,
  name: z.string().min(1),
  roots: z.array(nodeSchema),
  sequences: z.array(sequenceSchema),
});
export type Scene = z.infer<typeof sceneSchema>;
const documentSchema = z.strictObject({
  kind: z.literal("motion"),
  schemaVersion: z.literal(1),
  id,
  name: z.string().min(1).max(200),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  scenes: z.array(sceneSchema).min(1).max(100),
  components: z.array(definitionSchema).max(1000),
  assets: z
    .array(
      z.strictObject({
        id,
        name: z.string().regex(/^[\w .-]+$/),
        mime: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
        data: z
          .string()
          .max(30_000_000)
          .regex(/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/),
      }),
    )
    .max(1000),
  export: z.strictObject({ target: z.enum(["astro", "vanilla"]) }),
});
export type MotionProject = z.infer<typeof documentSchema>;
export function flattenNodes(nodes: MotionNode[]): MotionNode[] {
  return nodes.flatMap((n) => [
    n,
    ...(n.kind === "element" ? flattenNodes(n.children) : []),
  ]);
}
export function motionTargetExists(
  nodes: MotionNode[],
  components: Definition[],
  t: Target,
): boolean {
  const flat = flattenNodes(nodes);
  if (t.kind === "element")
    return flat.some((n) => n.id === t.elementId && n.kind === "element");
  function find(nodes: MotionNode[], path: string): boolean {
    for (const n of flattenNodes(nodes))
      if (n.kind === "instance") {
        const d = components.find((d) => d.id === n.definitionId);
        if (!d) continue;
        if (path === n.id)
          return flattenNodes([d.root]).some(
            (n) => n.kind === "element" && n.id === t.elementId,
          );
        if (
          path.startsWith(`${n.id}/`) &&
          find([d.root], path.slice(n.id.length + 1))
        )
          return true;
      }
    return false;
  }
  return find(nodes, t.instanceId);
}
export const motionProjectSchema = documentSchema.superRefine((p, ctx) => {
  const report = (message: string) => ctx.addIssue({ code: "custom", message });
  const defs = new Map(p.components.map((d) => [d.id, d]));
  const globalIds = [
    p.id,
    ...p.scenes.map((s) => s.id),
    ...p.components.map((d) => d.id),
    ...p.assets.map((a) => a.id),
  ];
  if (new Set(globalIds).size !== globalIds.length)
    report("Duplicate project, scene, component or asset ID");
  function check(nodes: MotionNode[], sequences: Sequence[]) {
    const flat = flattenNodes(nodes),
      ids = new Set(flat.map((n) => n.id));
    if (ids.size !== flat.length) report("Duplicate element ID");
    function targetExists(t: Target) {
      return motionTargetExists(nodes, p.components, t);
    }
    const animationIds = sequences.flatMap((s) => [
      s.id,
      ...s.animations.map((a) => a.id),
    ]);
    if (new Set(animationIds).size !== animationIds.length)
      report("Duplicate sequence or animation ID");
    for (const sequence of sequences) {
      if (
        "target" in sequence.trigger &&
        !targetExists(sequence.trigger.target)
      )
        report("Missing trigger target");
      if (
        sequence.trigger.type === "scroll" &&
        sequence.trigger.scrollContainer &&
        !targetExists(sequence.trigger.scrollContainer)
      )
        report("Missing scroll container");
      for (const a of sequence.animations) {
        if (!targetExists(a.target)) report("Missing animation target");
        if (new Set(a.keyframes.map((k) => k.id)).size !== a.keyframes.length)
          report("Duplicate keyframe ID");
        if (
          a.mode === "keyframes" &&
          (!a.keyframes.length ||
            a.keyframes.some(
              (k, i) =>
                k.time > a.duration ||
                (i > 0 && k.time <= a.keyframes[i - 1].time),
            ))
        )
          report("Keyframe times must increase within duration");
      }
    }
    for (const n of flat) {
      if (n.kind === "instance") {
        const d = defs.get(n.definitionId);
        if (!d) {
          report("Missing component definition");
          continue;
        }
        for (const [key, value] of Object.entries(n.overrides)) {
          const param = d.parameters.find((p) => p.id === key);
          if (!param) report("Unknown instance parameter");
          else if (typeof value !== typeof param.defaultValue)
            report("Instance parameter type mismatch");
          else validateParameter(param, value);
        }
      } else {
        if (
          n.source.startsWith("asset:") &&
          !p.assets.some((a) => a.id === n.source.slice(6))
        )
          report("Missing asset");
        if (!["container", "group"].includes(n.type) && n.children.length)
          report("Only containers and groups can have children");
      }
    }
  }
  function validateParameter(param: Parameter, v: string | number) {
    if (
      param.property === "source" &&
      (typeof v !== "string" ||
        !safeUrl.safeParse(v).success ||
        (v.startsWith("asset:") && !p.assets.some((a) => a.id === v.slice(6))))
    )
      report("Invalid image parameter");
    if (
      !["source", "content"].includes(param.property) &&
      !styleValue.safeParse(v).success
    )
      report("Invalid style parameter");
    if (["source", "content"].includes(param.property) && typeof v !== "string")
      report("Text and source parameters require strings");
  }
  p.scenes.forEach((s) => check(s.roots, s.sequences));
  p.assets.forEach((a) => {
    if (!a.data.startsWith(`data:${a.mime};base64,`))
      report("Asset MIME does not match data");
  });
  for (const d of p.components) {
    check([d.root], d.sequences);
    const ids = d.parameters.map((p) => p.id),
      names = d.parameters.map((p) => p.name);
    if (
      new Set(ids).size !== ids.length ||
      new Set(names).size !== names.length
    )
      report("Duplicate parameter ID or name");
    for (const param of d.parameters) {
      if (
        !flattenNodes([d.root]).some(
          (n) => n.id === param.targetId && n.kind === "element",
        )
      )
        report("Missing parameter target");
      validateParameter(param, param.defaultValue);
    }
  }
  const visited = new Set<string>();
  function visit(id: string, stack: Set<string>) {
    if (stack.has(id)) {
      report("Component reference cycle");
      return;
    }
    if (visited.has(id)) return;
    const d = defs.get(id);
    if (!d) return;
    const next = new Set(stack).add(id);
    flattenNodes([d.root]).forEach((n) => {
      if (n.kind === "instance") visit(n.definitionId, next);
    });
    visited.add(id);
  }
  p.components.forEach((d) => visit(d.id, new Set()));
});
export function parseMotionProject(value: unknown): MotionProject {
  return motionProjectSchema.parse(value);
}
