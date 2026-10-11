import { effects, propError } from "../../data/registry";
import type { Property } from "../../data/registry";
import type { Layer } from "../compositions/schema";
import type { AnimationValue, Interpolation, Track } from "./runtime";
import { rgba } from "./runtime";
export interface Binding {
  path: string;
  label: string;
  interpolation: Interpolation;
  property: Property;
  value: AnimationValue;
}
const scalar = (
  label: string,
  value: number,
  min?: number,
  max?: number,
): Property => ({
  default: value,
  dynamic: false,
  type: { kind: "number" },
  ui: { type: "range", label, min, max, step: 0.01 },
});
export function bindings(layer: Layer): Binding[] {
  const result: Binding[] = [];
  for (const [key, property] of Object.entries(
    effects[layer.type]?.props ?? {},
  )) {
    const value = layer.props[key] ?? property.default;
    const ui = Array.isArray(property.ui.type)
      ? property.ui.type[0]
      : property.ui.type;
    let interpolation: Interpolation | undefined;
    if (ui === "color" && typeof value === "string") interpolation = "color";
    else if (typeof value === "number" && !["readonly"].includes(ui))
      interpolation = property.ui.options?.length ? "discrete" : "number";
    else if (
      ui === "position" &&
      value &&
      typeof value.x === "number" &&
      typeof value.y === "number"
    )
      interpolation = "position";
    else if (
      ["position", "vector", "coordinates"].includes(ui) &&
      Array.isArray(value) &&
      value.every((v) => typeof v === "number")
    )
      interpolation = "vector";
    else if (
      typeof value === "boolean" ||
      (property.ui.options?.length && typeof value === "string")
    )
      interpolation = "discrete";
    if (interpolation)
      result.push({
        path: `props.${key}`,
        label: property.ui.label || key,
        interpolation,
        property,
        value,
      });
  }
  result.push({
    path: "modifiers.opacity",
    label: "Opacity",
    interpolation: "number",
    property: scalar("Opacity", 1, 0, 1),
    value: layer.modifiers.opacity,
  });
  const defaults = {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    anchorX: 0.5,
    anchorY: 0.5,
  };
  for (const [key, fallback] of Object.entries(defaults))
    result.push({
      path: `modifiers.transform.${key}`,
      label: key,
      interpolation: "number",
      property: scalar(key, fallback, key === "scale" ? 0.0001 : undefined),
      value:
        layer.modifiers.transform?.[key as keyof typeof defaults] ?? fallback,
    });
  return result;
}
export function bindingError(track: Track, layer?: Layer): string | undefined {
  if (!layer) return "Layer is missing";
  const binding = bindings(layer).find((b) => b.path === track.propertyPath);
  if (!binding) return "Property is unavailable or cannot be animated";
  if (binding.interpolation !== track.interpolation)
    return "Interpolation does not match the property";
  for (const key of track.keyframes) {
    const error = propError(key.value, binding.property);
    if (error) return error;
    if (track.interpolation === "color") {
      try {
        rgba(key.value as string);
      } catch {
        return "Normalize the keyframe color before saving";
      }
    }
    if (
      track.interpolation === "vector" &&
      (key.value as number[]).length !== (binding.value as number[]).length
    )
      return "Vector dimensions do not match";
  }
}
