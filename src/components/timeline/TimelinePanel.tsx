import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useAnimationEditor } from "../../features/animation/editor";
import { usePlayhead } from "../../features/animation/playback";
import { flatten } from "../../features/compositions/schema";
import { bindings, bindingError } from "../../features/animation/bindings";
import { moveKeys } from "../../features/animation/commands";
import type {
  AnimationDocument,
  Easing,
  Keyframe,
  Track,
} from "../../features/animation/runtime";
import { PropertyControl } from "../controls/PropertyControl";
import { Icon, IconButton } from "../controls/Primitives";
import { normalizeColor } from "../../features/animation/colors";
import { timecode } from "../../features/animation/runtime";

function ExactNumber({
  label,
  value,
  onChange,
  min,
  max,
  onFocus,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  onFocus?: () => void;
}) {
  return (
    <label className="timeline-number">
      {label}
      <input
        key={`${label}:${value}`}
        aria-label={label}
        type="number"
        defaultValue={+value.toFixed(6)}
        min={min}
        max={max}
        step="any"
        onFocus={onFocus}
        onBlur={(e) => {
          const n = Number(e.currentTarget.value);
          if (
            e.currentTarget.value.trim() &&
            Number.isFinite(n) &&
            n >= (min ?? -Infinity) &&
            n <= (max ?? Infinity)
          )
            onChange(n);
          // Revert rejected drafts; successful commits replace this keyed input.
          e.currentTarget.value = String(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
    </label>
  );
}
export function TimelinePanel() {
  const editor = useAnimationEditor();
  const { playback, document: doc, selectedKeys } = editor;
  const time = usePlayhead(playback);
  const [open, setOpen] = useState(false),
    [zoomSetting, setZoom] = useState(100),
    [height, setHeight] = useState(300);
  const [focused, setFocused] = useState(false);
  const [mobileAllTracks, setMobileAllTracks] = useState(false);
  const valueGesture = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    document: AnimationDocument;
    ids: Set<string>;
    moved: boolean;
    valid: boolean;
  } | null>(null);
  const clipboard = useRef<{ track: Track; key: Keyframe }[]>([]);
  const layers = flatten(editor.project.layers);
  const zoom = Math.min(zoomSetting, 1000000 / doc.duration);
  const rulerStep = Math.max(
    1,
    Math.ceil(60 / zoom),
    Math.ceil(doc.duration / 200),
  );
  const depth = new Map<string, number>();
  function hierarchy(nodes: typeof layers, level = 0) {
    for (const layer of nodes) {
      depth.set(layer.id, level);
      hierarchy(layer.children, level + 1);
    }
  }
  hierarchy(editor.project.layers);
  const selectedTrack = doc.tracks.find((t) =>
    t.keyframes.some((k) => selectedKeys.has(k.id)),
  );
  const selectedKey = selectedTrack?.keyframes.find((k) =>
    selectedKeys.has(k.id),
  );
  const selectedLayer = layers.find((l) => l.id === selectedTrack?.layerId);
  const binding =
    selectedLayer &&
    bindings(selectedLayer).find((b) => b.path === selectedTrack?.propertyPath);
  // Play/pause at the same time must update controls too.
  useSyncExternalStore(
    playback.subscribe,
    () => `${playback.playing}:${playback.speed}`,
  );
  function attempt(fn: () => void) {
    try {
      fn();
    } catch (e) {
      editor.report((e as Error).message);
    }
  }
  function copy() {
    clipboard.current = doc.tracks.flatMap((track) =>
      track.keyframes
        .filter((k) => selectedKeys.has(k.id))
        .map((key) => ({ track, key: structuredClone(key) })),
    );
  }
  function paste(duplicate = false) {
    const source = duplicate
      ? doc.tracks.flatMap((track) =>
          track.keyframes
            .filter((k) => selectedKeys.has(k.id))
            .map((key) => ({ track, key })),
        )
      : clipboard.current;
    if (!source.length) return;
    const base = Math.min(...source.map((x) => x.key.time));
    const next = structuredClone(doc),
      newIds = new Set<string>();
    for (const { track, key } of source) {
      const target =
        !duplicate &&
        source.every((x) => x.track.id === source[0].track.id) &&
        selectedTrack &&
        selectedTrack.interpolation === track.interpolation
          ? next.tracks.find((t) => t.id === selectedTrack.id)
          : next.tracks.find((t) => t.id === track.id);
      if (!target) throw new Error("Select a compatible destination track");
      const timestamp =
        key.time - base + (duplicate ? base + 1 / doc.frameRate : time);
      if (
        timestamp > doc.duration ||
        target.keyframes.some((k) => Math.abs(k.time - timestamp) < 1e-7)
      )
        throw new Error("Paste would overlap a keyframe or exceed duration");
      const id = crypto.randomUUID();
      newIds.add(id);
      target.keyframes.push({ ...structuredClone(key), id, time: timestamp });
      target.keyframes.sort((a, b) => a.time - b.time);
      const error = bindingError(
        target,
        layers.find((l) => l.id === target.layerId),
      );
      if (error) throw new Error(error);
    }
    editor.change(next);
    editor.selectKeys(newIds);
  }
  function patchKeys(fn: (key: Keyframe) => Keyframe) {
    editor.change({
      ...doc,
      tracks: doc.tracks.map((t) => ({
        ...t,
        keyframes: t.keyframes.map((k) => (selectedKeys.has(k.id) ? fn(k) : k)),
      })),
    });
  }
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'input,textarea,select,[contenteditable="true"],[role="slider"],[role="dialog"]',
        ) ||
        (target.closest("button,a,summary") && e.key === " ")
      )
        return;
      if (e.key === "Escape" && focused) {
        drag.current = null;
        editor.cancel();
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (!focused) return;
        if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          copy();
        }
        if (e.key.toLowerCase() === "v") {
          e.preventDefault();
          attempt(() => paste());
        }
        if (e.key.toLowerCase() === "d") {
          e.preventDefault();
          attempt(() => paste(true));
        }
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        if (playback.playing) playback.pause();
        else playback.play();
      } else if (
        e.key.toLowerCase() === "k" &&
        editor.selected &&
        editor.activePath
      ) {
        e.preventDefault();
        editor.insert(editor.selected, editor.activePath);
      } else if (focused && ["Delete", "Backspace"].includes(e.key)) {
        e.preventDefault();
        editor.removeSelected();
      } else if (
        focused &&
        ["ArrowLeft", "ArrowRight", "Home"].includes(e.key)
      ) {
        e.preventDefault();
        playback.seek(
          e.key === "Home"
            ? doc.range.start
            : playback.time + (e.key === "ArrowLeft" ? -1 : 1) / doc.frameRate,
        );
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });
  function startDrag(
    e: ReactPointerEvent<HTMLButtonElement>,
    track: Track,
    key: Keyframe,
  ) {
    e.stopPropagation();
    playback.pause();
    editor.onSelect(track.layerId);
    editor.setActivePath(track.propertyPath);
    let ids = new Set(selectedKeys);
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (ids.has(key.id)) ids.delete(key.id);
      else ids.add(key.id);
    } else if (!ids.has(key.id)) ids = new Set([key.id]);
    editor.selectKeys(ids);
    drag.current = {
      x: e.clientX,
      document: doc,
      ids,
      moved: false,
      valid: true,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveDrag(e: ReactPointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    if (!session) return;
    if (Math.abs(e.clientX - session.x) < 3 && !session.moved) return;
    session.moved = true;
    let delta = (e.clientX - session.x) / zoom;
    if (!e.altKey) {
      const anchor = session.document.tracks
        .flatMap((t) => t.keyframes)
        .find((k) => session.ids.has(k.id));
      if (anchor)
        delta =
          Math.round((anchor.time + delta) * doc.frameRate) / doc.frameRate -
          anchor.time;
    }
    try {
      editor.change(moveKeys(session.document, session.ids, delta), true);
      session.valid = true;
    } catch (e) {
      session.valid = false;
      editor.report((e as Error).message);
    }
  }
  return (
    <section
      className={`timeline-panel ${open ? "is-open" : ""}`}
      ref={panel}
      style={{ "--timeline-height": `${height}px` } as React.CSSProperties}
      aria-label="Animation timeline"
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <header className="timeline-heading">
        <button
          className="timeline-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <Icon name={open ? "chevron-down" : "chevron-up"} /> Animation
          timeline <small>{doc.tracks.length} tracks</small>
        </button>
        <IconButton
          label={playback.playing ? "Pause timeline" : "Play timeline"}
          icon={playback.playing ? "pause-fill" : "play-fill"}
          onClick={() =>
            playback.playing ? playback.pause() : playback.play()
          }
        />
        <output
          aria-label="Current timeline time"
          title={`${time.toFixed(6)} seconds`}
        >
          {timecode(time, doc.frameRate)} / {doc.duration}s
        </output>
      </header>
      {open && (
        <div
          className={`timeline-body ${mobileAllTracks ? "show-all-tracks" : ""}`}
        >
          <div
            className="timeline-resize"
            role="separator"
            aria-label="Timeline height"
            aria-orientation="horizontal"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                setHeight((h) =>
                  Math.max(
                    200,
                    Math.min(600, h + (e.key === "ArrowUp" ? 20 : -20)),
                  ),
                );
              }
            }}
            onPointerDown={(e) => {
              const y = e.clientY,
                initial = height;
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.dataset.startY = String(y);
              e.currentTarget.dataset.height = String(initial);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                setHeight(
                  Math.max(
                    200,
                    Math.min(
                      600,
                      Number(e.currentTarget.dataset.height) +
                        Number(e.currentTarget.dataset.startY) -
                        e.clientY,
                    ),
                  ),
                );
            }}
          />
          <div className="timeline-toolbar">
            <IconButton
              label="Return to timeline start"
              icon="skip-start-fill"
              onClick={() => playback.seek(doc.range.start)}
            />
            <IconButton
              label="Step backward"
              icon="caret-left-fill"
              onClick={() => playback.seek(time - 1 / doc.frameRate)}
            />
            <IconButton
              label="Step forward"
              icon="caret-right-fill"
              onClick={() => playback.seek(time + 1 / doc.frameRate)}
            />
            <IconButton
              label="Stop timeline"
              icon="stop-fill"
              onClick={() => playback.stop()}
            />
            <ExactNumber
              label="Seek seconds"
              value={time}
              min={0}
              max={doc.duration}
              onFocus={() => playback.pause()}
              onChange={(n) => playback.seek(n)}
            />
            <label>
              Speed
              <select
                aria-label="Playback speed"
                value={playback.speed}
                onChange={(e) => playback.setSpeed(Number(e.target.value))}
              >
                {[-2, -1, -0.5, 0.25, 0.5, 1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n}×
                  </option>
                ))}
              </select>
            </label>
            <label>
              Loop
              <select
                aria-label="Timeline loop mode"
                value={doc.loopMode}
                onChange={(e) =>
                  editor.change({
                    ...doc,
                    loopMode: e.target.value as AnimationDocument["loopMode"],
                  })
                }
              >
                <option value="none">None</option>
                <option value="loop">Loop</option>
                <option value="ping-pong">Ping-pong</option>
              </select>
            </label>
            <label className={editor.autoKey ? "auto-key active" : "auto-key"}>
              <input
                type="checkbox"
                checked={editor.autoKey}
                onChange={(e) => editor.setAutoKey(e.target.checked)}
              />
              Auto Key
            </label>
            <ExactNumber
              label="Duration"
              value={doc.duration}
              min={0.001}
              onChange={(n) => {
                if (
                  doc.tracks.some((t) => t.keyframes.some((k) => k.time > n))
                ) {
                  editor.report(
                    "Move or delete keys beyond the new duration first",
                  );
                  return;
                }
                editor.change({
                  ...doc,
                  duration: n,
                  range: {
                    start: Math.min(doc.range.start, n - 0.001),
                    end:
                      doc.range.end === doc.duration
                        ? n
                        : Math.min(n, doc.range.end),
                  },
                });
              }}
            />
            <ExactNumber
              label="Frame rate"
              value={doc.frameRate}
              min={1}
              max={240}
              onChange={(n) =>
                editor.change({ ...doc, frameRate: Math.round(n) })
              }
            />
            <ExactNumber
              label="Range start"
              value={doc.range.start}
              min={0}
              max={doc.range.end - 0.001}
              onChange={(n) =>
                editor.change({ ...doc, range: { ...doc.range, start: n } })
              }
            />
            <ExactNumber
              label="Range end"
              value={doc.range.end}
              min={doc.range.start + 0.001}
              max={doc.duration}
              onChange={(n) =>
                editor.change({ ...doc, range: { ...doc.range, end: n } })
              }
            />
            <label>
              Zoom
              <input
                aria-label="Timeline zoom"
                type="range"
                min={30}
                max={300}
                value={zoomSetting}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
          </div>
          <input
            className="timeline-seek"
            aria-label="Timeline playhead"
            type="range"
            min={0}
            max={doc.duration}
            step="any"
            value={time}
            onChange={(e) => playback.seek(Number(e.target.value))}
          />
          <button
            className="timeline-mobile-filter"
            aria-pressed={mobileAllTracks}
            onClick={() => setMobileAllTracks((v) => !v)}
          >
            {mobileAllTracks ? "Show selected layer" : "Show all tracks"}
          </button>
          <div className="timeline-scroll">
            <div
              className="timeline-grid"
              style={{ width: `max(100%, ${200 + doc.duration * zoom}px)` }}
            >
              <div className="timeline-ruler">
                <span className="track-label">Layer / property</span>
                <div
                  className="ruler-times"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    playback.seek(
                      (e.clientX -
                        e.currentTarget.getBoundingClientRect().left) /
                        zoom,
                    );
                  }}
                  onPointerMove={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId))
                      playback.seek(
                        (e.clientX -
                          e.currentTarget.getBoundingClientRect().left) /
                          zoom,
                      );
                  }}
                >
                  {Array.from(
                    {
                      length: Math.floor(doc.duration / rulerStep) + 1,
                    },
                    (_, i) => {
                      const t = i * rulerStep;
                      return (
                        <span key={i} style={{ left: t * zoom }}>
                          {t}s
                        </span>
                      );
                    },
                  )}
                </div>
              </div>
              {!doc.tracks.length && (
                <div className="timeline-empty">
                  Select a layer, then use ◆ beside a property to add a
                  keyframe. Auto Key is off.
                </div>
              )}
              {[
                ...layers.map((l) => l.id),
                ...new Set(
                  doc.tracks
                    .filter((t) => !layers.some((l) => l.id === t.layerId))
                    .map((t) => t.layerId),
                ),
              ].map((id) => {
                const tracks = doc.tracks.filter((t) => t.layerId === id);
                if (!tracks.length) return null;
                const layer = layers.find((l) => l.id === id);
                return (
                  <div
                    key={id}
                    className={
                      editor.selected === id
                        ? "timeline-layer selected"
                        : "timeline-layer"
                    }
                  >
                    <button
                      className="timeline-layer-name"
                      style={{ paddingLeft: 12 + (depth.get(id) ?? 0) * 12 }}
                      onClick={() => layer && editor.onSelect(id)}
                    >
                      {layer?.name ?? "Missing layer"}
                    </button>
                    {tracks.map((track) => {
                      const error = bindingError(track, layer);
                      return (
                        <div
                          className={`timeline-track ${error ? "inactive" : ""}`}
                          key={track.id}
                        >
                          <div className="track-label">
                            <input
                              type="checkbox"
                              aria-label={`Enable ${track.propertyPath} track`}
                              checked={track.enabled}
                              disabled={!!error}
                              onChange={(e) =>
                                editor.change({
                                  ...doc,
                                  tracks: doc.tracks.map((t) =>
                                    t.id === track.id
                                      ? { ...t, enabled: e.target.checked }
                                      : t,
                                  ),
                                })
                              }
                            />
                            <button
                              title={error ?? track.propertyPath}
                              onClick={() => {
                                if (layer) editor.onSelect(id);
                                editor.setActivePath(track.propertyPath);
                                editor.selectKeys(
                                  new Set(track.keyframes.map((k) => k.id)),
                                );
                              }}
                            >
                              {track.propertyPath.replace(
                                /^props\.|^modifiers\./,
                                "",
                              )}
                              {error && " ⚠"}
                            </button>
                            <button
                              aria-label={`Remove ${track.propertyPath} track`}
                              onClick={() =>
                                editor.change({
                                  ...doc,
                                  tracks: doc.tracks.filter(
                                    (t) => t.id !== track.id,
                                  ),
                                })
                              }
                            >
                              ×
                            </button>
                          </div>
                          <div
                            className="track-lane"
                            onDoubleClick={(e) => {
                              playback.seek(
                                (e.clientX -
                                  e.currentTarget.getBoundingClientRect()
                                    .left) /
                                  zoom,
                              );
                              editor.insert(id, track.propertyPath);
                            }}
                          >
                            <span className="track-line" />
                            {track.keyframes.map((key) => (
                              <button
                                key={key.id}
                                className={`timeline-key ${selectedKeys.has(key.id) ? "selected" : ""}`}
                                style={{ left: key.time * zoom }}
                                aria-label={`${track.propertyPath} keyframe at ${key.time} seconds`}
                                aria-pressed={selectedKeys.has(key.id)}
                                onPointerDown={(e) => startDrag(e, track, key)}
                                onPointerMove={moveDrag}
                                onPointerUp={() => {
                                  if (drag.current?.moved) {
                                    if (drag.current.valid) editor.finish();
                                    else editor.cancel();
                                  }
                                  drag.current = null;
                                }}
                                onPointerCancel={() => {
                                  drag.current = null;
                                  editor.cancel();
                                }}
                                onClick={(e) => {
                                  if (e.detail === 0) {
                                    editor.selectKeys(new Set([key.id]));
                                    editor.onSelect(id);
                                    editor.setActivePath(track.propertyPath);
                                  }
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  playback.seek(key.time);
                                }}
                              >
                                ◆
                              </button>
                            ))}
                            <div
                              className="timeline-playhead"
                              style={{ left: time * zoom }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {selectedKey && selectedTrack && (
            <div className="keyframe-inspector">
              <span>{selectedKeys.size} selected</span>
              <ExactNumber
                label="Keyframe time"
                value={selectedKey.time}
                min={0}
                max={doc.duration}
                onChange={(n) =>
                  attempt(() =>
                    editor.change(
                      moveKeys(doc, selectedKeys, n - selectedKey.time),
                    ),
                  )
                }
              />
              <label>
                Easing
                <select
                  aria-label="Keyframe easing"
                  value={selectedKey.easing.type}
                  disabled={selectedTrack.interpolation === "discrete"}
                  onChange={(e) =>
                    patchKeys((k) => ({
                      ...k,
                      easing:
                        e.target.value === "bezier"
                          ? { type: "bezier", points: [0.25, 0.1, 0.25, 1] }
                          : {
                              type: e.target.value as Exclude<
                                Easing["type"],
                                "bezier"
                              >,
                            },
                    }))
                  }
                >
                  {[
                    "linear",
                    "ease-in",
                    "ease-out",
                    "ease-in-out",
                    "hold",
                    "bezier",
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              {selectedTrack.interpolation === "discrete" && (
                <small>Discrete values use hold interpolation.</small>
              )}
              {selectedKey.easing.type === "bezier" &&
                selectedKey.easing.points.map((v, i) => (
                  <ExactNumber
                    key={i}
                    label={
                      ["Bezier x1", "Bezier y1", "Bezier x2", "Bezier y2"][i]
                    }
                    value={v}
                    min={i % 2 === 0 ? 0 : undefined}
                    max={i % 2 === 0 ? 1 : undefined}
                    onChange={(n) =>
                      patchKeys((k) => {
                        const points = [
                          ...(k.easing.type === "bezier"
                            ? k.easing.points
                            : [0.25, 0.1, 0.25, 1]),
                        ] as [number, number, number, number];
                        points[i] = n;
                        return { ...k, easing: { type: "bezier", points } };
                      })
                    }
                  />
                ))}
              {binding && selectedKeys.size === 1 && (
                <div
                  onPointerDown={(e) => {
                    if (
                      (e.target as HTMLElement).matches(
                        'input[type="range"],input[type="color"]',
                      )
                    ) {
                      valueGesture.current = true;
                      (e.target as HTMLElement).setPointerCapture(e.pointerId);
                    }
                  }}
                  onPointerUp={() => {
                    if (valueGesture.current) editor.finish();
                    valueGesture.current = false;
                  }}
                  onPointerCancel={() => {
                    valueGesture.current = false;
                    editor.cancel();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      valueGesture.current = false;
                      editor.cancel();
                    }
                  }}
                >
                  <PropertyControl
                    name="Keyframe value"
                    p={{
                      ...binding.property,
                      ui: { ...binding.property.ui, label: "Keyframe value" },
                    }}
                    value={selectedKey.value}
                    onReset={() =>
                      patchKeys((k) => ({
                        ...k,
                        value:
                          binding.interpolation === "color"
                            ? normalizeColor(binding.value as string)
                            : binding.value,
                      }))
                    }
                    onChange={(value) =>
                      attempt(() =>
                        editor.change(
                          {
                            ...doc,
                            tracks: doc.tracks.map((t) => ({
                              ...t,
                              keyframes: t.keyframes.map((k) =>
                                selectedKeys.has(k.id)
                                  ? {
                                      ...k,
                                      value:
                                        binding.interpolation === "color"
                                          ? normalizeColor(value)
                                          : value,
                                    }
                                  : k,
                              ),
                            })),
                          },
                          valueGesture.current,
                        ),
                      )
                    }
                  />
                </div>
              )}
              <button onClick={copy}>Copy</button>
              <button onClick={() => attempt(() => paste())}>Paste</button>
              <button onClick={() => attempt(() => paste(true))}>
                Duplicate
              </button>
              <button onClick={editor.removeSelected}>Delete keys</button>
            </div>
          )}
          {editor.error && (
            <p className="control-error" role="alert">
              {editor.error}
            </p>
          )}
          <small className="timeline-note">
            Keyframed properties follow timeline time. Native shader clocks and
            pointer drivers remain independent. Alt-drag disables frame
            snapping.
          </small>
          <button
            className="timeline-mobile-close"
            onClick={() => setOpen(false)}
          >
            Close timeline
          </button>
        </div>
      )}
    </section>
  );
}
