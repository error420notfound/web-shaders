import type { MotionProject } from "./schema";
export interface MotionHistory {
  present: MotionProject;
  past: MotionProject[];
  future: MotionProject[];
}
export function editMotion(
  h: MotionHistory,
  next: MotionProject,
): MotionHistory {
  if (JSON.stringify(h.present) === JSON.stringify(next)) return h;
  return {
    present: { ...next, updatedAt: new Date().toISOString() },
    past: [...h.past, h.present].slice(-100),
    future: [],
  };
}
export function undoMotion(h: MotionHistory): MotionHistory {
  return h.past.length
    ? {
        present: h.past.at(-1)!,
        past: h.past.slice(0, -1),
        future: [h.present, ...h.future],
      }
    : h;
}
export function redoMotion(h: MotionHistory): MotionHistory {
  return h.future.length
    ? {
        present: h.future[0],
        past: [...h.past, h.present],
        future: h.future.slice(1),
      }
    : h;
}
