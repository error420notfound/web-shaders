import type { AnimationDocument, AnimationValue, Track } from "./runtime";
import { TIME_EPSILON } from "./runtime";
import type { Binding } from "./bindings";
import { normalizeColor } from "./colors";
export function putKey(
  doc: AnimationDocument,
  layerId: string,
  binding: Binding,
  time: number,
  value: AnimationValue,
): AnimationDocument {
  if (binding.interpolation === "color")
    value = normalizeColor(value as string);
  const existing = doc.tracks.find(
    (t) => t.layerId === layerId && t.propertyPath === binding.path,
  );
  const track: Track = existing ?? {
    id: crypto.randomUUID(),
    layerId,
    propertyPath: binding.path,
    interpolation: binding.interpolation,
    enabled: true,
    keyframes: [],
  };
  const key = track.keyframes.find(
    (k) => Math.abs(k.time - time) < TIME_EPSILON,
  );
  const updated = {
    ...track,
    enabled: true,
    keyframes: [
      ...track.keyframes.filter((k) => k !== key),
      {
        id: key?.id ?? crypto.randomUUID(),
        time: key?.time ?? time,
        value,
        easing: key?.easing ?? { type: "linear" as const },
      },
    ].sort((a, b) => a.time - b.time),
  };
  return {
    ...doc,
    tracks: existing
      ? doc.tracks.map((t) => (t === existing ? updated : t))
      : [...doc.tracks, updated],
  };
}
export function deleteKeys(
  doc: AnimationDocument,
  ids: Set<string>,
): AnimationDocument {
  return {
    ...doc,
    tracks: doc.tracks
      .map((t) => ({
        ...t,
        keyframes: t.keyframes.filter((k) => !ids.has(k.id)),
      }))
      .filter((t) => t.keyframes.length > 0),
  };
}
export function moveKeys(
  doc: AnimationDocument,
  ids: Set<string>,
  delta: number,
): AnimationDocument {
  const keys = doc.tracks
    .flatMap((t) => t.keyframes)
    .filter((k) => ids.has(k.id));
  if (!keys.length) return doc;
  delta = Math.max(
    -Math.min(...keys.map((k) => k.time)),
    Math.min(doc.duration - Math.max(...keys.map((k) => k.time)), delta),
  );
  const tracks = doc.tracks.map((t) => ({
    ...t,
    keyframes: t.keyframes
      .map((k) =>
        ids.has(k.id)
          ? {
              ...k,
              time: +Math.max(
                0,
                Math.min(doc.duration, k.time + delta),
              ).toFixed(9),
            }
          : k,
      )
      .sort((a, b) => a.time - b.time),
  }));
  if (
    tracks.some((t) =>
      t.keyframes.some(
        (k, i) =>
          i > 0 && Math.abs(k.time - t.keyframes[i - 1].time) < TIME_EPSILON,
      ),
    )
  )
    throw new Error("Keyframes cannot share a timestamp");
  return { ...doc, tracks };
}
