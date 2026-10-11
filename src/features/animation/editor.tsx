import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Project } from "../compositions/schema";
import { flatten, parseProject } from "../compositions/schema";
import type { AnimationDocument, AnimationValue } from "./runtime";
import { TIME_EPSILON } from "./runtime";
import { AnimationPlayback } from "./playback";
import { bindings } from "./bindings";
import { putKey, deleteKeys } from "./commands";
interface Editor {
  project: Project;
  document: AnimationDocument;
  playback: AnimationPlayback;
  selected: string | null;
  onSelect: (id: string) => void;
  selectedKeys: Set<string>;
  selectKeys: (ids: Set<string>) => void;
  activePath: string | null;
  setActivePath: (path: string) => void;
  autoKey: boolean;
  setAutoKey: (value: boolean) => void;
  change: (doc: AnimationDocument, preview?: boolean) => void;
  finish: () => void;
  cancel: () => void;
  insert: (layerId: string, path: string, value?: AnimationValue) => void;
  editValue: (
    layerId: string,
    path: string,
    value: AnimationValue,
    preview?: boolean,
  ) => boolean;
  removeSelected: () => void;
  error: string;
  report: (error: string) => void;
}
const Context = createContext<Editor | null>(null);
export function useAnimationEditor() {
  const value = useContext(Context);
  if (!value) throw new Error("Animation editor is unavailable");
  return value;
}
export function AnimationEditorProvider({
  project,
  playback,
  selected,
  onSelect,
  commit,
  children,
}: {
  project: Project;
  playback: AnimationPlayback;
  selected: string | null;
  onSelect: (id: string) => void;
  commit: (fn: (p: Project) => Project, group?: string) => void;
  children: ReactNode;
}) {
  const [preview, setPreview] = useState<AnimationDocument | null>(null);
  const pending = useRef<AnimationDocument | null>(null);
  const [selectedKeys, selectKeys] = useState(new Set<string>());
  const [activePath, setActivePath] = useState<string | null>(null);
  const [autoKey, setAutoKey] = useState(false);
  const [error, report] = useState("");
  const document = preview ?? project.animation;
  useLayoutEffect(() => {
    playback.configure(document, flatten(project.layers));
  }, [playback, document, project.layers]);
  useEffect(() => {
    pending.current = null;
    setPreview(null);
  }, [project]);
  useEffect(() => {
    selectKeys(new Set());
    setActivePath(null);
    setAutoKey(false);
    playback.clearStage();
  }, [project.id, playback]);
  useEffect(() => {
    const hidden = () => {
      if (window.document.hidden) playback.pause();
    };
    window.document.addEventListener("visibilitychange", hidden);
    return () =>
      window.document.removeEventListener("visibilitychange", hidden);
  }, [playback]);
  function change(doc: AnimationDocument, temporary = false) {
    try {
      doc = parseProject({ ...project, animation: doc }).animation;
      report("");
      if (temporary) {
        pending.current = doc;
        setPreview(doc);
      } else {
        pending.current = null;
        setPreview(null);
        commit((p) => ({ ...p, animation: doc }));
      }
    } catch (e) {
      report((e as Error).message);
    }
  }
  function finish() {
    const doc = pending.current;
    if (doc) change(doc);
  }
  function cancel() {
    pending.current = null;
    setPreview(null);
    playback.clearStage();
  }
  function insert(layerId: string, path: string, value?: AnimationValue) {
    const layer = flatten(project.layers).find((l) => l.id === layerId);
    const binding = layer && bindings(layer).find((b) => b.path === path);
    if (!binding) return;
    playback.pause();
    setActivePath(path);
    const track = document.tracks.find(
      (t) => t.layerId === layerId && t.propertyPath === path,
    );
    const existing = track?.keyframes.find(
      (k) => Math.abs(k.time - playback.time) < TIME_EPSILON,
    );
    if (existing && value === undefined && !playback.hasStage(layerId, path)) {
      selectKeys(new Set([existing.id]));
      return;
    }
    try {
      const next = putKey(
        document,
        layerId,
        binding,
        playback.time,
        value ?? playback.layerSnapshot(layerId)[path] ?? binding.value,
      );
      change(next);
      playback.clearStage();
      const key = next.tracks
        .find((t) => t.layerId === layerId && t.propertyPath === path)!
        .keyframes.find(
          (k) => Math.abs(k.time - playback.time) < TIME_EPSILON,
        )!;
      selectKeys(new Set([key.id]));
    } catch (e) {
      report((e as Error).message);
    }
  }
  function editValue(
    layerId: string,
    path: string,
    value: AnimationValue,
    temporary = false,
  ) {
    setActivePath(path);
    const track = document.tracks.find(
      (t) => t.layerId === layerId && t.propertyPath === path && t.enabled,
    );
    if (!track && !autoKey) return false;
    playback.pause();
    if (
      track?.keyframes.some(
        (k) => Math.abs(k.time - playback.time) < TIME_EPSILON,
      ) ||
      autoKey
    ) {
      const layer = flatten(project.layers).find((l) => l.id === layerId)!;
      const binding = bindings(layer).find((b) => b.path === path)!;
      try {
        change(
          putKey(document, layerId, binding, playback.time, value),
          temporary,
        );
      } catch (e) {
        report((e as Error).message);
      }
    } else playback.stage(layerId, path, value);
    return true;
  }
  function removeSelected() {
    change(deleteKeys(document, selectedKeys));
    selectKeys(new Set());
  }
  return (
    <Context.Provider
      value={{
        project,
        document,
        playback,
        selected,
        onSelect,
        selectedKeys,
        selectKeys,
        activePath,
        setActivePath,
        autoKey,
        setAutoKey,
        change,
        finish,
        cancel,
        insert,
        editValue,
        removeSelected,
        error,
        report,
      }}
    >
      {children}
    </Context.Provider>
  );
}
