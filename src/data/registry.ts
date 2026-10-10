import raw from "./verified-registry.json";
export type TypeDef = {
  kind: string;
  value?: unknown;
  options?: TypeDef[];
  item?: TypeDef;
  props?: Record<string, { optional: boolean; type: TypeDef }>;
};
export interface Property {
  default: any;
  description?: string;
  dynamic: boolean;
  type: TypeDef;
  ui: {
    type: string | string[];
    label?: string;
    group?: string;
    min?: number;
    max?: number;
    step?: number;
    units?: string[];
    options?: { label: string; value: any }[];
  };
}
export interface Effect {
  name: string;
  category: string;
  description?: string;
  requiresChild: boolean;
  props: Record<string, Property>;
}
export const registry = raw as unknown as Effect[];
export const effects = Object.fromEntries(registry.map((e) => [e.name, e]));
export const categories = [...new Set(registry.map((e) => e.category))].sort();
export const blendModes = [
  "normal",
  "normal-oklch",
  "normal-oklab",
  "multiply",
  "screen",
  "linearDodge",
  "overlay",
  "difference",
  "colorDodge",
  "exclusion",
  "color",
  "luminosity",
  "darken",
  "lighten",
  "colorBurn",
  "linearBurn",
  "softLight",
  "hardLight",
  "hue",
  "saturation",
] as const;
export function matchesType(value: unknown, type: TypeDef): boolean {
  switch (type.kind) {
    case "json":
      return (
        value !== undefined &&
        !(typeof value === "number" && !Number.isFinite(value))
      );
    case "literal":
      return value === type.value;
    case "null":
      return value === null;
    case "undefined":
      return value === undefined;
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    case "union":
      return !!type.options?.some((t) => matchesType(value, t));
    case "array":
      return (
        Array.isArray(value) && value.every((v) => matchesType(v, type.item!))
      );
    case "record":
      return (
        !!value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.values(value).every((v) => matchesType(v, type.item!))
      );
    case "object":
      return (
        !!value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).every((k) => k in (type.props || {})) &&
        Object.entries(type.props || {}).every(
          ([k, t]) =>
            (t.optional && !(k in value)) ||
            matchesType((value as any)[k], t.type),
        )
      );
    default:
      return false;
  }
}
export function propError(value: unknown, p: Property): string | undefined {
  if (!matchesType(value, p.type))
    return "Value does not match the installed Shaders prop type";
  if (typeof value === "number") {
    if (p.ui.min !== undefined && value < p.ui.min && value !== p.default)
      return `Minimum is ${p.ui.min}`;
    if (p.ui.max !== undefined && value > p.ui.max && value !== p.default)
      return `Maximum is ${p.ui.max}`;
  }
  if (
    p.ui.options?.length &&
    value !== p.default &&
    !p.ui.options.some((o) => o.value === value)
  )
    return "Choose a supported option";
  if (
    p.ui.type === "color" &&
    typeof value === "string" &&
    !(typeof CSS !== "undefined"
      ? CSS.supports("color", value)
      : /^(#[\da-f]{3,8}|[a-z]+|(?:rgb|hsl|oklch|oklab|color)\(.+\))$/i.test(
          value,
        ))
  )
    return "Enter a valid CSS colour";
  if (
    (p.ui.type === "shape" || p.ui.type === "shape3d") &&
    typeof value === "string"
  ) {
    try {
      if (typeof JSON.parse(value) !== "object")
        return "Shape must be a JSON object";
    } catch {
      return "Shape must be valid JSON";
    }
  }
  return undefined;
}
export const humanize = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1 $2");
