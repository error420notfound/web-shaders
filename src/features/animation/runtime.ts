// Portable runtime. This exact source is embedded in React code exports.
export type AnimationValue =
  number | string | boolean | number[] | { x: number; y: number };
export type Easing =
  | { type: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "hold" }
  | { type: "bezier"; points: [number, number, number, number] };
export type Interpolation =
  "number" | "color" | "vector" | "position" | "discrete";
export interface Keyframe {
  id: string;
  time: number;
  value: AnimationValue;
  easing: Easing;
}
export interface Track {
  id: string;
  layerId: string;
  propertyPath: string;
  enabled: boolean;
  interpolation: Interpolation;
  keyframes: Keyframe[];
}
export interface AnimationDocument {
  duration: number;
  frameRate: number;
  range: { start: number; end: number };
  loopMode: "none" | "loop" | "ping-pong";
  tracks: Track[];
}
export const TIME_EPSILON = 1e-7;
export function timecode(time: number, frameRate: number): string {
  const frames = Math.floor(Math.max(0, time) * frameRate + TIME_EPSILON);
  const seconds = Math.floor(frames / frameRate);
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
    frames % frameRate,
  ]
    .map((n, i) =>
      String(n).padStart(
        i === 3 ? Math.max(2, String(frameRate - 1).length) : 2,
        "0",
      ),
    )
    .join(":");
}
export function emptyAnimation(): AnimationDocument {
  return {
    duration: 5,
    frameRate: 30,
    range: { start: 0, end: 5 },
    loopMode: "none",
    tracks: [],
  };
}
export function ease(e: Easing, t: number): number {
  t = Math.max(0, Math.min(1, t));
  if (e.type === "hold") return t === 1 ? 1 : 0;
  if (e.type === "ease-in") return t * t;
  if (e.type === "ease-out") return 1 - (1 - t) ** 2;
  if (e.type === "ease-in-out")
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  if (e.type !== "bezier") return t;
  const [x1, y1, x2, y2] = e.points;
  const curve = (p: number, a: number, b: number) =>
    3 * (1 - p) ** 2 * p * a + 3 * (1 - p) * p * p * b + p ** 3;
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (curve(mid, x1, x2) < t) lo = mid;
    else hi = mid;
  }
  // Clip overshooting curves to keep registry-constrained properties in range.
  return Math.max(0, Math.min(1, curve((lo + hi) / 2, y1, y2)));
}
export function playbackTime(
  doc: AnimationDocument,
  absolute: number,
): { time: number; ended: boolean } {
  const { start, end } = doc.range,
    length = end - start;
  if (doc.loopMode === "none")
    return {
      time: Math.max(start, Math.min(end, absolute)),
      ended: absolute >= end || absolute <= start,
    };
  const period = doc.loopMode === "ping-pong" ? 2 * length : length;
  const phase = (((absolute - start) % period) + period) % period;
  return {
    time: start + (phase > length ? period - phase : phase),
    ended: false,
  };
}
// Normalized color values are serialized as sRGB rgba(). No browser color APIs in playback.
export function rgba(color: string): [number, number, number, number] {
  const m =
    /^rgba?\(\s*([\d.e+-]+)[, ]+([\d.e+-]+)[, ]+([\d.e+-]+)(?:\s*[,/]\s*([\d.e+-]+))?\s*\)$/i.exec(
      color,
    );
  if (m) {
    const value: [number, number, number, number] = [
      Number(m[1]) / 255,
      Number(m[2]) / 255,
      Number(m[3]) / 255,
      m[4] === undefined ? 1 : Number(m[4]),
    ];
    if (value.some((v) => !Number.isFinite(v) || v < 0 || v > 1))
      throw new Error("Normalized color components must be in gamut");
    return value;
  }
  let h = color.replace(/^#/, "");
  if (/^[\da-f]{3,4}$/i.test(h)) h = [...h].map((c) => c + c).join("");
  if (/^[\da-f]{6}([\da-f]{2})?$/i.test(h))
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1,
    ];
  throw new Error("Timeline colors must be normalized sRGB colors");
}
export function toLab(rgb: number[]): number[] {
  const [r, g, b] = rgb.map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function fromLab([L, a, b]: number[]): number[] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) =>
    Math.max(
      0,
      Math.min(
        1,
        v <= 0.0031308
          ? 12.92 * v
          : 1.055 * Math.max(0, v) ** (1 / 2.4) - 0.055,
      ),
    ),
  );
}
export function interpolate(
  kind: Interpolation,
  a: AnimationValue,
  b: AnimationValue,
  t: number,
): AnimationValue {
  const mix = (x: number, y: number) => x * (1 - t) + y * t;
  if (kind === "number") return mix(a as number, b as number);
  if (kind === "vector")
    return (a as number[]).map((v, i) => mix(v, (b as number[])[i]));
  if (kind === "position") {
    const x = a as { x: number; y: number },
      y = b as typeof x;
    return { x: mix(x.x, y.x), y: mix(x.y, y.y) };
  }
  if (kind === "color") {
    const x = rgba(a as string),
      y = rgba(b as string),
      alpha = mix(x[3], y[3]);
    const p = toLab(x.slice(0, 3)),
      q = toLab(y.slice(0, 3));
    const rgb = fromLab(
      p.map((v, i) => (alpha > 1e-10 ? mix(v * x[3], q[i] * y[3]) / alpha : 0)),
    );
    return `rgba(${rgb.map((v) => +(v * 255).toFixed(6)).join(", ")}, ${+Math.max(0, Math.min(1, alpha)).toFixed(6)})`;
  }
  return t < 1 ? a : b;
}
export function evaluateTrack(
  track: Track,
  time: number,
): AnimationValue | undefined {
  const keys = track.keyframes;
  if (!track.enabled || !keys.length) return undefined;
  if (time <= keys[0].time) return keys[0].value;
  if (time >= keys[keys.length - 1].time) return keys[keys.length - 1].value;
  let lo = 0,
    hi = keys.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (keys[mid].time <= time) lo = mid;
    else hi = mid;
  }
  const a = keys[lo],
    b = keys[hi];
  if (Math.abs(time - a.time) < TIME_EPSILON) return a.value;
  if (track.interpolation === "discrete") return a.value;
  return interpolate(
    track.interpolation,
    a.value,
    b.value,
    ease(a.easing, (time - a.time) / (b.time - a.time)),
  );
}
export function evaluateTimeline(
  doc: AnimationDocument,
  time: number,
): Record<string, Record<string, AnimationValue>> {
  const result: Record<string, Record<string, AnimationValue>> = Object.create(
    null,
  );
  for (const track of doc.tracks) {
    const value = evaluateTrack(track, time);
    if (value !== undefined)
      (result[track.layerId] ??= {})[track.propertyPath] = value;
  }
  return result;
}
export function animationProps(
  values: Record<string, AnimationValue>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {},
    transform: Record<string, AnimationValue> = {};
  for (const [path, value] of Object.entries(values)) {
    if (path.startsWith("props.")) result[path.slice(6)] = value;
    else if (path === "modifiers.opacity") result.opacity = value;
    else if (path.startsWith("modifiers.transform."))
      transform[path.slice(20)] = value;
  }
  if (Object.keys(transform).length) result.transform = transform;
  return result;
}
