import { flattenNodes, parseMotionProject } from "./schema";
import type {
  Definition,
  ElementNode,
  InstanceNode,
  MotionNode,
  MotionProject,
  Parameter,
  Scene,
  Styles,
  Sequence,
  Target,
} from "./schema";
import { cleanSequences, resolvedSequences } from "./animations";
export const uid = () => crypto.randomUUID();
export function makeElement(type: ElementNode["type"]): ElementNode {
  const content = {
    heading: "Make something move.",
    paragraph: "Build a reusable section, then bring it to life.",
    text: "Your text",
    button: "Explore",
    container: "",
    group: "",
    image: "",
    shape: "",
    svg: "",
  }[type];
  return {
    kind: "element",
    id: uid(),
    name: type[0].toUpperCase() + type.slice(1),
    type,
    content,
    source: "",
    alt: "",
    svgPath: type === "svg" ? "M10 50 L50 10 L90 50 L50 90 Z" : "",
    styles:
      type === "heading"
        ? { fontSize: "56px", fontWeight: 700, lineHeight: 1.1 }
        : type === "button"
          ? {
              padding: "14px 24px",
              backgroundColor: "#5b62e5",
              color: "#ffffff",
              borderRadius: "8px",
            }
          : type === "shape"
            ? {
                width: "100px",
                height: "100px",
                backgroundColor: "#5b62e5",
                borderRadius: "16px",
              }
            : type === "container" || type === "group"
              ? {
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "24px",
                }
              : {},
    responsive: {
      tablet: {},
      mobile: type === "heading" ? { fontSize: "36px" } : {},
    },
    children: [],
  };
}
export function makeScene(name = "Untitled scene"): Scene {
  const root = makeElement("container");
  root.name = "Section";
  root.styles = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "64px",
    minHeight: "480px",
    backgroundColor: "#f7f6f3",
    color: "#30313b",
  };
  root.responsive.mobile = { padding: "24px" };
  return { id: uid(), name, roots: [root], sequences: [] };
}
export function createMotionProject(): MotionProject {
  const now = new Date().toISOString(),
    scene = makeScene("Hero scene");
  if (scene.roots[0].kind === "element")
    scene.roots[0].children = [
      makeElement("heading"),
      makeElement("paragraph"),
      makeElement("button"),
    ];
  return {
    kind: "motion",
    schemaVersion: 1,
    id: uid(),
    name: "Untitled motion project",
    createdAt: now,
    updatedAt: now,
    scenes: [scene],
    components: [],
    assets: [],
    export: { target: "astro" },
  };
}
export function updateNode(
  nodes: MotionNode[],
  id: string,
  fn: (n: MotionNode) => MotionNode,
): MotionNode[] {
  return nodes.map((n) =>
    n.id === id
      ? fn(n)
      : n.kind === "element"
        ? { ...n, children: updateNode(n.children, id, fn) }
        : n,
  );
}
export function removeNode(nodes: MotionNode[], id: string): MotionNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.kind === "element" ? { ...n, children: removeNode(n.children, id) } : n,
    );
}
export function resolveInstance(
  node: MotionNode,
  project: MotionProject,
): ElementNode {
  if (node.kind === "element") return node;
  const definition = project.components.find((d) => d.id === node.definitionId);
  if (!definition) throw new Error("Component definition is missing");
  let root = structuredClone(definition.root);
  for (const parameter of definition.parameters) {
    const value = node.overrides[parameter.id] ?? parameter.defaultValue;
    root = updateNode([root], parameter.targetId, (n) => {
      if (n.kind !== "element") return n;
      return parameter.property === "content" || parameter.property === "source"
        ? { ...n, [parameter.property]: value }
        : { ...n, styles: { ...n.styles, [parameter.property]: value } };
    })[0];
  }
  const resolved = resolveInstance(root, project);
  return {
    ...resolved,
    styles: { ...resolved.styles, ...node.styles },
    responsive: {
      tablet: { ...resolved.responsive.tablet, ...node.responsive.tablet },
      mobile: { ...resolved.responsive.mobile, ...node.responsive.mobile },
    },
  };
}
export function effectiveStyles(node: MotionNode, width: number): Styles {
  return {
    ...node.styles,
    ...(width <= 1024 ? node.responsive.tablet : {}),
    ...(width <= 640 ? node.responsive.mobile : {}),
  };
}
export function renderedInstancePath(
  node: MotionNode,
  project: MotionProject,
  parent = "",
): string {
  let path = parent,
    current = node;
  while (current.kind === "instance") {
    path = path ? `${path}/${current.id}` : current.id;
    const definitionId = current.definitionId;
    current = project.components.find((d) => d.id === definitionId)!.root;
  }
  return path;
}
export function insertInstance(d: Definition): InstanceNode {
  return {
    kind: "instance",
    id: uid(),
    name: d.name,
    definitionId: d.id,
    overrides: {},
    styles: {},
    responsive: { tablet: {}, mobile: {} },
  };
}
export function componentFromSelection(
  project: MotionProject,
  sceneId: string,
  selected: string,
): MotionProject {
  const scene = project.scenes.find((s) => s.id === sceneId)!;
  const node = flattenNodes(scene.roots).find((n) => n.id === selected);
  if (!node || node.kind !== "element")
    throw new Error("Select an element or group to create a component");
  const descendants = new Set(flattenNodes([node]).map((n) => n.id));
  const inside = (t: Target) =>
    descendants.has(t.kind === "element" ? t.elementId : t.instanceId);
  const internal = scene.sequences.filter(
    (s) =>
      s.animations.every((a) => inside(a.target)) &&
      (!("target" in s.trigger) || inside(s.trigger.target)) &&
      (s.trigger.type !== "scroll" ||
        !s.trigger.scrollContainer ||
        inside(s.trigger.scrollContainer)),
  );
  const d: Definition = {
    id: uid(),
    name: node.name,
    description: "",
    version: 1,
    root: structuredClone(node),
    parameters: [],
    sequences: structuredClone(internal),
  };
  const instance = insertInstance(d);
  const map = (t: Target): Target =>
    !inside(t)
      ? t
      : t.kind === "element"
        ? { kind: "instance", instanceId: instance.id, elementId: t.elementId }
        : { ...t, instanceId: `${instance.id}/${t.instanceId}` };
  return parseMotionProject({
    ...project,
    components: [...project.components, d],
    scenes: project.scenes.map((s) =>
      s.id === sceneId
        ? {
            ...s,
            roots: updateNode(s.roots, node.id, () => instance),
            sequences: s.sequences
              .filter((s) => !internal.includes(s))
              .map((s) => mapSequence(s, map)),
          }
        : s,
    ),
  });
}
export function exposeParameter(
  d: Definition,
  targetId: string,
  property: Parameter["property"],
  name: string,
): Definition {
  const n = flattenNodes([d.root]).find((n) => n.id === targetId);
  if (!n || n.kind !== "element")
    throw new Error("Select a definition element");
  if (
    d.parameters.some((p) => p.targetId === targetId && p.property === property)
  )
    throw new Error("This property is already exposed");
  const defaultValue =
    property === "content" || property === "source"
      ? n[property]
      : (n.styles[property] ?? "");
  return {
    ...d,
    version: d.version + 1,
    parameters: [
      ...d.parameters,
      { id: uid(), name, targetId, property, defaultValue },
    ],
  };
}
export function detachInstance(
  node: MotionNode,
  project: MotionProject,
): ElementNode {
  const resolved = resolveInstance(node, project);
  function clone(n: MotionNode): ElementNode {
    const r = resolveInstance(n, project);
    return {
      ...structuredClone(r),
      id: uid(),
      children: r.children.map(clone),
    };
  }
  return { ...clone(resolved), name: node.name };
}
export function deleteDefinition(
  project: MotionProject,
  definitionId: string,
  action: "detach" | "delete",
): MotionProject {
  if (action === "detach") {
    let next = project;
    for (const s of project.scenes)
      for (const n of flattenNodes(s.roots))
        if (n.kind === "instance" && n.definitionId === definitionId)
          next = detachMotionInstance(next, s.id, n.id, false);
    for (const d of project.components)
      if (d.id !== definitionId)
        for (const n of flattenNodes([d.root]))
          if (n.kind === "instance" && n.definitionId === definitionId)
            next = detachMotionInstance(next, d.id, n.id, true);
    return parseMotionProject({
      ...next,
      components: next.components.filter((d) => d.id !== definitionId),
    });
  }
  function clean(nodes: MotionNode[]): MotionNode[] {
    return nodes.flatMap((n) =>
      n.kind === "instance" && n.definitionId === definitionId
        ? action === "detach"
          ? [detachInstance(n, project)]
          : []
        : [n.kind === "element" ? { ...n, children: clean(n.children) } : n],
    );
  }
  const next = {
    ...project,
    scenes: project.scenes.map((s) => ({ ...s, roots: clean(s.roots) })),
    components: project.components
      .filter((d) => d.id !== definitionId)
      .map((d) => ({
        ...d,
        root: clean([d.root])[0] ?? makeElement("container"),
      })),
  };
  return parseMotionProject({
    ...next,
    scenes: next.scenes.map((s) => ({
      ...s,
      sequences: cleanSequences(s.sequences, s.roots, next),
    })),
    components: next.components.map((d) => ({
      ...d,
      sequences: cleanSequences(d.sequences, [d.root], next),
    })),
  });
}

