import { useSyncExternalStore } from "react";
import type { Layer } from "../compositions/schema";
import type { AnimationDocument, AnimationValue } from "./runtime";
import { emptyAnimation, evaluateTrack, playbackTime } from "./runtime";
import { bindingError } from "./bindings";
export class AnimationPlayback {
  document = emptyAnimation();
  time = 0;
  playing = false;
  speed = 1;
  private frame = 0;
  private elapsed = 0;
  private origin = 0;
  private phase = 0;
  private listeners = new Set<() => void>();
  private layerListeners = new Map<string, Set<() => void>>();
  private values = new Map<string, Record<string, AnimationValue>>();
  private tracks = new Map<string, AnimationDocument["tracks"]>();
  private staged = new Map<string, Record<string, AnimationValue>>();
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  snapshot = () => this.time;
  subscribeLayer = (id: string, fn: () => void) => {
    const set = this.layerListeners.get(id) ?? new Set();
    set.add(fn);
    this.layerListeners.set(id, set);
    return () => {
      set.delete(fn);
    };
  };
  layerSnapshot = (id: string) => this.values.get(id) ?? EMPTY;
  configure(doc: AnimationDocument, layers: Layer[]) {
    this.document = doc;
    this.tracks.clear();
    for (const track of doc.tracks)
      if (
        !bindingError(
          track,
          layers.find((l) => l.id === track.layerId),
        )
      ) {
        const list = this.tracks.get(track.layerId) ?? [];
        list.push(track);
        this.tracks.set(track.layerId, list);
      }
    this.time = Math.min(this.time, doc.duration);
    this.publish();
  }
  stage(id: string, path: string, value: AnimationValue) {
    this.pause();
    this.staged.set(id, { ...this.staged.get(id), [path]: value });
    this.publish();
  }
  clearStage() {
    this.staged.clear();
    this.publish();
  }
  hasStage(id: string, path: string) {
    return path in (this.staged.get(id) ?? {});
  }
  seek(time: number) {
    if (!Number.isFinite(time)) throw new Error("Seek time must be finite");
    this.pause();
    this.staged.clear();
    this.time = Math.max(0, Math.min(this.document.duration, time));
    this.phase = this.time;
    this.publish();
  }
  setSpeed(speed: number) {
    if (!Number.isFinite(speed) || speed === 0)
      throw new Error(
        "Playback speed must be finite and nonzero; use pause to stop",
      );
    const wasPlaying = this.playing;
    this.pause();
    this.speed = speed;
    if (wasPlaying) this.play();
  }
  play() {
    if (this.playing) return;
    this.staged.clear();
    if (
      this.document.loopMode === "none" &&
      ((this.speed > 0 && this.time >= this.document.range.end) ||
        (this.speed < 0 && this.time <= this.document.range.start))
    )
      this.time =
        this.speed > 0 ? this.document.range.start : this.document.range.end;
    this.time = Math.max(
      this.document.range.start,
      Math.min(this.document.range.end, this.time),
    );
    this.origin =
      this.document.loopMode === "ping-pong" &&
      Math.abs(playbackTime(this.document, this.phase).time - this.time) < 1e-7
        ? this.phase
        : this.time;
    this.elapsed = performance.now();
    this.playing = true;
    this.publish();
    const tick = (now: number) => {
      if (!this.playing) return;
      this.phase = this.origin + ((now - this.elapsed) / 1000) * this.speed;
      const next = playbackTime(this.document, this.phase);
      this.time = next.time;
      if (
        this.document.loopMode === "none" &&
        (this.speed > 0
          ? this.phase >= this.document.range.end
          : this.phase <= this.document.range.start)
      )
        this.playing = false;
      this.publish();
      if (this.playing) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  pause() {
    cancelAnimationFrame(this.frame);
    this.playing = false;
    this.publish();
  }
  stop() {
    this.seek(this.document.range.start);
  }
  dispose() {
    this.pause();
    this.listeners.clear();
    this.layerListeners.clear();
  }
  private publish() {
    for (const id of new Set([
      ...this.values.keys(),
      ...this.tracks.keys(),
      ...this.staged.keys(),
    ])) {
      const values: Record<string, AnimationValue> = {};
      for (const track of this.tracks.get(id) ?? []) {
        const value = evaluateTrack(track, this.time);
        if (value !== undefined) values[track.propertyPath] = value;
      }
      Object.assign(values, this.staged.get(id));
      if (
        JSON.stringify(values) !== JSON.stringify(this.values.get(id) ?? EMPTY)
      ) {
        this.values.set(id, values);
        for (const fn of this.layerListeners.get(id) ?? []) fn();
      }
    }
    for (const fn of this.listeners) fn();
  }
}
const EMPTY: Record<string, AnimationValue> = {};
export function usePlayhead(playback: AnimationPlayback) {
  return useSyncExternalStore(
    playback.subscribe,
    playback.snapshot,
    playback.snapshot,
  );
}
export function useLayerValues(playback: AnimationPlayback, id: string) {
  return useSyncExternalStore(
    (fn) => playback.subscribeLayer(id, fn),
    () => playback.layerSnapshot(id),
    () => EMPTY,
  );
}
