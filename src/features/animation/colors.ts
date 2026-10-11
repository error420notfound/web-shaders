import names from "./color-names.json";
import { fromLab, rgba } from "./runtime";
// CSS named-color table from color-name (MIT, see color-names.LICENSE).
export function normalizeColor(input: string): string {
  const text = input.trim().toLowerCase();
  let components: number[];
  if (text === "transparent") components = [0, 0, 0, 0];
  else if (Object.hasOwn(names, text))
    components = [
      ...(names as Record<string, number[]>)[text].map((v) => v / 255),
      1,
    ];
  else if (text.startsWith("#")) components = rgba(text);
  else {
    const match = /^(rgb|rgba|hsl|hsla|oklab|oklch|color)\((.*)\)$/.exec(text);
    if (!match)
      throw new Error(
        "Use a CSS named color, hex, rgb, hsl, OKLab, OKLCH or color(srgb)",
      );
    const mode = match[1];
    const parts = match[2]
      .replace(/^srgb\s+/, "")
      .split(/[\s,/]+/)
      .filter(Boolean);
    const number = (s: string, scale = 1) =>
      /^[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?%?$/i.test(s)
        ? s.endsWith("%")
          ? (parseFloat(s) * scale) / 100
          : Number(s)
        : NaN;
    const hueDegrees = (s: string) => {
      if (!/^[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?(?:deg|grad|rad|turn)?$/i.test(s))
        return NaN;
      return (
        parseFloat(s) *
        (s.endsWith("turn")
          ? 360
          : s.endsWith("grad")
            ? 0.9
            : s.endsWith("rad")
              ? 180 / Math.PI
              : 1)
      );
    };
    const alpha = parts[3] === undefined ? 1 : number(parts[3]);
    if (parts.length < 3 || parts.length > 4)
      throw new Error("Invalid color components");
    if (mode === "rgb" || mode === "rgba")
      components = [
        ...parts
          .slice(0, 3)
          .map((s) => (s.endsWith("%") ? number(s) : number(s) / 255)),
        alpha,
      ];
    else if (mode === "color") {
      if (!/^srgb\s/.test(match[2]))
        throw new Error(
          "Timeline color() authoring supports the srgb color space",
        );
      components = [...parts.slice(0, 3).map((s) => number(s)), alpha];
    } else if (mode === "hsl" || mode === "hsla") {
      const hue = parts[0];
      const h = (((hueDegrees(hue) % 360) + 360) % 360) / 360;
      const s = number(parts[1]),
        l = number(parts[2]);
      const f = (n: number) => {
        const k = (n + h * 12) % 12;
        return (
          l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))
        );
      };
      components = [f(0), f(8), f(4), alpha];
    } else {
      const L = number(parts[0]),
        a = number(parts[1], 0.4),
        b =
          mode === "oklch"
            ? (hueDegrees(parts[2]) * Math.PI) / 180
            : number(parts[2], 0.4);
      components = [
        ...fromLab(
          mode === "oklch" ? [L, a * Math.cos(b), a * Math.sin(b)] : [L, a, b],
        ),
        alpha,
      ];
    }
  }
  if (components.some((v) => !Number.isFinite(v)))
    throw new Error("Invalid color components");
  return `rgba(${components
    .slice(0, 3)
    .map((v) => +(Math.max(0, Math.min(1, v)) * 255).toFixed(6))
    .join(", ")}, ${+Math.max(0, Math.min(1, components[3])).toFixed(6)})`;
}
