import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { IconButton } from "../controls/Primitives";
import { Field } from "./MotionControls";
import { useMotionEditor } from "../../features/motion/editor";
import {
  moveKeyframe,
  resizeAnimation,
  matchesOwner,
} from "../../features/motion/animations";
import { flattenNodes } from "../../features/motion/schema";
import type { Sequence } from "../../features/motion/schema";
import { timecode } from "../../features/animation/runtime";

export function MotionTimeline() {
  const e = useMotionEditor(),
    [zoom, setZoom] = useState(100),
    [height, setHeight] = useState(270),
    [all, setAll] = useState(false);
  const gesture = useRef<{
    x: number;
    sequences: Sequence[];
    animation: string;
    key?: string;
    kind: "move" | "resize" | "key";
    changed: boolean;
  } | null>(null);
  const animations = e.displaySequences.flatMap((s) =>
      s.animations.map((a) => ({ a, s })),
    ),
    duration = Math.max(
      3,
      ...animations.map(
        ({ a, s }) =>
          a.at +
          a.delay +
          a.duration * (a.repeat < 0 ? 1 : a.repeat + 1) +
          a.repeatDelay * Math.max(0, a.repeat) +
          (s.trigger.type === "load" ? s.trigger.delay : 0),
      ),
    );
  const nodes = flattenNodes(e.roots),
    width = Math.min(100000, duration * zoom),
    step = Math.max(0.25, Math.ceil((60 / zoom) * 4) / 4, duration / 200);
  const selected = animations.find(({ a }) => a.id === e.animationId);
  useEffect(() => {
    const cancel = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && gesture.current) {
        gesture.current = null;
        e.cancel();
      }
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [e]);
  function start(
    ev: PointerEvent<HTMLElement>,
    id: string,
    kind: "move" | "resize" | "key",
    key?: string,
  ) {
    ev.preventDefault();
    ev.stopPropagation();
    e.pause();
    e.choose(id, key);
    if (!e.sequences.some((s) => s.animations.some((a) => a.id === id))) return;
    gesture.current = {
      x: ev.clientX,
      sequences: structuredClone(e.sequences),
      animation: id,
      kind,
      key,
      changed: false,
    };
    ev.currentTarget.setPointerCapture(ev.pointerId);
  }
  function move(ev: PointerEvent<HTMLElement>) {
    const g = gesture.current;
    if (!g || !ev.currentTarget.hasPointerCapture(ev.pointerId)) return;
    const dt = (ev.clientX - g.x) / zoom;
    if (Math.abs(ev.clientX - g.x) < 2 && !g.changed) return;
    g.changed = true;
    try {
      const next = g.sequences.map((s) => ({
        ...s,
        animations: s.animations.map((a) => {
          if (a.id !== g.animation) return a;
          return g.kind === "move"
            ? { ...a, at: Math.max(0, a.at + dt) }
            : g.kind === "resize"
              ? resizeAnimation(a, Math.max(0.01, a.duration + dt))
              : moveKeyframe(
                  a,
                  g.key!,
                  Math.max(
                    0,
                    Math.min(
                      a.duration,
                      a.keyframes.find((k) => k.id === g.key)!.time + dt,
                    ),
                  ),
                );
        }),
      }));
      e.change(() => next, true);
    } catch (err) {
      e.report((err as Error).message);
    }
  }
  function finish(ev: PointerEvent<HTMLElement>) {
    if (!gesture.current) return;
    e.finish();
    gesture.current = null;
    ev.currentTarget.releasePointerCapture(ev.pointerId);
  }
  const handlers = {
    onPointerMove: move,
    onPointerUp: finish,
    onPointerCancel: () => {
      gesture.current = null;
      e.cancel();
    },
  };
  return (
    <section
      className={`timeline-panel motion-timeline ${e.open ? "is-open" : ""}`}
      tabIndex={0}
      onKeyDown={(ev) => {
        if ((ev.target as HTMLElement).closest("input,textarea,select")) return;
        if (ev.key === " ") {
          ev.preventDefault();
          if (e.playing) e.pause();
          else e.play();
        }
        if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
          ev.preventDefault();
          const dt = ev.key === "ArrowRight" ? 1 / 60 : -1 / 60;
          const key = selected?.a.keyframes.find((k) => k.id === e.keyId);
          if (selected && key) {
            try {
              const next = moveKeyframe(selected.a, key.id, key.time + dt);
              e.change((old) =>
                old.map((s) => ({
                  ...s,
                  animations: s.animations.map((a) =>
                    a.id === next.id ? next : a,
                  ),
                })),
              );
            } catch (err) {
              e.report((err as Error).message);
            }
          } else e.seek(Math.max(0, e.time + dt));
        }
        if (ev.key === "Delete" && selected && e.keyId) {
          ev.preventDefault();
          if (selected.a.keyframes.length > 1)
            e.change((old) =>
              old.map((s) => ({
                ...s,
                animations: s.animations.map((a) =>
                  a.id === selected.a.id
                    ? {
                        ...a,
                        keyframes: a.keyframes.filter((k) => k.id !== e.keyId),
                      }
                    : a,
                ),
              })),
            );
        }
      }}
      style={{ "--timeline-height": `${height}px` } as CSSProperties}
      aria-label="Motion animation timeline"
    >
      <header className="timeline-heading">
        <button
          className="timeline-toggle"
          aria-expanded={e.open}
          onClick={() => e.setOpen(!e.open)}
        >
          Animation timeline <small>{animations.length} animations</small>
        </button>
        <IconButton
          label={e.playing ? "Pause motion timeline" : "Play motion timeline"}
          icon={e.playing ? "pause-fill" : "play-fill"}
          disabled={e.test}
          onClick={e.playing ? e.pause : e.play}
        />
        <output aria-label="Motion timeline time">
          {timecode(e.time, 60)} · {e.time.toFixed(2)}s
        </output>
      </header>
      {e.open && (
        <div className="timeline-body show-all-tracks">
          <div
            className="timeline-resize"
            role="separator"
            aria-label="Motion timeline height"
            aria-orientation="horizontal"
            tabIndex={0}
            onKeyDown={(ev) => {
              if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
                ev.preventDefault();
                setHeight((h) =>
                  Math.max(
                    200,
                    Math.min(600, h + (ev.key === "ArrowUp" ? 20 : -20)),
                  ),
                );
              }
            }}
            onPointerDown={(ev) => {
              ev.currentTarget.setPointerCapture(ev.pointerId);
              ev.currentTarget.dataset.y = String(ev.clientY);
              ev.currentTarget.dataset.height = String(height);
            }}
            onPointerMove={(ev) => {
              if (ev.currentTarget.hasPointerCapture(ev.pointerId))
                setHeight(
                  Math.max(
                    200,
                    Math.min(
                      600,
                      Number(ev.currentTarget.dataset.height) +
                        Number(ev.currentTarget.dataset.y) -
                        ev.clientY,
                    ),
                  ),
                );
            }}
          />
          <div className="timeline-toolbar">
            <IconButton
              label="Stop motion timeline"
              disabled={e.test}
              icon="stop-fill"
              onClick={e.stop}
            />
            <IconButton
              label="Restart motion timeline"
              disabled={e.test}
              icon="arrow-counterclockwise"
              onClick={e.restart}
            />
            <button
              className="button"
              onClick={() => setAll(!all)}
              aria-pressed={all}
            >
              {all ? "Selected element tracks" : "Show all tracks"}
            </button>
            <label>
              Zoom
              <input
                aria-label="Motion timeline zoom"
                type="range"
                min={25}
                max={400}
                value={zoom}
                onChange={(ev) => setZoom(Number(ev.target.value))}
              />
            </label>
            <IconButton
              label="Undo timeline edit"
              icon="arrow-counterclockwise"
              disabled={!e.canUndo}
              onClick={e.undo}
            />
            <IconButton
              label="Redo timeline edit"
              icon="arrow-clockwise"
              disabled={!e.canRedo}
              onClick={e.redo}
            />
          </div>
          <input
            className="timeline-seek"
            aria-label="Motion playhead"
            disabled={e.test}
            type="range"
            min={0}
            max={duration}
            step="any"
            value={Math.min(duration, e.time)}
            onChange={(ev) => e.seek(Number(ev.target.value))}
          />
          <div className="timeline-scroll">
            <div className="motion-time-row" style={{ minWidth: width + 160 }}>
              <div className="motion-track-label">Time · seconds</div>
              <div
                className="motion-track-lane"
                style={{ width }}
                onPointerDown={(ev) =>
                  e.seek(
                    Math.max(
                      0,
                      (ev.clientX -
                        ev.currentTarget.getBoundingClientRect().left) /
                        zoom,
                    ),
                  )
                }
              >
                {Array.from(
                  { length: Math.floor(duration / step) + 1 },
                  (_, i) => (
                    <span
                      key={i}
                      className="motion-ruler-tick"
                      style={{ left: i * step * zoom }}
                    >
                      {+(i * step).toFixed(2)}
                    </span>
                  ),
                )}
                <div
                  className="timeline-playhead"
                  style={{ left: e.time * zoom }}
                />
              </div>
            </div>
            {!animations.length && (
              <div className="timeline-empty">
                Select an element and{" "}
                <button
                  className="button"
                  onClick={e.add}
                  disabled={!e.selected}
                >
                  Add Animation
                </button>
                .
              </div>
            )}
            {!!animations.length &&
              !all &&
              !animations.some(({ a }) =>
                matchesOwner(a.target, e.selected),
              ) && (
                <div className="timeline-empty">
                  Select an animated element or choose Show all tracks.
                </div>
              )}
            {animations
              .filter(({ a }) => all || matchesOwner(a.target, e.selected))
              .map(({ a, s }) => {
                const offset =
                    a.at +
                    a.delay +
                    (s.trigger.type === "load" ? s.trigger.delay : 0),
                  props = [
                    ...new Set([
                      ...Object.keys(a.from),
                      ...Object.keys(a.to),
                      ...a.keyframes.flatMap((k) => Object.keys(k.values)),
                    ]),
                  ];
                return (
                  <div key={a.id} className="motion-track-group">
                    <div
                      className="motion-time-row"
                      style={{ minWidth: width + 160 }}
                    >
                      <button
                        className="motion-track-label"
                        onClick={() => e.choose(a.id)}
                      >
                        {nodes.find((n) => matchesOwner(a.target, n.id))
                          ?.name ?? "Element"}{" "}
                        ·{" "}
                        {s.trigger.type === "scroll"
                          ? "Scroll controlled"
                          : a.mode}
                      </button>
                      <div className="motion-track-lane" style={{ width }}>
                        <button
                          className={`motion-tween-bar ${e.animationId === a.id ? "selected" : ""}`}
                          aria-label={`Animation ${a.id} duration bar`}
                          style={{
                            left: offset * zoom,
                            width: Math.max(15, a.duration * zoom),
                          }}
                          onPointerDown={(ev) => start(ev, a.id, "move")}
                          {...handlers}
                        >
                          {a.duration.toFixed(2)}s
                        </button>
                        <button
                          className="motion-tween-resize"
                          aria-label={`Resize animation ${a.id}`}
                          style={{ left: (offset + a.duration) * zoom - 6 }}
                          onPointerDown={(ev) => start(ev, a.id, "resize")}
                          {...handlers}
                        />
                        <div
                          className="timeline-playhead"
                          style={{ left: e.time * zoom }}
                        />
                      </div>
                    </div>
                    {props.map((p) => (
                      <div
                        className="motion-time-row"
                        key={p}
                        style={{ minWidth: width + 160 }}
                      >
                        <button
                          className="motion-track-label motion-property-label"
                          onClick={() => e.choose(a.id)}
                        >
                          {p}
                        </button>
                        <div className="motion-track-lane" style={{ width }}>
                          <div
                            className="motion-track-span"
                            style={{
                              left: offset * zoom,
                              width: a.duration * zoom,
                            }}
                          />
                          {(a.mode === "keyframes"
                            ? a.keyframes.filter((k) => p in k.values)
                            : [
                                { id: "start", time: 0, values: a.from },
                                { id: "end", time: a.duration, values: a.to },
                              ]
                          ).map((k) => (
                            <button
                              key={k.id}
                              className={`timeline-key ${e.keyId === k.id && e.animationId === a.id ? "selected" : ""}`}
                              aria-label={`${p} keyframe at ${k.time.toFixed(3)} seconds`}
                              style={{ left: (offset + k.time) * zoom }}
                              onClick={() =>
                                e.choose(
                                  a.id,
                                  a.mode === "keyframes" ? k.id : undefined,
                                )
                              }
                              onPointerDown={(ev) =>
                                a.mode === "keyframes"
                                  ? start(ev, a.id, "key", k.id)
                                  : e.choose(a.id)
                              }
                              {...handlers}
                            >
                              ◆
                            </button>
                          ))}
                          <div
                            className="timeline-playhead"
                            style={{ left: e.time * zoom }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
          {selected && (
            <div className="motion-timeline-detail">
              <Field
                label="Playhead seconds"
                value={e.time}
                onCommit={(v) => e.seek(Math.max(0, Number(v)))}
              />
              <button className="button" onClick={e.addKey} disabled={e.test}>
                Add keyframe at playhead
              </button>
              {selected.s.trigger.type === "scroll" && (
                <>
                  <button className="button" onClick={() => e.setTest(true)}>
                    Open scroll preview
                  </button>
                  {e.test && (
                    <output aria-label="Scroll animation progress">
                      {Math.min(
                        100,
                        Math.round((e.time / selected.a.duration) * 100),
                      )}
                      % scroll progress
                    </output>
                  )}
                </>
              )}
            </div>
          )}
          {e.error && (
            <p role="alert" className="motion-animation-error">
              {e.error}
            </p>
          )}
          <button
            className="timeline-mobile-close"
            onClick={() => e.setOpen(false)}
          >
            Close timeline
          </button>
        </div>
      )}
    </section>
  );
}
