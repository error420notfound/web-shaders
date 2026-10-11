import { workshopDB as db } from "../database";
import { parseProject } from "./schema";
import type { Project } from "./schema";
export async function saveProject(project: Project) {
  const d = await db();
  const tx = d.transaction(["projects", "settings"], "readwrite");
  await tx.objectStore("projects").put(project);
  await tx.objectStore("settings").put(project.id, "active");
  await tx.done;
}
export async function listProjects(): Promise<Project[]> {
  return (await (await db()).getAll("projects"))
    .map((p) => parseProject(p))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export async function activeProject(): Promise<Project | undefined> {
  const d = await db();
  const id = await d.get("settings", "active");
  const p = id ? await d.get("projects", id) : undefined;
  return p ? parseProject(p) : undefined;
}
export async function deleteProject(id: string) {
  await (await db()).delete("projects", id);
}
