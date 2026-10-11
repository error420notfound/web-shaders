import { openDB } from "idb";

let connection: ReturnType<typeof openDB> | undefined;
export const workshopDB = () =>
  (connection ??= openDB("shader-workshop", 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("projects"))
        db.createObjectStore("projects", { keyPath: "id" });
      if (!db.objectStoreNames.contains("settings"))
        db.createObjectStore("settings");
      if (!db.objectStoreNames.contains("motion-projects"))
        db.createObjectStore("motion-projects", { keyPath: "id" });
      if (!db.objectStoreNames.contains("motion-assets"))
        db.createObjectStore("motion-assets", { keyPath: "id" });
    },
    blocking() {
      void connection?.then((db) => db.close());
      connection = undefined;
    },
  }));
