import type { Project } from "./schema";
export interface History {
  present: Project;
  past: Project[];
  future: Project[];
  group?: string;
  changedAt: number;
}
export function editHistory(
  h: History,
  p: Project,
  group?: string,
  now = Date.now(),
  dragging = false,
): History {
  if (JSON.stringify(h.present) === JSON.stringify(p)) return h;
  const coalesce =
    !!group && h.group === group && (dragging || now - h.changedAt < 700);
  return {
    present: { ...p, updatedAt: new Date().toISOString() },
    past: coalesce ? h.past : [...h.past, h.present].slice(-100),
    future: [],
    group,
    changedAt: now,
  };
}
export function undo(h: History): History {
  if (!h.past.length) return h;
  return {
    present: h.past.at(-1)!,
    past: h.past.slice(0, -1),
    future: [h.present, ...h.future],
    changedAt: 0,
  };
}
export function redo(h: History): History {
  if (!h.future.length) return h;
  return {
    present: h.future[0],
    past: [...h.past, h.present],
    future: h.future.slice(1),
    changedAt: 0,
  };
}
