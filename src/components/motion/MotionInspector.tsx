import { useState } from "react";
import { Field } from "./MotionControls";
import { AnimationInspector } from "./AnimationInspector";
import { useMotionEditor } from "../../features/motion/editor";
import {
  componentFromSelection,
  detachMotionInstance,
  exposeParameter,
  makeElement,
  removeNode,
  updateNode,
} from "../../features/motion/commands";
import {
  elementKinds,
  styleKeys,
  flattenNodes,
} from "../../features/motion/schema";
import type {
  Definition,
  ElementNode,
  MotionNode,
  MotionProject,
  Parameter,
  Styles,
} from "../../features/motion/schema";
interface Props {
  roots: MotionNode[];
  onReparent: (parentId: string | null) => void;
  node?: MotionNode;
  definition?: Definition;
  project: MotionProject;
  sceneId: string;
  editNode: (fn: (node: MotionNode) => MotionNode) => void;
  editRoots: (fn: (nodes: MotionNode[]) => MotionNode[]) => void;
  commit: (fn: (project: MotionProject) => MotionProject) => void;
  onSelect: (id: string | null) => void;
  onClose: () => void;
  onUpload: () => void;
  onRemoveParameter: (id: string) => void;
}
export function MotionInspector({
  roots,
  onReparent,
  node,
  definition,
  project,
  sceneId,
  editNode,
  editRoots,
  commit,
  onSelect,
  onClose,
  onUpload,
  onRemoveParameter,
}: Props) {
  const animationEditor = useMotionEditor();
  const [styleKey, setStyleKey] =
    useState<(typeof styleKeys)[number]>("padding");
  const [breakpoint, setBreakpoint] = useState<"base" | "tablet" | "mobile">(
    "base",
  );
  const [parameterProperty, setParameterProperty] =
    useState<Parameter["property"]>("content");
  const [parameterName, setParameterName] = useState("text");
  function styleChange(v: string) {
    editNode((n) => {
      const styles: Styles = {
        ...(breakpoint === "base" ? n.styles : n.responsive[breakpoint]),
      };
      if (v.trim())
        styles[styleKey] =
          ["opacity", "zIndex", "fontWeight", "lineHeight"].includes(
            styleKey,
          ) && Number.isFinite(Number(v))
            ? Number(v)
            : v;
      else delete styles[styleKey];
      return breakpoint === "base"
        ? { ...n, styles }
        : { ...n, responsive: { ...n.responsive, [breakpoint]: styles } };
    });
  }
  return (
    <aside className="motion-inspector">
      <button className="motion-drawer-close" onClick={() => onClose()}>
        Close inspector
      </button>
      <h2>Element inspector</h2>
      <div
        className="segmented motion-inspector-tabs"
        role="group"
        aria-label="Inspector tabs"
      >
        <button
          aria-pressed={animationEditor.tab === "element"}
          onClick={() => animationEditor.setTab("element")}
        >
          Element
        </button>
        <button
          aria-pressed={animationEditor.tab === "animation"}
          onClick={() => animationEditor.setTab("animation")}
        >
          Animation
        </button>
      </div>
      {animationEditor.tab === "animation" ? (
        <AnimationInspector />
      ) : (
        <>
          {!node ? (
            <p className="motion-muted">
              Select an element in the preview or hierarchy.
            </p>
          ) : (
            <>
              <Field
                label="Element name"
                value={node.name}
                onCommit={(name) => editNode((n) => ({ ...n, name }))}
              />
              {node.kind === "element" ? (
                <>
                  <label className="motion-field">
                    Element type
                    <select
                      aria-label="Element type"
                      value={node.type}
                      onChange={(e) =>
                        editNode((n) =>
                          n.kind === "element"
                            ? {
                                ...n,
                                type: e.target.value as ElementNode["type"],
                              }
                            : n,
                        )
                      }
                    >
                      {elementKinds.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  {["heading", "paragraph", "text", "button"].includes(
                    node.type,
                  ) && (
                    <Field
                      label="Text content"
                      value={node.content}
                      multiline
                      onCommit={(content) =>
                        editNode((n) =>
                          n.kind === "element" ? { ...n, content } : n,
                        )
                      }
                    />
                  )}
                  {node.type === "image" && (
                    <>
                      <Field
                        label="Image URL"
                        value={node.source}
                        onCommit={(source) =>
                          editNode((n) =>
                            n.kind === "element" ? { ...n, source } : n,
                          )
                        }
                      />
                      <button className="button" onClick={() => onUpload()}>
                        Upload image
                      </button>
                    </>
                  )}
                  {["image", "svg"].includes(node.type) && (
                    <Field
                      label="Accessible image description"
                      value={node.alt}
                      onCommit={(alt) =>
                        editNode((n) =>
                          n.kind === "element" ? { ...n, alt } : n,
                        )
                      }
                    />
                  )}
                  {node.type === "svg" && (
                    <Field
                      label="SVG path data"
                      value={node.svgPath}
                      multiline
                      onCommit={(svgPath) =>
                        editNode((n) =>
                          n.kind === "element" ? { ...n, svgPath } : n,
                        )
                      }
                    />
                  )}
                  {!definition && (
                    <button
                      className="button"
                      onClick={() => {
                        commit((p) =>
                          componentFromSelection(p, sceneId, node.id),
                        );
                        onSelect(null);
                      }}
                    >
                      Create component
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>
                    Instance of{" "}
                    <strong>
                      {
                        project.components.find(
                          (d) => d.id === node.definitionId,
                        )?.name
                      }
                    </strong>
                  </p>
                  {project.components
                    .find((d) => d.id === node.definitionId)
                    ?.parameters.map((param) => (
                      <div key={param.id}>
                        <Field
                          label={`Parameter ${param.name}`}
                          value={node.overrides[param.id] ?? param.defaultValue}
                          onCommit={(v) =>
                            editNode((n) =>
                              n.kind === "instance"
                                ? {
                                    ...n,
                                    overrides: {
                                      ...n.overrides,
                                      [param.id]:
                                        typeof param.defaultValue === "number"
                                          ? Number(v)
                                          : v,
                                    },
                                  }
                                : n,
                            )
                          }
                        />
                        <button
                          className="button"
                          onClick={() =>
                            editNode((n) => {
                              if (n.kind !== "instance") return n;
                              const overrides = { ...n.overrides };
                              delete overrides[param.id];
                              return { ...n, overrides };
                            })
                          }
                        >
                          Reset {param.name}
                        </button>
                      </div>
                    ))}
                  <button
                    className="button"
                    onClick={() =>
                      commit((p) =>
                        detachMotionInstance(
                          p,
                          definition?.id ?? sceneId,
                          node.id,
                          !!definition,
                        ),
                      )
                    }
                  >
                    Detach instance
                  </button>
                </>
              )}
              <h2>Hierarchy</h2>
              <label className="motion-field">
                Move into container
                <select
                  aria-label="Move into container"
                  value=""
                  disabled={definition?.root.id === node.id}
                  onChange={(e) => {
                    if (e.target.value)
                      onReparent(
                        e.target.value === "root" ? null : e.target.value,
                      );
                  }}
                >
                  <option value="">Choose destination</option>
                  {!definition && <option value="root">Scene root</option>}
                  {flattenNodes(roots)
                    .filter(
                      (n) =>
                        n.kind === "element" &&
                        ["container", "group"].includes(n.type) &&
                        !flattenNodes([node]).some(
                          (child) => child.id === n.id,
                        ),
                    )
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                </select>
              </label>
              <h2>Base styles</h2>
              <label className="motion-field">
                Responsive override
                <select
                  aria-label="Style breakpoint"
                  value={breakpoint}
                  onChange={(e) =>
                    setBreakpoint(e.target.value as typeof breakpoint)
                  }
                >
                  <option value="base">Base</option>
                  <option value="tablet">Tablet ≤ 1024px</option>
                  <option value="mobile">Mobile ≤ 640px</option>
                </select>
              </label>
              <label className="motion-field">
                Property
                <select
                  aria-label="Style property"
                  value={styleKey}
                  onChange={(e) =>
                    setStyleKey(e.target.value as typeof styleKey)
                  }
                >
                  {styleKeys.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <Field
                label="Style value"
                value={
                  (breakpoint === "base"
                    ? node.styles
                    : node.responsive[breakpoint])[styleKey] ?? ""
                }
                onCommit={styleChange}
              />
              <p className="motion-muted">
                Use CSS units for dimensions, such as 24px or 100%. Clear a
                value to inherit.
              </p>
              <dl className="motion-style-list">
                {Object.entries(
                  breakpoint === "base"
                    ? node.styles
                    : node.responsive[breakpoint],
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <button
                className="button"
                onClick={() => {
                  const group = makeElement("group");
                  group.name = "Group";
                  group.children = [node];
                  editRoots((nodes) => updateNode(nodes, node.id, () => group));
                  onSelect(group.id);
                }}
              >
                Group element
              </button>
              <button
                className="button"
                disabled={!!definition && definition.root.id === node.id}
                onClick={() => {
                  editRoots((nodes) => removeNode(nodes, node.id));
                  onSelect(null);
                }}
              >
                Delete element
              </button>
              {definition && node.kind === "element" && (
                <>
                  <h2>Expose parameter</h2>
                  <label className="motion-field">
                    Property
                    <select
                      aria-label="Exposed property"
                      value={parameterProperty}
                      onChange={(e) =>
                        setParameterProperty(
                          e.target.value as Parameter["property"],
                        )
                      }
                    >
                      {[
                        "content",
                        "source",
                        "color",
                        "backgroundColor",
                        "fontSize",
                        "width",
                        "height",
                      ].map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </label>
                  <label className="motion-field">
                    Public prop name
                    <input
                      aria-label="Public prop name"
                      value={parameterName}
                      onChange={(e) => setParameterName(e.target.value)}
                    />
                  </label>
                  <button
                    className="button"
                    onClick={() =>
                      commit((p) => ({
                        ...p,
                        components: p.components.map((d) =>
                          d.id === definition.id
                            ? exposeParameter(
                                d,
                                node.id,
                                parameterProperty,
                                parameterName,
                              )
                            : d,
                        ),
                      }))
                    }
                  >
                    Expose property
                  </button>
                </>
              )}
            </>
          )}
          {definition && (
            <>
              <h2>Definition parameters</h2>
              {definition.parameters.map((param) => (
                <div className="motion-parameter" key={param.id}>
                  <span>
                    {param.name} → {param.property}
                  </span>
                  <button
                    className="button"
                    onClick={() => onRemoveParameter(param.id)}
                  >
                    Remove parameter
                  </button>
                  <Field
                    label={`${param.name} default`}
                    value={param.defaultValue}
                    onCommit={(v) =>
                      commit((p) => ({
                        ...p,
                        components: p.components.map((d) =>
                          d.id === definition.id
                            ? {
                                ...d,
                                version: d.version + 1,
                                parameters: d.parameters.map((item) =>
                                  item.id === param.id
                                    ? {
                                        ...item,
                                        defaultValue:
                                          typeof item.defaultValue === "number"
                                            ? Number(v)
                                            : v,
                                      }
                                    : item,
                                ),
                              }
                            : d,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </aside>
  );
}
