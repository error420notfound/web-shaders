import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Icon, IconButton, Modal } from "../../components/controls/Primitives";
import { Field, Hierarchy } from "../../components/motion/MotionControls";
import { MotionInspector } from "../../components/motion/MotionInspector";
import { MotionCanvas } from "../../components/motion/MotionCanvas";
import { MotionTimeline } from "../../components/motion/MotionTimeline";
import {
  MotionEditorProvider,
  useMotionEditor,
} from "../../features/motion/editor";
import { cleanSequences } from "../../features/motion/animations";
import { download } from "../../features/export/code";
import {
  createMotionProject,
  deleteDefinition,
  insertInstance,
  makeElement,
  makeScene,
  removeParameter,
  reparentNode,
  replaceDefinition,
  uid,
  updateNode,
} from "../../features/motion/commands";
import {
  editMotion,
  redoMotion,
  undoMotion,
} from "../../features/motion/history";
import type { MotionHistory } from "../../features/motion/history";
import {
  elementKinds,
  flattenNodes,
  parseMotionProject,
} from "../../features/motion/schema";
import type {
  ElementNode,
  MotionNode,
  MotionProject,
} from "../../features/motion/schema";
import {
  activeMotionProject,
  deleteMotionProject,
  listMotionProjects,
  saveMotionProject,
} from "../../features/motion/storage";
import { exportStaticMotion } from "../../features/export/motion/static";
import { downloadZip } from "../../features/export/motion/zip";