function mapSequence(s: Sequence, map: (t: Target) => Target): Sequence {
  return {
    ...s,
    animations: s.animations.map((a) => ({ ...a, target: map(a.target) })),
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
  };
}
export function detachMotionInstance(
  project: MotionProject,
  ownerId: string,
  nodeId: string,
  component = false,
): MotionProject {
  const owner = component
    ? project.components.find((d) => d.id === ownerId)
    : project.scenes.find((s) => s.id === ownerId);
  if (!owner) throw new Error("Scene or definition missing");
  const roots = "roots" in owner ? owner.roots : [owner.root];
  const node = flattenNodes(roots).find((n) => n.id === nodeId);
  if (!node || node.kind !== "instance") return project;
  const ids = new Map<string, string>();
  function clone(n: MotionNode, path: string, root = false): ElementNode {
    const nextPath = renderedInstancePath(n, project, path);
    const r = resolveInstance(n, project),
      id = root ? nodeId : uid();
    ids.set(`${nextPath}|${r.id}`, id);
    return {
      ...structuredClone(r),
      id,
      children: r.children.map((c) => clone(c, nextPath)),
    };
  }
  const detached = clone(node, "", true);
  const map = (t: Target): Target =>
    t.kind === "instance" && ids.has(`${t.instanceId}|${t.elementId}`)
      ? {
          kind: "element",
          elementId: ids.get(`${t.instanceId}|${t.elementId}`)!,
        }
      : t;
  const inherited = resolvedSequences([node], [], project).map((s) =>
    mapSequence(
      {
        ...s,
        id: uid(),
        animations: s.animations.map((a) => ({ ...a, id: uid() })),
      },
      map,
    ),
  );
  const sequences = [
    ...owner.sequences.map((s) => mapSequence(s, map)),
    ...inherited,
  ];
  return parseMotionProject({
    ...project,
    scenes: project.scenes.map((s) =>
      !component && s.id === ownerId
        ? {
            ...s,
            roots: updateNode(s.roots, nodeId, () => detached),
            sequences,
          }
        : s,
    ),
    components: project.components.map((d) =>
      component && d.id === ownerId
        ? {
            ...d,
            root: updateNode([d.root], nodeId, () => detached)[0],
            sequences,
          }
        : d,
    ),
  });
}

