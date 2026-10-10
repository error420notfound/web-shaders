import { z } from "zod";
import type { PropDriver } from "shaders/core";
import { effects, blendModes, propError } from "../../data/registry";
const n = z.number().finite(),
  unit = n.min(0).max(1);
const dimension = z.union([
  n,
  z.strictObject({ value: n, unit: z.enum(["px", "uv"]) }),
]);
export const driverSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("auto-animate"),
    mode: z.enum(["loop", "ping-pong"]),
    outputMin: dimension,
    outputMax: dimension,
    speed: n.optional(),
    easing: z.enum(["sine", "linear", "quad", "expo", "bounce"]).optional(),
    waveform: z.enum(["sine", "linear"]).optional(),
  }),
  z.strictObject({
    type: z.literal("mouse"),
    axis: z.enum(["x", "y"]),
    outputMin: dimension,
    outputMax: dimension,
    curve: n.min(-1).max(1).optional(),
    smoothing: unit.optional(),
    momentum: unit.optional(),
  }),
  z.strictObject({
    type: z.literal("mouse-position"),
    x: z.union([unit, z.literal("mouse")]).optional(),
    y: z.union([unit, z.literal("mouse")]).optional(),
    invertX: z.boolean().optional(),
    invertY: z.boolean().optional(),
    smoothing: unit.optional(),
    momentum: unit.optional(),
    reach: n.optional(),
    originX: unit.optional(),
    originY: unit.optional(),
  }),
  z.strictObject({
    type: z.literal("map"),
    source: z.string().min(1),
    channel: z.enum([
      "alpha",
      "alphaInverted",
      "luminance",
      "luminanceInverted",
    ]),
    inputMin: n,
    inputMax: n,
    outputMin: dimension,
    outputMax: dimension,
    curve: n.min(-1).max(1).optional(),
  }),
]);
export interface Driver {
  config: PropDriver;
  rest: any;
}
export interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  props: Record<string, any>;
  drivers: Record<string, Driver>;
  modifiers: {
    opacity: number;
    blendMode: (typeof blendModes)[number];
    transform?: {
      offsetX?: number;
      offsetY?: number;
      scale?: number;
      rotation?: number;
      anchorX?: number;
      anchorY?: number;
      edges?: "stretch" | "transparent" | "mirror" | "wrap";
    };
    maskSource?: string;
    maskType?: "alpha" | "alphaInverted" | "luminance" | "luminanceInverted";
  };
  children: Layer[];
}
const layerSchema: z.ZodType<Layer> = z.lazy(() =>
  z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.string(),
    visible: z.boolean(),
    props: z.record(z.string(), z.json()),
    drivers: z.record(
      z.string(),
      z.strictObject({ config: driverSchema, rest: z.json() }),
    ),
    modifiers: z.strictObject({
      opacity: unit,
      blendMode: z.enum(blendModes),
      transform: z
        .strictObject({
          offsetX: n.optional(),
          offsetY: n.optional(),
          scale: n.positive().optional(),
          rotation: n.optional(),
          anchorX: n.optional(),
          anchorY: n.optional(),
          edges: z
            .enum(["stretch", "transparent", "mirror", "wrap"])
            .optional(),
        })
        .optional(),
      maskSource: z.string().optional(),
      maskType: z
        .enum(["alpha", "alphaInverted", "luminance", "luminanceInverted"])
        .optional(),
    }),
    children: z.array(layerSchema),
  }),
) as z.ZodType<Layer>;
export const projectSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    name: z.string().min(1),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    context: z.enum(["website", "item"]),
    preview: z.strictObject({
      baseColor: z.string(),
      textColor: z.string(),
      heading: z.string(),
      paragraph: z.string(),
      cta: z.string(),
      showContent: z.boolean(),
      alignment: z.enum(["left", "center", "right"]),
      position: z.enum(["top", "center", "bottom"]),
      device: z.enum(["desktop", "tablet", "mobile"]),
      ratio: z.enum(["16/9", "4/3", "1/1", "3/4", "21/9"]),
      image: z.string().nullable(),
      imageName: z.string().nullable(),
      imageScale: n.min(10).max(160),
      imageX: unit,
      imageY: unit,
    }),
    layers: z.array(layerSchema),
  })
  .superRefine((p, ctx) => {
    const ids = new Set<string>();
    const all = flatten(p.layers);
    function issue(path: (string | number)[], message: string) {
      ctx.addIssue({ code: "custom", path, message });
    }
    function walk(nodes: Layer[], path: (string | number)[], depth: number) {
      if (depth > 16) issue(path, "Layer nesting exceeds 16 levels");
      nodes.forEach((l, index) => {
        const lp = [...path, index];
        if (ids.has(l.id)) issue([...lp, "id"], "Duplicate layer ID");
        ids.add(l.id);
        const effect = effects[l.type];
        if (!effect) {
          issue(
            [...lp, "type"],
            `Component ${l.type} is unavailable in shaders@4.0.4`,
          );
          return;
        }
        for (const [key, value] of Object.entries(l.props)) {
          const prop = effect.props[key];
          if (!prop)
            issue(
              [...lp, "props", key],
              "Unsupported property; unknown data was not imported",
            );
          else {
            const error = propError(value, prop);
            if (error) issue([...lp, "props", key], error);
          }
        }
        for (const [key, d] of Object.entries(l.drivers)) {
          const prop = effect.props[key];
          if (!prop?.dynamic)
            issue(
              [...lp, "drivers", key],
              "This React prop does not accept a Shaders driver",
            );
          else {
            const error = propError(d.rest, prop);
            if (error) issue([...lp, "drivers", key, "rest"], error);
            if (
              d.config.type === "mouse-position" &&
              prop.ui.type !== "position"
            )
              issue(
                [...lp, "drivers", key],
                "Position driver requires a position prop",
              );
            if (
              d.config.type !== "mouse-position" &&
              prop.ui.type === "position"
            )
              issue(
                [...lp, "drivers", key],
                "Numeric driver cannot drive a position prop",
              );
            if ("outputMin" in d.config) {
              for (const end of ["outputMin", "outputMax"] as const) {
                if (typeof d.config[end] === "number") {
                  const e = propError(d.config[end], prop);
                  if (e) issue([...lp, "drivers", key, "config", end], e);
                }
              }
            }
            if (d.config.type === "map") {
              const source = d.config.source;
              if (source === l.id || !all.some((a) => a.id === source))
                issue(
                  [...lp, "drivers", key],
                  "Mapping source is missing or references itself",
                );
            }
          }
        }
        if (
          l.modifiers.maskSource &&
          (!all.some((a) => a.id === l.modifiers.maskSource) ||
            l.modifiers.maskSource === l.id)
        )
          issue(
            [...lp, "modifiers", "maskSource"],
            "Mask source is missing or references itself",
          );
        walk(l.children, [...lp, "children"], depth + 1);
      });
    }
    walk(p.layers, ["layers"], 0);
    if (all.length > 500) issue(["layers"], "Maximum 500 layers");
    for (const field of ["baseColor", "textColor"] as const) {
      const value = p.preview[field];
      if (
        !(typeof CSS !== "undefined"
          ? CSS.supports("color", value)
          : /^(#[\da-f]{3,8}|[a-z]+|(?:rgb|hsl|oklch|oklab|color)\(.+\))$/i.test(
              value,
            ))
      )
        issue(["preview", field], "Enter a valid CSS colour");
    }
    if (
      p.preview.image &&
      !/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/.test(
        p.preview.image,
      )
    )
      issue(
        ["preview", "image"],
        "Preview image is unavailable: expected an embedded image data URI",
      );
  });
