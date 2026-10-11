import { workshopDB } from "../database";
import { parseMotionProject } from "./schema";
import type { MotionProject } from "./schema";
export async function saveMotionProject(value: MotionProject) {
  const project = parseMotionProject(value),
    db = await workshopDB();
  const tx = db.transaction(
    ["motion-projects", "motion-assets", "settings"],
    "readwrite",
  );
  await tx.objectStore("motion-projects").put(project);
  for (const asset of project.assets)
    await tx
      .objectStore("motion-assets")
      .put({
        ...asset,
        id: `${project.id}:${asset.id}`,
        projectId: project.id,
      });
  await tx.objectStore("settings").put(project.id, "active-motion");
  await tx.done;
}
export async function listMotionProjects(): Promise<MotionProject[]> {
  return (await (await workshopDB()).getAll("motion-projects"))
    .map(parseMotionProject)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export async function activeMotionProject(): Promise<
  MotionProject | undefined
> {
  const db = await workshopDB(),
    id = await db.get("settings", "active-motion");
  const value = id ? await db.get("motion-projects", id) : undefined;
  return value ? parseMotionProject(value) : undefined;
}
export async function deleteMotionProject(id: string) {
  const db = await workshopDB(),
    tx = db.transaction(
      ["motion-projects", "motion-assets", "settings"],
      "readwrite",
    );
  await tx.objectStore("motion-projects").delete(id);
  let cursor = await tx.objectStore("motion-assets").openCursor();
  while (cursor) {
    if (cursor.value.projectId === id) await cursor.delete();
    cursor = await cursor.continue();
  }
  if ((await tx.objectStore("settings").get("active-motion")) === id)
    await tx.objectStore("settings").delete("active-motion");
  await tx.done;
}