export function removeParameter(
  project: MotionProject,
  definitionId: string,
  parameterId: string,
): MotionProject {
  function clean(nodes: MotionNode[]): MotionNode[] {
    return nodes.map((n) => {
      if (n.kind === "element") return { ...n, children: clean(n.children) };
      if (n.definitionId !== definitionId) return n;
      const overrides = { ...n.overrides };
      delete overrides[parameterId];
      return { ...n, overrides };
    });
  }
  return parseMotionProject({
    ...project,
    scenes: project.scenes.map((s) => ({ ...s, roots: clean(s.roots) })),
    components: project.components.map((d) => ({
      ...d,
      root: clean([d.root])[0],
      ...(d.id === definitionId
        ? {
            version: d.version + 1,
            parameters: d.parameters.filter((p) => p.id !== parameterId),
          }
        : {}),
    })),
  });
}
export function replaceDefinition(
  project: MotionProject,
  oldId: string,
  newId: string,
): MotionProject {
  if (oldId === newId || !project.components.some((d) => d.id === newId))
    throw new Error("Choose another component definition");
  const old = project.components.find((d) => d.id === oldId),
    replacement = project.components.find((d) => d.id === newId)!;
  if (!old) throw new Error("Component definition missing");
  const correspond = new Map<string, string>();
  function pair(a: MotionNode, b?: MotionNode) {
    if (!b || a.kind !== b.kind) return;
    if (a.kind === "element" && b.kind === "element" && a.type === b.type) {
      correspond.set(a.id, b.id);
      a.children.forEach((n, i) => pair(n, b.children[i]));
    }
  }
  pair(old.root, replacement.root);
  function sequences(roots: MotionNode[], items: Sequence[]) {
    const instances = new Set(
      flattenNodes(roots)
        .filter((n) => n.kind === "instance" && n.definitionId === oldId)
        .map((n) => n.id),
    );
    return items.map((s) =>
      mapSequence(s, (t) => {
        if (t.kind !== "instance" || !instances.has(t.instanceId)) return t;
        const id = correspond.get(t.elementId);
        if (!id)
          throw new Error(
            "Replacement has no matching animated element. Detach the old component first to preserve its animation.",
          );
        return { ...t, elementId: id };
      }),
    );
  }
  function replace(nodes: MotionNode[]): MotionNode[] {
    return nodes.map((n) =>
      n.kind === "instance" && n.definitionId === oldId
        ? { ...n, definitionId: newId, overrides: {} }
        : n.kind === "element"
          ? { ...n, children: replace(n.children) }
          : n,
    );
  }
  return parseMotionProject({
    ...project,
    scenes: project.scenes.map((s) => ({
      ...s,
      roots: replace(s.roots),
      sequences: sequences(s.roots, s.sequences),
    })),
    components: project.components
      .filter((d) => d.id !== oldId)
      .map((d) => ({
        ...d,
        root: replace([d.root])[0],
        sequences: sequences([d.root], d.sequences),
      })),
  });
}

export function reparentNode(
  nodes: MotionNode[],
  id: string,
  parentId: string | null,
): MotionNode[] {
  const node = flattenNodes(nodes).find((n) => n.id === id);
  if (!node) throw new Error("Element is missing");
  if (parentId && flattenNodes([node]).some((n) => n.id === parentId))
    throw new Error("Cannot move an element into itself or its descendants");
  if (parentId) {
    const parent = flattenNodes(nodes).find((n) => n.id === parentId);
    if (
      !parent ||
      parent.kind !== "element" ||
      !["container", "group"].includes(parent.type)
    )
      throw new Error("Choose a container or group");
  }
  const cleaned = removeNode(nodes, id);
  return parentId
    ? updateNode(cleaned, parentId, (n) =>
        n.kind === "element" ? { ...n, children: [...n.children, node] } : n,
      )
    : [...cleaned, node];
}
