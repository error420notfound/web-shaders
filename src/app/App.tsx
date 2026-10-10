import { useState, useEffect, useCallback, useRef } from "react";
import type { Layer, Project } from "../features/compositions/schema";
import {
  flatten,
  updateLayer,
  removeLayer,
  cloneLayer,
  parseProject,
} from "../features/compositions/schema";
import { editHistory, undo, redo } from "../features/compositions/history";
import type { History } from "../features/compositions/history";
import {
  activeProject,
  saveProject,
  listProjects,
  deleteProject,
} from "../features/compositions/storage";
import { createProject, makeLayer, starterNames } from "../data/starters";
import { effects } from "../data/registry";
import { Library } from "../components/editor/Library";
import { LayerList } from "../components/editor/LayerList";
import { Inspector } from "../components/editor/Inspector";
import { Canvas } from "../components/editor/Canvas";
import { ExportDialog } from "../components/editor/ExportDialog";
import { Icon, IconButton, Modal } from "../components/controls/Primitives";
import { download } from "../features/export/code";
import type { RenderStatus } from "../features/renderer/ShaderRenderer";

function move(nodes: Layer[], id: string, delta: number): Layer[] {
  const index = nodes.findIndex((l) => l.id === id);
  if (index >= 0) {
    const result = [...nodes];
    const [l] = result.splice(index, 1);
    result.splice(Math.max(0, Math.min(result.length, index + delta)), 0, l);
    return result;
  }
  return nodes.map((l) => ({ ...l, children: move(l.children, id, delta) }));
}
export default function App() {
  const [history, setHistory] = useState<History>(() => ({
    present: createProject(0),
    past: [],
    future: [],
    changedAt: 0,
  }));
  const project = history.present;
  const [selected, setSelected] = useState<string | null>(
    project.layers[0]?.id || null,
  );
  const [tab, setTab] = useState<"layer" | "preview">("layer");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState("Opening local workspace…");
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(true);
  const [systemReduced, setSystemReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reduced, setReduced] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [gpu, setGpu] = useState<RenderStatus>("loading");
  const [fallback, setFallback] = useState(
    () => new URLSearchParams(window.location.search).get("gpu") === "off",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("shader-workshop-theme") || "light",
  );
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [modal, setModal] = useState<"new" | "open" | "export" | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const current = useRef(project);
  current.current = project;
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const dragging = useRef(false);
  const [rejected, setRejected] = useState<{
    name: string;
    text: string;
    error: string;
  } | null>(null);
  function enqueue(p: Project) {
    writeQueue.current = writeQueue.current
      .catch(() => {})
      .then(() => saveProject(p));
    return writeQueue.current;
  }
  function load(p: Project) {
    setHistory({
      present: parseProject(p),
      past: [],
      future: [],
      changedAt: 0,
    });
    setSelected(p.layers[0]?.id || null);
    setTab(p.layers.length ? "layer" : "preview");
    setZoom(0);
    setModal(null);
  }
  useEffect(() => {
    let live = true;
    activeProject()
      .then((p) => {
        if (!live) return;
        if (p) load(p);
        else if (matchMedia("(max-width: 700px)").matches)
          setHistory((h) => ({
            ...h,
            present: {
              ...h.present,
              preview: { ...h.present.preview, device: "mobile" },
            },
          }));
        setReady(true);
      })
      .catch((e) => {
        if (live) {
          setError(`Could not open local projects: ${e.message}`);
          setReady(true);
        }
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setSystemReduced(q.matches);
    q.addEventListener("change", fn);
    return () => q.removeEventListener("change", fn);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("shader-workshop-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (!ready) return;
    setSaved("Saving…");
    let cancelled = false;
    const t = setTimeout(() => {
      enqueue(project)
        .then(() => {
          if (!cancelled) setSaved("All changes saved");
        })
        .catch((e) => {
          if (!cancelled) {
            setSaved("Save failed");
            setError(
              `Local save failed: ${e.message}. Export JSON to keep a copy.`,
            );
          }
        });
    }, 400);
    saveTimer.current = t;
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [project, ready]);
  useEffect(() => {
    function keys(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLibraryOpen(false);
        setInspectorOpen(false);
        document
          .querySelectorAll<HTMLDetailsElement>(".project-menu[open]")
          .forEach((d) => (d.open = false));
      }
      const input = (e.target as HTMLElement).matches("input,textarea,select");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !input) {
        e.preventDefault();
        setHistory((h) => (e.shiftKey ? redo(h) : undo(h)));
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y" && !input) {
        e.preventDefault();
        setHistory(redo);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        enqueue(current.current)
          .then(() => setSaved("All changes saved"))
          .catch((err) => setError(err.message));
      }
      if (e.key === "/" && !input) {
        e.preventDefault();
        setLibraryOpen(true);
        setTimeout(
          () =>
            document
              .querySelector<HTMLInputElement>('[aria-label="Search effects"]')
              ?.focus(),
          0,
        );
      }
    }
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, []);
  useEffect(() => {
    const start = (e: PointerEvent) => {
      if ((e.target as HTMLElement).matches('input[type="range"]')) {
        dragging.current = true;
        setHistory((h) => ({ ...h, group: undefined }));
      }
    };
    const end = () => {
      if (dragging.current) {
        dragging.current = false;
        setHistory((h) => ({ ...h, group: undefined }));
      }
    };
    const flush = () => {
      if (document.visibilityState === "hidden")
        void enqueue(current.current).catch((e) => setError(e.message));
    };
    document.addEventListener("pointerdown", start);
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", end);
    document.addEventListener("visibilitychange", flush);
    return () => {
      document.removeEventListener("pointerdown", start);
      document.removeEventListener("pointerup", end);
      document.removeEventListener("pointercancel", end);
      document.removeEventListener("visibilitychange", flush);
    };
  }, []);
  const commit = useCallback((fn: (p: Project) => Project, group?: string) => {
    setHistory((h) => {
      const next = fn(h.present);
      try {
        parseProject(next);
        return editHistory(h, next, group, Date.now(), dragging.current);
      } catch (e) {
        setError((e as Error).message);
        return h;
      }
    });
  }, []);
  const layer = flatten(project.layers).find((l) => l.id === selected);
  function changeLayer(id: string, changes: Partial<Layer>, group?: string) {
    commit(
      (p) => ({
        ...p,
        layers: updateLayer(p.layers, id, (l) => ({ ...l, ...changes })),
      }),
      group,
    );
  }
  function add(type: string) {
    const n = makeLayer(
      type,
      type === "ImageTexture" ? { url: "/sample-object.svg" } : {},
    );
    if (
      layer &&
      effects[layer.type].requiresChild &&
      layer.children.length === 0
    ) {
      commit((p) => ({
        ...p,
        layers: updateLayer(p.layers, layer.id, (l) => ({
          ...l,
          children: [n],
        })),
      }));
    } else if (effects[type].requiresChild && layer) {
      n.children = [layer];
      commit((p) => ({
        ...p,
        layers: updateLayer(p.layers, layer.id, () => n),
      }));
    } else commit((p) => ({ ...p, layers: [...p.layers, n] }));
    setSelected(n.id);
    setTab("layer");
    setLibraryOpen(false);
  }
  function duplicateLayer(id: string) {
    commit((p) => {
      function clone(nodes: Layer[]): Layer[] {
        return nodes.flatMap((l) =>
          l.id === id
            ? [l, cloneLayer(l)]
            : [{ ...l, children: clone(l.children) }],
        );
      }
      return { ...p, layers: clone(p.layers) };
    });
  }
  function remove(id: string) {
    commit((p) => {
      const doomed = new Set(
        flatten([flatten(p.layers).find((l) => l.id === id)!]).map((l) => l.id),
      );
      const layers = removeLayer(p.layers, id);
      function clean(nodes: Layer[]): Layer[] {
        return nodes.map((l) => {
          const modifiers = { ...l.modifiers };
          if (modifiers.maskSource && doomed.has(modifiers.maskSource))
            delete modifiers.maskSource;
          const drivers = { ...l.drivers };
          for (const [k, d] of Object.entries(drivers))
            if (d.config.type === "map" && doomed.has(d.config.source))
              delete drivers[k];
          return { ...l, modifiers, drivers, children: clean(l.children) };
        });
      }
      return { ...p, layers: clean(layers) };
    });
    if (selected === id) setSelected(null);
  }
  async function switchProject(p: Project) {
    try {
      clearTimeout(saveTimer.current);
      await enqueue(project);
      load(p);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function newProject(starter: number) {
    const p = createProject(starter);
    try {
      clearTimeout(saveTimer.current);
      await enqueue(project);
      await enqueue(p);
      load(p);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function openProjects() {
    try {
      await enqueue(project);
      setProjects(await listProjects());
      setModal("open");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function duplicateProject() {
    const now = new Date().toISOString();
    const p = {
      ...structuredClone(project),
      id: crypto.randomUUID(),
      name: `${project.name} copy`,
      createdAt: now,
      updatedAt: now,
    };
    await switchProject(p);
  }
  function preview(changes: Partial<Project["preview"]>, group?: string) {
    commit((p) => ({ ...p, preview: { ...p.preview, ...changes } }), group);
  }
  return (
    <div className="workshop">
      <header className="top-toolbar">
        <a className="brand" href="#" aria-label="Shader Workshop">
          <span className="brand-mark">
            <Icon name="asterisk" />
          </span>
          <span>
            Shader
            <br />
            <strong>Workshop</strong>
          </span>
        </a>
        <div className="toolbar-divider" />
        <details className="project-menu">
          <summary aria-label="Project actions">
            <Icon name="folder2" />
            <span>Project</span>
            <Icon name="chevron-down" />
          </summary>
          <div className="menu-popover">
            {[
              {
                label: "New composition",
                icon: "plus-lg",
                action: () => setModal("new"),
              },
              {
                label: "Open local project",
                icon: "folder2-open",
                action: openProjects,
              },
              {
                label: "Duplicate project",
                icon: "copy",
                action: duplicateProject,
              },
              {
                label: "Rename project",
                icon: "pencil",
                action: () =>
                  document
                    .querySelector<HTMLInputElement>(
                      '[aria-label="Project name"]',
                    )
                    ?.focus(),
              },
              {
                label: "Import project JSON",
                icon: "upload",
                action: () => importInput.current?.click(),
              },
              {
                label: "Delete project",
                icon: "trash3",
                action: () => setDeleteId(project.id),
              },
            ].map((a) => (
              <button
                key={a.label}
                onClick={(ev) => {
                  (
                    ev.currentTarget.closest("details") as HTMLDetailsElement
                  ).open = false;
                  void a.action();
                }}
              >
                <Icon name={a.icon} />
                {a.label}
              </button>
            ))}
            <hr />
            <label>
              <input
                type="checkbox"
                checked={fallback}
                onChange={(e) => setFallback(e.target.checked)}
              />{" "}
              Simulate WebGPU unavailable
            </label>
          </div>
        </details>
        <input
          className="project-name"
          aria-label="Project name"
          value={project.name}
          onChange={(e) => {
            if (e.target.value)
              commit((p) => ({ ...p, name: e.target.value }), "project-name");
          }}
        />
        <div className="history-buttons">
          <IconButton
            icon="arrow-counterclockwise"
            label="Undo"
            disabled={!history.past.length}
            onClick={() => setHistory(undo)}
          />
          <IconButton
            icon="arrow-clockwise"
            label="Redo"
            disabled={!history.future.length}
            onClick={() => setHistory(redo)}
          />
        </div>
        <div className="toolbar-divider" />
        <IconButton
          icon={playing ? "pause-fill" : "play-fill"}
          label={playing ? "Pause app motion" : "Play app motion"}
          active={playing}
          onClick={() => setPlaying((p) => !p)}
        />
        <span
          className={`saved-state ${saved === "Save failed" ? "failed" : ""}`}
          role="status"
        >
          <Icon name={saved === "Saving…" ? "arrow-repeat" : "check2"} />
          {saved}
        </span>
        <div className="toolbar-spacer" />
        <div className="context-switch segmented">
          <button
            className={project.context === "website" ? "active" : ""}
            onClick={() => commit((p) => ({ ...p, context: "website" }))}
          >
            <Icon name="window" />
            <span>Website Section</span>
          </button>
          <button
            className={project.context === "item" ? "active" : ""}
            onClick={() => commit((p) => ({ ...p, context: "item" }))}
          >
            <Icon name="box" />
            <span>Item Background</span>
          </button>
        </div>
        <IconButton
          icon={theme === "light" ? "moon" : "sun"}
          label="Switch theme"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
        <button
          className="button primary export-trigger"
          onClick={() => setModal("export")}
        >
          <Icon name="box-arrow-up" />
          Export
        </button>
      </header>
      {error && (
        <div className="error-bar" role="alert">
          <Icon name="exclamation-triangle" />
          <span>{error}</span>
          <IconButton
            icon="x-lg"
            label="Dismiss error"
            onClick={() => setError("")}
          />
        </div>
      )}
      <nav className="mobile-tools">
        <button
          onClick={() => {
            setLibraryOpen((v) => !v);
            setInspectorOpen(false);
          }}
          className={libraryOpen ? "active" : ""}
        >
          <Icon name="collection" />
          Library & layers
        </button>
        <span>{layer?.name || "Preview controls"}</span>
        <button
          onClick={() => {
            setInspectorOpen((v) => !v);
            setLibraryOpen(false);
          }}
          className={inspectorOpen ? "active" : ""}
        >
          <Icon name="sliders2" />
          Inspector
        </button>
      </nav>
      <div
        className={`editor-layout ${libraryOpen ? "library-open" : ""} ${inspectorOpen ? "inspector-open" : ""}`}
      >
        <aside className="left-rail">
          <Library onAdd={add} />
          <LayerList
            layers={project.layers}
            selected={selected}
            onSelect={(id) => {
              setSelected(id);
              setTab("layer");
            }}
            onChange={changeLayer}
            onMove={(id, delta) =>
              commit((p) => ({ ...p, layers: move(p.layers, id, delta) }))
            }
            onDelete={remove}
            onDuplicate={duplicateLayer}
          />
          <button className="starter-button" onClick={() => setModal("new")}>
            <Icon name="grid-1x2" />
            Browse starter compositions
            <Icon name="arrow-up-right" />
          </button>
        </aside>
        <Canvas
          project={project}
          playing={playing}
          reduced={reduced || systemReduced}
          zoom={zoom}
          onZoom={setZoom}
          onDevice={(device) =>
            preview({
              device,
              ...(device === "mobile" && project.preview.ratio === "16/9"
                ? { ratio: "3/4" as const }
                : {}),
            })
          }
          onStatus={setGpu}
          forceFallback={fallback}
        />
        <Inspector
          project={project}
          layer={layer}
          tab={tab}
          onTab={setTab}
          onLayer={(changes, group) => {
            if (selected) changeLayer(selected, changes, group);
          }}
          onPreview={preview}
        />
      </div>
      <footer className="status-bar">
        <span className={`gpu-status status-${gpu}`}>
          <span className="status-dot" />
          {gpu === "ready"
            ? "WebGPU active"
            : gpu === "loading"
              ? "Starting renderer…"
              : gpu === "reduced"
                ? "Reduced motion"
                : gpu === "error"
                  ? "Renderer error"
                  : "Static fallback"}
        </span>
        <span className="local-note">
          <Icon name="hdd" />
          Local workspace · Shaders 4.0.4
        </span>
        <label>
          <input
            type="checkbox"
            checked={reduced || systemReduced}
            disabled={systemReduced}
            onChange={(e) => setReduced(e.target.checked)}
          />
          Reduced motion preview
        </label>
        <span className="shortcut">
          Undo <kbd>Ctrl Z</kbd>
        </span>
      </footer>
      <input
        className="sr-only"
        ref={importInput}
        type="file"
        accept=".json,application/json"
        aria-label="Import project JSON file"
        onChange={async (ev) => {
          const file = ev.target.files?.[0];
          ev.target.value = "";
          if (file) {
            const original = await file.text();
            try {
              const p = parseProject(JSON.parse(original));
              await enqueue(project);
              await enqueue(p);
              load(p);
            } catch (e) {
              setRejected({
                name: file.name,
                text: original,
                error: (e as Error).message,
              });
              setError(
                `Import rejected — ${String((e as Error).message)}. Original file and current project are unchanged.`,
              );
            }
          }
        }}
      />
      <Modal
        open={modal === "new"}
        onClose={() => setModal(null)}
        title="Start a composition"
        description="Begin with a blank canvas or make a starter your own."
        wide
      >
        <button className="blank-starter" onClick={() => void newProject(-1)}>
          <Icon name="plus-lg" />
          <div>
            <strong>Blank canvas</strong>
            <p>A clean starting point for your next idea.</p>
          </div>
          <Icon name="arrow-right" />
        </button>
        <div className="starter-grid">
          {starterNames.map((name, i) => (
            <button key={name} onClick={() => void newProject(i)}>
              <span className="starter-number">0{i + 1}</span>
              <strong>{name}</strong>
              <small>{i === 5 ? "Item Background" : "Website Section"}</small>
              <Icon name="arrow-up-right" />
            </button>
          ))}
        </div>
      </Modal>
      <Modal
        open={modal === "open"}
        onClose={() => setModal(null)}
        title="Local projects"
        description="Saved in this browser, on this device."
      >
        <div className="project-list">
          {projects.map((p) => (
            <div key={p.id}>
              <button
                className="open-project"
                onClick={() => void switchProject(p)}
              >
                <Icon name="file-earmark" />
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    {p.context === "website"
                      ? "Website Section"
                      : "Item Background"}{" "}
                    · {new Date(p.updatedAt).toLocaleString()}
                  </small>
                </span>
                <Icon name="arrow-up-right" />
              </button>
              <IconButton
                icon="trash3"
                label={`Delete project ${p.name}`}
                onClick={() => setDeleteId(p.id)}
              />
            </div>
          ))}
          {!projects.length && <p>No saved projects yet.</p>}
        </div>
      </Modal>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete saved project?"
        description="This removes the local copy. Export JSON first if you need to keep it."
      >
        <footer className="dialog-actions">
          <button className="button" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button
            className="button danger"
            onClick={async () => {
              if (!deleteId) return;
              try {
                clearTimeout(saveTimer.current);
                await writeQueue.current;
                await deleteProject(deleteId);
                if (deleteId === project.id) {
                  const rest = await listProjects();
                  load(rest[0] || createProject(-1));
                }
                setProjects(await listProjects());
                setDeleteId(null);
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Delete project
          </button>
        </footer>
      </Modal>
      <ExportDialog
        open={modal === "export"}
        onClose={() => setModal(null)}
        project={project}
      />
      <Modal
        open={!!rejected}
        onClose={() => setRejected(null)}
        title="Project import rejected"
        description="No data was discarded. The original JSON is preserved below."
      >
        <pre className="import-errors">{rejected?.error}</pre>
        <details>
          <summary>Original file data</summary>
          <textarea
            aria-label="Rejected project JSON"
            readOnly
            value={rejected?.text || ""}
            style={{ width: "100%", height: 200 }}
          />
        </details>
        <footer className="dialog-actions">
          <button
            className="button"
            onClick={() => {
              if (rejected)
                download(rejected.name, rejected.text, "application/json");
            }}
          >
            Download original file
          </button>
          <button className="button primary" onClick={() => setRejected(null)}>
            Close
          </button>
        </footer>
      </Modal>
    </div>
  );
}
