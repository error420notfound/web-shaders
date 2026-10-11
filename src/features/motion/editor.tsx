import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type {
  MotionAnimation,
  MotionNode,
  MotionProject,
  Sequence,
} from "./schema";
import type { MotionRuntime } from "./runtime";
import {
  makeSequence,
  targetOwner,
  addKeyframe,
  resolvedSequences,
  matchesOwner,
} from "./animations";

interface Editor {
  sequences: Sequence[];
  displaySequences: Sequence[];
  roots: MotionNode[];
  project: MotionProject;
  selected: string | null;
  animationId: string | null;
  keyId: string | null;
  tab: "element" | "animation";
  setTab: (tab: "element" | "animation") => void;
  choose: (id: string, key?: string) => void;
  change: (fn: (s: Sequence[]) => Sequence[], preview?: boolean) => void;
  finish: () => void;
  cancel: () => void;
  add: () => void;
  addKey: () => void;
  time: number;
  playing: boolean;
  test: boolean;
  setTest: (v: boolean) => void;
  seek: (v: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  runtime: React.RefObject<MotionRuntime | null>;
  tick: (t: number, p: boolean) => void;
  error: string;
  report: (e: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
const Context = createContext<Editor | null>(null);
export function useMotionEditor() {
  const e = useContext(Context);
  if (!e) throw new Error("Motion editor unavailable");
  return e;
}
export function MotionEditorProvider({
  project,
  roots,
  sequences,
  selected,
  onSelect,
  onInspector,
  onDefinition,
  initialAnimationId,
  commitSequences,
  undo,
  redo,
  canUndo,
  canRedo,
  children,
}: {
  project: MotionProject;
  roots: MotionNode[];
  sequences: Sequence[];
  selected: string | null;
  onSelect: (id: string) => void;
  onInspector: () => void;
  onDefinition: (id: string, nodeId: string, animationId: string) => void;
  initialAnimationId?: string | null;
  commitSequences: (s: Sequence[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  children: ReactNode;
}) {
  const [animationId, setAnimation] = useState<string | null>(
      initialAnimationId ?? null,
    ),
    [keyId, setKey] = useState<string | null>(null),
    [tab, setTab] = useState<"element" | "animation">(
      initialAnimationId ? "animation" : "element",
    );
  const [preview, setPreview] = useState<Sequence[] | null>(null),
    [time, setTime] = useState(0),
    [playing, setPlaying] = useState(false),
    [test, setTestState] = useState(false),
    [error, report] = useState(""),
    [open, setOpen] = useState(
      resolvedSequences(roots, sequences, project).length > 0,
    );
  const runtime = useRef<MotionRuntime | null>(null),
    pending = useRef<Sequence[] | null>(null);
  const source = preview ?? sequences;
  const displaySequences = resolvedSequences(roots, source, project);
  const animationSeen = useRef(displaySequences.length > 0);
  useEffect(() => {
    if (displaySequences.length && !animationSeen.current) {
      setOpen(true);
      animationSeen.current = true;
    }
  }, [displaySequences.length]);
  useEffect(() => {
    pending.current = null;
    setPreview(null);
  }, [sequences]);
  const tick = useCallback((t: number, p: boolean) => {
    setTime(t);
    setPlaying(p);
  }, []);
  function change(fn: (s: Sequence[]) => Sequence[], temporary = false) {
    try {
      const next = fn(source);
      if (temporary) {
        pending.current = next;
        setPreview(next);
      } else {
        commitSequences(next);
        pending.current = null;
        setPreview(null);
      }
      report("");
    } catch (e) {
      report((e as Error).message);
    }
  }
  function cancel() {
    pending.current = null;
    setPreview(null);
  }
  function finish() {
    if (pending.current) {
      commitSequences(pending.current);
      cancel();
    }
  }
  function choose(id: string, key?: string) {
    const a = source.flatMap((s) => s.animations).find((a) => a.id === id);
    if (a) {
      setAnimation(id);
      setKey(key ?? null);
      onSelect(targetOwner(a.target));
      setTab("animation");
      onInspector();
    } else {
      const inherited = displaySequences
        .flatMap((s) => s.animations)
        .find((a) => a.id === id);
      if (inherited?.target.kind === "instance") {
        const instance = findInstancePath(
          roots,
          inherited.target.instanceId,
          project,
        );
        const d =
          instance?.kind === "instance"
            ? project.components.find((d) => d.id === instance.definitionId)
            : null;
        const local = d?.sequences
          .flatMap((s) => s.animations)
          .find((a) => id.endsWith(`/${a.id}`));
        if (d && local) {
          onDefinition(
            d.id,
            local.target.kind === "element"
              ? local.target.elementId
              : local.target.instanceId,
            local.id,
          );
          onInspector();
        }
      }
    }
  }
  function add() {
    if (!selected) return;
    const found = findNode(roots, selected);
    const definition =
      found?.kind === "instance"
        ? project.components.find((d) => d.id === found.definitionId)
        : null;
    if (definition?.root.kind === "instance") {
      report("Open the component definition to select its element");
      return;
    }
    const s = makeSequence(
      definition
        ? {
            kind: "instance",
            instanceId: selected,
            elementId: definition.root.id,
          }
        : { kind: "element", elementId: selected },
    );
    change((old) => [...old, s]);
    setAnimation(s.animations[0].id);
    setKey(null);
    setTab("animation");
    setOpen(true);
  }
  function addKey() {
    const found = selectedAnimation({
      sequences: source,
      selected,
      animationId,
    });
    const a = found?.animation;
    if (!a || !found) return;
    const local =
      time -
      a.at -
      a.delay -
      (found.sequence.trigger.type === "load"
        ? found.sequence.trigger.delay
        : 0);
    try {
      const next = addKeyframe(
        a,
        local,
        runtime.current?.sample(a),
        runtime.current?.endpoints(a),
      );
      change((old) =>
        old.map((s) => ({
          ...s,
          animations: s.animations.map((x) => (x.id === a.id ? next : x)),
        })),
      );
      setAnimation(a.id);
      setKey(
        next.keyframes.find((k) => Math.abs(k.time - local) < 1e-6)?.id ?? null,
      );
    } catch (e) {
      report((e as Error).message);
    }
  }
  function seek(t: number) {
    if (!Number.isFinite(t)) return;
    const found = selectedAnimation({
      sequences: source,
      selected,
      animationId,
    });
    runtime.current?.seek(
      t,
      found?.sequence.trigger.type === "scroll" ? found.sequence.id : undefined,
    );
    setTime(t);
    setPlaying(false);
  }
  function pause() {
    runtime.current?.timeline.pause();
    setPlaying(false);
  }
  function play() {
    if (test) {
      setTestState(false);
      report("Switch to Edit mode to use timeline playback");
      return;
    }
    const tl = runtime.current?.timeline;
    if (tl) {
      if (tl.time() >= runtime.current!.duration) tl.time(0);
      tl.play();
      setPlaying(true);
    }
  }
  function stop() {
    pause();
    seek(0);
  }
  function restart() {
    seek(0);
    play();
  }
  function setTest(v: boolean) {
    pause();
    setTestState(v);
  }
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) {
        runtime.current?.timeline.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      runtime.current?.timeline.pause();
      setPlaying(false);
    };
  }, []);
  return (
    <Context.Provider
      value={{
        project,
        roots,
        sequences: source,
        displaySequences,
        selected,
        animationId,
        keyId,
        tab,
        setTab,
        choose,
        change,
        finish,
        cancel,
        add,
        addKey,
        time,
        playing,
        test,
        setTest,
        seek,
        play,
        pause,
        stop,
        restart,
        runtime,
        tick,
        error,
        report,
        open,
        setOpen,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </Context.Provider>
  );
}
function findNode(nodes: MotionNode[], id: string): MotionNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.kind === "element") {
      const child = findNode(n.children, id);
      if (child) return child;
    }
  }
}
function findInstancePath(
  nodes: MotionNode[],
  path: string,
  project: MotionProject,
): MotionNode | undefined {
  for (const n of nodes) {
    if (n.kind === "element") {
      const child = findInstancePath(n.children, path, project);
      if (child) return child;
    } else if (path === n.id) return n;
    else if (path.startsWith(`${n.id}/`)) {
      const d = project.components.find((d) => d.id === n.definitionId);
      if (d)
        return findInstancePath([d.root], path.slice(n.id.length + 1), project);
    }
  }
}
export function selectedAnimation(
  e: Pick<Editor, "sequences" | "selected" | "animationId">,
): { animation: MotionAnimation; sequence: Sequence } | undefined {
  const all = e.sequences
    .flatMap((s) => s.animations.map((a) => ({ animation: a, sequence: s })))
    .filter((x) => matchesOwner(x.animation.target, e.selected));
  return all.find((x) => x.animation.id === e.animationId) ?? all[0];
}