export type Project = z.infer<typeof projectSchema>;
export function flatten(nodes: Layer[]): Layer[] {
  return nodes.flatMap((l) => [l, ...flatten(l.children)]);
}
export function parseProject(input: unknown): Project {
  const version = (input as any)?.schemaVersion;
  if (version !== 1)
    throw new Error(
      `Unsupported schema version ${String(version)}. This version reads schemaVersion 1.`,
    );
  const pending = Array.isArray((input as any)?.layers)
    ? (input as any).layers.map((node: unknown) => ({ node, depth: 0 }))
    : [];
  let count = 0;
  while (pending.length) {
    const { node, depth } = pending.pop()!;
    if (++count > 500) throw new Error("layers: Maximum 500 layers");
    if (depth > 16) throw new Error("layers: Layer nesting exceeds 16 levels");
    if (Array.isArray((node as any)?.children))
      pending.push(
        ...(node as any).children.map((child: unknown) => ({
          node: child,
          depth: depth + 1,
        })),
      );
  }
  const result = projectSchema.safeParse(input);
  if (!result.success)
    throw new Error(
      result.error.issues
        .map((i) => `${i.path.join(".") || "project"}: ${i.message}`)
        .join("\n"),
    );
  return result.data;
}
export function updateLayer(
  nodes: Layer[],
  id: string,
  fn: (l: Layer) => Layer,
): Layer[] {
  return nodes.map((l) =>
    l.id === id ? fn(l) : { ...l, children: updateLayer(l.children, id, fn) },
  );
}
export function removeLayer(nodes: Layer[], id: string): Layer[] {
  return nodes
    .filter((l) => l.id !== id)
    .map((l) => ({ ...l, children: removeLayer(l.children, id) }));
}
export function cloneLayer(l: Layer): Layer {
  const copies = new Map(flatten([l]).map((n) => [n.id, crypto.randomUUID()]));
  function copy(n: Layer): Layer {
    const x = structuredClone(n);
    x.id = copies.get(n.id)!;
    x.name = n === l ? `${n.name} copy` : n.name;
    x.children = n.children.map(copy);
    if (x.modifiers.maskSource)
      x.modifiers.maskSource =
        copies.get(x.modifiers.maskSource) || x.modifiers.maskSource;
    for (const d of Object.values(x.drivers))
      if (d.config.type === "map")
        d.config.source = copies.get(d.config.source) || d.config.source;
    return x;
  }
  return copy(l);
}
