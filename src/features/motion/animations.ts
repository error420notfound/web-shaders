import { motionTargetExists } from "./schema";
import type {
  MotionAnimation,
  MotionNode,
  MotionProject,
  Sequence,
  Target,
} from "./schema";
export const eases = [
  "none",
  "power1.in",
  "power1.out",
  "power1.inOut",
  "power2.out",
  "power2.inOut",
  "back.out",
] as const;
export const properties = [
  "x",
  "y",
  "scaleX",
  "scaleY",
  "rotation",
  "opacity",
  "transformOrigin",
  "clipPath",
] as const;
export const presets = {
  Fade: [{ opacity: 0 }, { opacity: 1 }],
  Slide: [{ y: 48 }, { y: 0 }],
  Scale: [
    { scaleX: 0.8, scaleY: 0.8 },
    { scaleX: 1, scaleY: 1 },
  ],
  Rotate: [{ rotation: -15 }, { rotation: 0 }],
  "Clip Reveal": [
    { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0% 0 0)" },
  ],
  "Fade + Slide": [
    { y: 48, opacity: 0 },
    { y: 0, opacity: 1 },
  ],
} satisfies Record<string, MotionAnimation["from"][]>;
export function applyPreset(
  a: MotionAnimation,
  name: keyof typeof presets,
): MotionAnimation {
  const [from, to] = presets[name];
  return {
    ...a,
    mode: "fromTo",
    from: { ...from },
    to: { ...to },
    keyframes: [],
  };
}
export function makeAnimation(target: Target): MotionAnimation {
  return applyPreset(
    {
      id: crypto.randomUUID(),
      target,
      mode: "fromTo",
      at: 0,
      duration: 1,
      delay: 0,
      ease: "power2.out",
      from: {},
      to: {},
      keyframes: [],
      repeat: 0,
      repeatDelay: 0,
      yoyo: false,
      stagger: 0,
      split: "none",
    },
    "Fade + Slide",
  );
}
export function makeSequence(target: Target): Sequence {
  return {
    id: crypto.randomUUID(),
    name: "Entrance",
    trigger: { type: "load", delay: 0, once: true },
    labels: {},
    animations: [makeAnimation(target)],
  };
}
export function resizeAnimation(
  a: MotionAnimation,
  duration: number,
): MotionAnimation {
  if (!Number.isFinite(duration) || duration <= 0)
    throw new Error("Duration must be positive");
  return {
    ...a,
    duration,
    keyframes: a.keyframes.map((k) => ({
      ...k,
      time: (k.time * duration) / a.duration,
    })),
  };
}
export function addKeyframe(
  a: MotionAnimation,
  time: number,
  sample?: MotionAnimation["from"],
  endpoints?: {
    initial: MotionAnimation["from"];
    final: MotionAnimation["to"];
  },
): MotionAnimation {
  let keys = a.keyframes;
  if (a.mode !== "keyframes")
    keys = [
      {
        id: crypto.randomUUID(),
        time: 0,
        values: { ...(endpoints?.initial ?? a.from) },
      },
      {
        id: crypto.randomUUID(),
        time: a.duration,
        values: { ...(endpoints?.final ?? a.to) },
      },
    ];
  if (time < 0 || time > a.duration)
    throw new Error("Keyframe must be within animation duration");
  if (keys.some((k) => Math.abs(k.time - time) < 1e-6))
    throw new Error("A keyframe already exists at that time");
  const before = [...keys].reverse().find((k) => k.time < time);
  const after = keys.find((k) => k.time > time);
  const values = sample ? { ...sample } : { ...before?.values };
  if (!sample && before && after)
    for (const key of Object.keys(after.values)) {
      const x = before.values[key],
        y = after.values[key];
      values[key] =
        typeof x === "number" && typeof y === "number"
          ? x + ((y - x) * (time - before.time)) / (after.time - before.time)
          : (x ?? y);
    }
  return {
    ...a,
    mode: "keyframes",
    keyframes: [...keys, { id: crypto.randomUUID(), time, values }].sort(
      (x, y) => x.time - y.time,
    ),
  };
}
export function moveKeyframe(
  a: MotionAnimation,
  id: string,
  time: number,
): MotionAnimation {
  if (
    time < 0 ||
    time > a.duration ||
    a.keyframes.some((k) => k.id !== id && Math.abs(k.time - time) < 1e-6)
  )
    throw new Error("Keyframe time overlaps or exceeds duration");
  return {
    ...a,
    keyframes: a.keyframes
      .map((k) => (k.id === id ? { ...k, time } : k))
      .sort((x, y) => x.time - y.time),
  };
}
export function targetOwner(t: Target) {
  return t.kind === "element" ? t.elementId : t.instanceId;
}
export function matchesOwner(t: Target, selected: string | null) {
  const owner = targetOwner(t);
  return !!selected && (owner === selected || owner.startsWith(`${selected}/`));
}
export function cleanSequences(
  sequences: Sequence[],
  nodes: MotionNode[],
  p: MotionProject,
): Sequence[] {
  const valid = (t: Target) => motionTargetExists(nodes, p.components, t);
  return sequences
    .filter((s) => !("target" in s.trigger) || valid(s.trigger.target))
    .filter(
      (s) =>
        s.trigger.type !== "scroll" ||
        !s.trigger.scrollContainer ||
        valid(s.trigger.scrollContainer),
    )
    .map((s) => ({
      ...s,
      animations: s.animations.filter((a) => valid(a.target)),
    }))
    .filter((s) => s.animations.length);
}
// Expand reusable definitions into scene-local targets without another saved document.
export function resolvedSequences(
  roots: MotionNode[],
  sequences: Sequence[],
  p: MotionProject,
): Sequence[] {
  const result = [...sequences];
  function visit(nodes: MotionNode[], path = "") {
    for (const n of nodes) {
      if (n.kind === "element") visit(n.children, path);
      else {
        const d = p.components.find((d) => d.id === n.definitionId)!;
        const instanceId = path ? `${path}/${n.id}` : n.id;
        const map = (t: Target): Target =>
          t.kind === "element"
            ? { kind: "instance", instanceId, elementId: t.elementId }
            : { ...t, instanceId: `${instanceId}/${t.instanceId}` };
        for (const s of d.sequences)
          result.push({
            ...s,
            id: `${instanceId}/${s.id}`,
            animations: s.animations.map((a) => ({
              ...a,
              id: `${instanceId}/${a.id}`,
              target: map(a.target),
            })),
            trigger:
              "target" in s.trigger
                ? {
                    ...s.trigger,
                    target: map(s.trigger.target),
                    ...(s.trigger.type === "scroll"
                      ? {
                          scrollContainer: s.trigger.scrollContainer
                            ? map(s.trigger.scrollContainer)
                            : null,
                        }
                      : {}),
                  }
                : s.trigger,
          });
        visit([d.root], instanceId);
      }
    }
  }
  visit(roots);
  return result;
}