const imageMime = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export default function MotionWorkspace({
  onSwitch,
}: {
  onSwitch: () => void;
}) {
  const [history, setHistory] = useState<MotionHistory>(() => ({
    present: createMotionProject(),
    past: [],
    future: [],
  }));
  const project = history.present;
  const [ready, setReady] = useState(false),
    [saved, setSaved] = useState("Opening local workspace…"),
    [error, setError] = useState("");
  const [animationFocus, setAnimationFocus] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState(project.scenes[0].id),
    [selected, setSelected] = useState<string | null>(null),
    [definitionId, setDefinitionId] = useState<string | null>(null);
  const [width, setWidth] = useState(960),
    [zoom, setZoom] = useState(0.8),
    [scroll, setScroll] = useState(false);
  const [panel, setPanel] = useState<"library" | "inspector" | null>(null);
  const [modal, setModal] = useState<
    "open" | "export" | "delete-component" | "delete-project" | "new" | null
  >(null);
  const [projects, setProjects] = useState<MotionProject[]>([]),
    [deletingDefinition, setDeletingDefinition] = useState<string | null>(null);
  const [removingParameter, setRemovingParameter] = useState<string | null>(
    null,
  );
  const [rejected, setRejected] = useState<{
    name: string;
    text: string;
  } | null>(null);
  const current = useRef(project);
  const workshopRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = workshopRef.current;
    if (!root) return;
    const header = root.querySelector(".motion-toolbar")!,
      tools = root.querySelector(".motion-mobile-tools")!;
    const measure = () =>
      root.style.setProperty(
        "--motion-drawer-top",
        `${Math.max(header.getBoundingClientRect().bottom, tools.getBoundingClientRect().bottom)}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(tools);
    measure();
    return () => observer.disconnect();
  }, [project.id, sceneId, definitionId, ready]);
  current.current = project;
  const opened = useRef(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve()),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const importInput = useRef<HTMLInputElement>(null),
    imageInput = useRef<HTMLInputElement>(null);
  const scene =
    project.scenes.find((s) => s.id === sceneId) ?? project.scenes[0];
  const definition = project.components.find((d) => d.id === definitionId);
  const roots = definition ? [definition.root] : scene.roots;
  const node = flattenNodes(roots).find((n) => n.id === selected);
  const enqueue = useCallback((p: MotionProject) => {
    queue.current = queue.current
      .catch(() => {})
      .then(() => saveMotionProject(p));
    return queue.current;
  }, []);
  function load(p: MotionProject) {
    setHistory({ present: p, past: [], future: [] });
    setSceneId(p.scenes[0].id);
    setSelected(null);
    setDefinitionId(null);
    setModal(null);
  }
  useEffect(() => {
    if (opened.current) return;
    let live = true;
    activeMotionProject()
      .then((p) => {
        if (live) {
          opened.current = true;
          if (p) load(p);
          setReady(true);
        }
      })
      .catch((e) => {
        if (live) {
          opened.current = true;
          setError(`Could not open motion projects: ${e.message}`);
          setReady(true);
        }
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setSaved("Saving…");
    timer.current = setTimeout(() => {
      enqueue(project)
        .then(() => {
          if (!cancelled) setSaved("All changes saved");
        })
        .catch((e) => {
          if (!cancelled) {
            setSaved("Save failed");
            setError(`${e.message}. Export JSON to keep a copy.`);
          }
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [project, ready, enqueue]);
  const commit = useCallback((fn: (p: MotionProject) => MotionProject) => {
    try {
      const next = parseMotionProject(fn(current.current));
      current.current = next;
      setHistory((h) => editMotion(h, next));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    const flush = () => {
      if (document.hidden && ready)
        void enqueue(current.current).catch((e) => setError(e.message));
    };
    const keys = (e: KeyboardEvent) => {
      const input = (e.target as HTMLElement).closest(
        'input,textarea,select,[contenteditable="true"],[role="dialog"]',
      );
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void enqueue(current.current)
          .then(() => setSaved("All changes saved"))
          .catch((e) => setError(e.message));
      }
      if (!input && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setHistory(e.shiftKey ? redoMotion : undoMotion);
      }
      if (!input && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        setHistory(redoMotion);
      }
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("keydown", keys);
    };
  }, [enqueue, ready]);
  const select = useCallback((id: string) => setSelected(id), []);
  function editRoots(fn: (nodes: MotionNode[]) => MotionNode[]) {
    commit((p) => {
      const next = definitionId
        ? {
            ...p,
            components: p.components.map((d) =>
              d.id === definitionId
                ? { ...d, version: d.version + 1, root: fn([d.root])[0] }
                : d,
            ),
          }
        : {
            ...p,
            scenes: p.scenes.map((s) =>
              s.id === scene.id ? { ...s, roots: fn(s.roots) } : s,
            ),
          };
      return {
        ...next,
        scenes: next.scenes.map((s) => ({
          ...s,
          sequences: cleanSequences(s.sequences, s.roots, next),
        })),
        components: next.components.map((d) => ({
          ...d,
          sequences: cleanSequences(d.sequences, [d.root], next),
        })),
      };
    });
  }
  function editNode(fn: (n: MotionNode) => MotionNode) {
    if (selected) editRoots((nodes) => updateNode(nodes, selected, fn));
  }
  function add(type: ElementNode["type"]) {
    const added = makeElement(type);
    editRoots((nodes) =>
      node?.kind === "element" && ["container", "group"].includes(node.type)
        ? updateNode(nodes, node.id, (n) =>
            n.kind === "element"
              ? { ...n, children: [...n.children, added] }
              : n,
          )
        : definition
          ? (() => {
              const group = makeElement("group");
              group.children = [...nodes, added];
              return [group];
            })()
          : [...nodes, added],
    );
    setSelected(added.id);
  }
  async function flush() {
    clearTimeout(timer.current);
    await enqueue(current.current);
    setSaved("All changes saved");
  }
  async function switchWorkspace() {
    try {
      await flush();
      onSwitch();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function openProjects() {
    try {
      await flush();
      setProjects(await listMotionProjects());
      setModal("open");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (!ready) return <p role="status">Opening local Motion Designer…</p>;
  return (
    <MotionEditorProvider
      key={`${project.id}:${definitionId ?? scene.id}`}
      initialAnimationId={definitionId ? animationFocus : null}
      onDefinition={(id, nodeId, animationId) => {
        setDefinitionId(id);
        setSelected(nodeId);
        setAnimationFocus(animationId);
      }}
      project={project}
      roots={roots}
      sequences={definition?.sequences ?? scene.sequences}
      selected={selected}
      onSelect={select}
      onInspector={() => {
        if (window.innerWidth <= 1100) setPanel("inspector");
      }}
      commitSequences={(sequences) =>
        commit((p) =>
          definitionId
            ? {
                ...p,
                components: p.components.map((d) =>
                  d.id === definitionId
                    ? { ...d, sequences, version: d.version + 1 }
                    : d,
                ),
              }
            : {
                ...p,
                scenes: p.scenes.map((s) =>
                  s.id === scene.id ? { ...s, sequences } : s,
                ),
              },
        )
      }
      undo={() => setHistory(undoMotion)}
      redo={() => setHistory(redoMotion)}
      canUndo={!!history.past.length}
      canRedo={!!history.future.length}
    >
      <div className="workshop motion-workshop" ref={workshopRef}>
        <header className="top-toolbar motion-toolbar">
          <a className="brand" href="#" aria-label="Motion Designer">
            <span className="brand-mark">
              <Icon name="bezier2" />
            </span>
            <strong>
              Motion
              <br />
              Designer
            </strong>
          </a>
          <div
            className="workspace-switch segmented"
            role="group"
            aria-label="Workspace"
          >
            <button aria-pressed="false" onClick={() => void switchWorkspace()}>
              Shader Designer
            </button>
            <button aria-pressed="true">Motion Designer</button>
          </div>
          <input
            className="project-name"
            aria-label="Motion project name"
            value={project.name}
            onChange={(e) => {
              if (e.target.value.trim())
                commit((p) => ({ ...p, name: e.target.value }));
            }}
          />
          <IconButton
            icon="arrow-counterclockwise"
            label="Undo motion edit"
            disabled={!history.past.length}
            onClick={() => setHistory(undoMotion)}
          />
          <IconButton
            icon="arrow-clockwise"
            label="Redo motion edit"
            disabled={!history.future.length}
            onClick={() => setHistory(redoMotion)}
          />
          <span className="saved-state" role="status">
            {saved}
          </span>
          <div className="toolbar-spacer" />
          <button className="button" onClick={() => setModal("new")}>
            New
          </button>
          <button className="button" onClick={() => void openProjects()}>
            Open
          </button>
          <button
            className="button"
            onClick={() => importInput.current?.click()}
          >
            Import JSON
          </button>
          <button className="button primary" onClick={() => setModal("export")}>
            Export
          </button>
        </header>
        {error && (
          <div className="error-bar" role="alert">
            <span>{error}</span>
            <IconButton
              icon="x-lg"
              label="Dismiss motion error"
              onClick={() => setError("")}
            />
          </div>
        )}
        <nav className="motion-mobile-tools">
          <button
            onClick={() => setPanel(panel === "library" ? null : "library")}
          >
            Library & hierarchy
          </button>
          <button
            onClick={() => setPanel(panel === "inspector" ? null : "inspector")}
          >
            Inspector
          </button>
        </nav>
        <div className={`motion-layout ${panel ? `motion-${panel}-open` : ""}`}>
          <aside className="motion-library">
            <button
              className="motion-drawer-close"
              onClick={() => setPanel(null)}
            >
              Close library
            </button>
            <div className="motion-panel-heading">
              <strong>Scenes</strong>
              <button
                className="button"
                onClick={() => {
                  const s = makeScene();
                  commit((p) => ({ ...p, scenes: [...p.scenes, s] }));
                  setSceneId(s.id);
                  setDefinitionId(null);
                  setSelected(s.roots[0]?.id ?? null);
                }}
              >
                + Scene
              </button>
            </div>
            <select
              aria-label="Active motion scene"
              value={scene.id}
              onChange={(e) => {
                setSceneId(e.target.value);
                setDefinitionId(null);
                setSelected(null);
              }}
            >
              {project.scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Field
              label="Scene name"
              value={scene.name}
              onCommit={(name) =>
                commit((p) => ({
                  ...p,
                  scenes: p.scenes.map((s) =>
                    s.id === scene.id ? { ...s, name } : s,
                  ),
                }))
              }
            />
            <h2>Add element</h2>
            <div className="motion-element-grid">
              {elementKinds.map((type) => (
                <button key={type} onClick={() => add(type)}>
                  {type}
                </button>
              ))}
            </div>
            <h2>
              {definition ? `Editing: ${definition.name}` : "Scene hierarchy"}
            </h2>
            {definition && (
              <button
                className="button"
                onClick={() => {
                  setDefinitionId(null);
                  setSelected(null);
                }}
              >
                Back to scene
              </button>
            )}
            <Hierarchy nodes={roots} selected={selected} onSelect={select} />
            <h2>Reusable components</h2>
            {!project.components.length && (
              <p className="motion-muted">
                Select an element or group and choose Create component.
              </p>
            )}
            {project.components.map((d) => (
              <div className="motion-component-row" key={d.id}>
                <span>
                  {d.name}
                  <small>v{d.version}</small>
                </span>
                <button
                  aria-label={`Insert ${d.name}`}
                  onClick={() => {
                    const n = insertInstance(d);
                    setDefinitionId(null);
                    commit((p) => ({
                      ...p,
                      scenes: p.scenes.map((s) =>
                        s.id === scene.id
                          ? { ...s, roots: [...s.roots, n] }
                          : s,
                      ),
                    }));
                    setSelected(n.id);
                  }}
                >
                  Insert
                </button>
                <button
                  aria-label={`Edit ${d.name} definition`}
                  onClick={() => {
                    setDefinitionId(d.id);
                    setSelected(d.root.id);
                  }}
                >
                  Edit
                </button>
                <IconButton
                  icon="trash3"
                  label={`Delete component ${d.name}`}
                  onClick={() => {
                    setDeletingDefinition(d.id);
                    setModal("delete-component");
                  }}
                />
              </div>
            ))}
            <button
              className="button"
              onClick={() => setModal("delete-project")}
            >
              Delete motion project
            </button>
          </aside>
          <main className="motion-center">
            <div className="motion-canvas-toolbar">
              <label>
                Viewport{" "}
                <select
                  aria-label="Preview viewport"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                >
                  <option value={1200}>Desktop · 1200</option>
                  <option value={960}>Desktop · 960</option>
                  <option value={768}>Tablet · 768</option>
                  <option value={390}>Mobile · 390</option>
                </select>
              </label>
              <label>
                Zoom{" "}
                <select
                  aria-label="Canvas zoom"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                >
                  <option value={0.5}>50%</option>
                  <option value={0.8}>80%</option>
                  <option value={1}>100%</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={scroll}
                  onChange={(e) => setScroll(e.target.checked)}
                />{" "}
                Scroll layout preview
              </label>
              <MotionPreviewMode />
            </div>
            <MotionCanvas
              project={project}
              scene={
                definition ? { ...scene, roots: [definition.root] } : scene
              }
              selected={selected}
              onSelect={select}
              width={width}
              zoom={zoom}
              scroll={scroll}
            />
            <MotionTimeline />
          </main>
          <MotionInspector
            roots={roots}
            onReparent={(parentId) => {
              if (selected)
                editRoots((nodes) => reparentNode(nodes, selected, parentId));
            }}
            node={node}
            definition={definition}
            project={project}
            sceneId={scene.id}
            editNode={editNode}
            editRoots={editRoots}
            commit={commit}
            onSelect={setSelected}
            onClose={() => setPanel(null)}
            onUpload={() => imageInput.current?.click()}
            onRemoveParameter={setRemovingParameter}
          />
        </div>
        <footer className="status-bar">
          <span>Local workspace · Motion document v1</span>
          <span>GSAP animation preview</span>
          <span>Astro-first output</span>
        </footer>
        <input
          ref={importInput}
          type="file"
          className="sr-only"
          aria-label="Import motion project JSON"
          accept=".json,application/json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const text = await file.text();
            try {
              const p = parseMotionProject(JSON.parse(text));
              await flush();
              await enqueue(p);
              load(p);
              setRejected(null);
            } catch (e) {
              setError(`Import rejected: ${(e as Error).message}`);
              setRejected({ name: file.name, text });
            }
          }}
        />
        <input
          ref={imageInput}
          type="file"
          className="sr-only"
          aria-label="Upload motion image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={async (e) => {
            const file = e.target.files?.[0],
              targetId = selected,
              targetDefinition = definitionId,
              targetScene = scene.id;
            e.target.value = "";
            if (!file || !targetId) return;
            if (
              !imageMime.includes(file.type) ||
              file.size > 10 * 1024 * 1024
            ) {
              setError("Choose a PNG, JPEG, WebP or GIF image up to 10 MB.");
              return;
            }
            try {
              const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result));
                reader.onerror = () =>
                  reject(new Error("Could not read image"));
                reader.readAsDataURL(file);
              });
              const asset = {
                id: uid(),
                name: file.name.replace(/[^\w .-]/g, "_"),
                mime: file.type as MotionProject["assets"][number]["mime"],
                data,
              };
              const apply = (nodes: MotionNode[]) =>
                updateNode(nodes, targetId, (n) =>
                  n.kind === "element"
                    ? { ...n, source: `asset:${asset.id}` }
                    : n,
                );
              commit((p) => ({
                ...p,
                assets: [...p.assets, asset],
                scenes: p.scenes.map((s) =>
                  s.id === targetScene && !targetDefinition
                    ? { ...s, roots: apply(s.roots) }
                    : s,
                ),
                components: p.components.map((d) =>
                  d.id === targetDefinition
                    ? { ...d, version: d.version + 1, root: apply([d.root])[0] }
                    : d,
                ),
              }));
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        />
        <Modal
          open={modal === "new"}
          onClose={() => setModal(null)}
          title="New motion project"
          description="Your current project stays saved in this browser."
        >
          <button
            className="button primary"
            onClick={async () => {
              try {
                await flush();
                const p = createMotionProject();
                await enqueue(p);
                load(p);
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Create new motion project
          </button>
        </Modal>
        <Modal
          open={modal === "open"}
          onClose={() => setModal(null)}
          title="Local motion projects"
          description="Saved in this browser, on this device."
        >
          <div className="project-list">
            {projects.map((p) => (
              <button
                className="open-project"
                key={p.id}
                onClick={async () => {
                  try {
                    await flush();
                    await enqueue(p);
                    load(p);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Modal>
        <Modal
          open={modal === "delete-project"}
          onClose={() => setModal(null)}
          title="Delete motion project?"
          description="Export JSON first if you need a backup."
        >
          <button className="button" onClick={() => setModal(null)}>
            Cancel
          </button>
          <button
            className="button danger"
            onClick={async () => {
              try {
                clearTimeout(timer.current);
                await queue.current;
                await deleteMotionProject(project.id);
                const remaining = await listMotionProjects();
                const next = remaining[0] ?? createMotionProject();
                await enqueue(next);
                load(next);
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Delete saved motion project
          </button>
        </Modal>
        <Modal
          open={modal === "delete-component"}
          onClose={() => setModal(null)}
          title="Delete component definition?"
          description="Choose how to handle every referencing instance, including nested components."
        >
          <button className="button" onClick={() => setModal(null)}>
            Cancel
          </button>
          {(["detach", "delete"] as const).map((action) => (
            <button
              className="button"
              key={action}
              onClick={() => {
                if (deletingDefinition) {
                  commit((p) =>
                    deleteDefinition(p, deletingDefinition, action),
                  );
                  setDefinitionId(null);
                  setSelected(null);
                  setModal(null);
                }
              }}
            >
              {action === "detach"
                ? "Detach instances and keep elements"
                : "Delete definition and its instances"}
            </button>
          ))}
          {project.components
            .filter((d) => d.id !== deletingDefinition)
            .map((d) => (
              <button
                className="button"
                key={d.id}
                onClick={() => {
                  if (deletingDefinition) {
                    commit((p) =>
                      replaceDefinition(p, deletingDefinition, d.id),
                    );
                    setDefinitionId(null);
                    setSelected(null);
                    setModal(null);
                  }
                }}
              >
                Replace with {d.name} and clear instance overrides
              </button>
            ))}
        </Modal>
        <Modal
          open={!!removingParameter}
          onClose={() => setRemovingParameter(null)}
          title="Remove exposed parameter?"
          description="This removes the parameter and its overrides from every instance. Base properties are retained."
        >
          <button className="button" onClick={() => setRemovingParameter(null)}>
            Cancel
          </button>
          <button
            className="button danger"
            onClick={() => {
              if (definitionId && removingParameter)
                commit((p) =>
                  removeParameter(p, definitionId, removingParameter),
                );
              setRemovingParameter(null);
            }}
          >
            Remove parameter and instance overrides
          </button>
        </Modal>
        <Modal
          open={modal === "export"}
          onClose={() => setModal(null)}
          title="Export motion project"
          description="Static foundations are available. Animated production exports await GSAP licensing clearance."
        >
          <button
            className="button"
            onClick={() =>
              download(
                "motion-project.json",
                JSON.stringify(project, null, 2),
                "application/json",
              )
            }
          >
            Download project JSON
          </button>
          <label className="motion-field">
            Output target
            <select
              aria-label="Motion export target"
              value={project.export.target}
              onChange={(e) =>
                commit((p) => ({
                  ...p,
                  export: { target: e.target.value as "astro" | "vanilla" },
                }))
              }
            >
              <option value="astro">Astro</option>
              <option value="vanilla">Vanilla HTML/CSS</option>
            </select>
          </label>
          <button
            className="button primary"
            onClick={() => {
              try {
                downloadZip(
                  "motion-scene.zip",
                  exportStaticMotion(project, scene.id),
                );
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Download scene
          </button>
          {project.components.map((d) => (
            <button
              className="button"
              key={d.id}
              onClick={() => {
                try {
                  downloadZip(
                    `${d.name.replace(/[^a-z0-9]/gi, "-")}.zip`,
                    exportStaticMotion(project, d.id, true),
                  );
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            >
              Download component: {d.name}
            </button>
          ))}
        </Modal>
        <Modal
          open={!!rejected}
          onClose={() => setRejected(null)}
          title="Motion import rejected"
          description="The original input is retained and your project is unchanged."
        >
          <textarea
            readOnly
            aria-label="Rejected motion JSON"
            value={rejected?.text ?? ""}
          />
          <button
            className="button"
            onClick={() => {
              if (rejected)
                download(rejected.name, rejected.text, "application/json");
            }}
          >
            Download original input
          </button>
        </Modal>
      </div>
    </MotionEditorProvider>
  );
}

function MotionPreviewMode() {
  const e = useMotionEditor();
  return (
    <div className="segmented" role="group" aria-label="Preview mode">
      <button aria-pressed={!e.test} onClick={() => e.setTest(false)}>
        Edit
      </button>
      <button aria-pressed={e.test} onClick={() => e.setTest(true)}>
        Test triggers
      </button>
    </div>
  );
}
