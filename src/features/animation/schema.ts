import { z } from "zod";
import type { AnimationDocument } from "./runtime";
const n = z.number().finite();
const value = z.union([
  n,
  z.string(),
  z.boolean(),
  z.array(n).min(1).max(4),
  z.strictObject({ x: n, y: n }),
]);
const easing = z.union([
  z.strictObject({
    type: z.enum(["linear", "ease-in", "ease-out", "ease-in-out", "hold"]),
  }),
  z.strictObject({
    type: z.literal("bezier"),
    points: z.tuple([n.min(0).max(1), n, n.min(0).max(1), n]),
  }),
]);
export const animationSchema = z
  .strictObject({
    duration: n.positive().max(Number.MAX_SAFE_INTEGER),
    frameRate: z.number().int().min(1).max(240),
    range: z.strictObject({ start: n.min(0), end: n.positive() }),
    loopMode: z.enum(["none", "loop", "ping-pong"]),
    tracks: z
      .array(
        z.strictObject({
          id: z.string().min(1),
          layerId: z.string().min(1),
          propertyPath: z
            .string()
            .regex(
              /^(props\.[A-Za-z][\w]*|modifiers\.opacity|modifiers\.transform\.(offsetX|offsetY|scale|rotation|anchorX|anchorY))$/,
            ),
          enabled: z.boolean(),
          interpolation: z.enum([
            "number",
            "color",
            "vector",
            "position",
            "discrete",
          ]),
          keyframes: z
            .array(
              z.strictObject({
                id: z.string().min(1),
                time: n.min(0),
                value,
                easing,
              }),
            )
            .max(10000),
        }),
      )
      .max(5000),
  })
  .superRefine((doc, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    if (doc.range.start >= doc.range.end || doc.range.end > doc.duration)
      issue(
        ["range"],
        "Playback range must fit the duration and have positive length",
      );
    const ids = new Set<string>(),
      paths = new Set<string>();
    doc.tracks.forEach((track, i) => {
      const path = `${track.layerId}:${track.propertyPath}`;
      if (ids.has(track.id) || paths.has(path))
        issue(["tracks", i], "Duplicate track ID or binding");
      ids.add(track.id);
      paths.add(path);
      const times = new Set<number>();
      track.keyframes.forEach((key, j) => {
        if (ids.has(key.id) || times.has(key.time))
          issue(
            ["tracks", i, "keyframes", j],
            "Duplicate keyframe ID or timestamp",
          );
        ids.add(key.id);
        times.add(key.time);
        if (key.time > doc.duration)
          issue(
            ["tracks", i, "keyframes", j, "time"],
            "Keyframe exceeds duration",
          );
        const v = key.value;
        if (
          (track.interpolation === "number" && typeof v !== "number") ||
          (track.interpolation === "color" && typeof v !== "string") ||
          (track.interpolation === "vector" && !Array.isArray(v)) ||
          (track.interpolation === "position" &&
            (typeof v !== "object" || Array.isArray(v))) ||
          (track.interpolation === "discrete" && typeof v === "object")
        )
          issue(
            ["tracks", i, "keyframes", j, "value"],
            "Value does not match interpolation type",
          );
      });
      const sortedTimes = [...times].sort((a, b) => a - b);
      if (
        sortedTimes.some((time, j) => j > 0 && time - sortedTimes[j - 1] < 1e-7)
      )
        issue(
          ["tracks", i, "keyframes"],
          "Keyframe timestamps must be at least 0.0000001 seconds apart",
        );
    });
  })
  .transform((doc) => ({
    ...doc,
    tracks: doc.tracks.map((t) => ({
      ...t,
      keyframes: [...t.keyframes].sort((a, b) => a.time - b.time),
    })),
  })) satisfies z.ZodType<AnimationDocument>;
