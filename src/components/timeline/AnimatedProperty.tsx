import { useRef, useSyncExternalStore } from "react";
import type { Layer } from "../../features/compositions/schema";
import type { Property } from "../../data/registry";
import { bindings } from "../../features/animation/bindings";
import { useAnimationEditor } from "../../features/animation/editor";
import { TIME_EPSILON } from "../../features/animation/runtime";
import { PropertyControl } from "../controls/PropertyControl";
export function AnimatedProperty({
  layer,
  path,
  name,
  property,
  value,
  onChange,
  onReset,
}: {
  layer: Layer;
  path: string;
  name: string;
  property: Property;
  value: any;
  onChange: (v: any) => void;
  onReset: () => void;
}) {
  const editor = useAnimationEditor();
  const gesture = useRef(false);
  const binding = bindings(layer).find((b) => b.path === path);
  const track = editor.document.tracks.find(
    (t) => t.layerId === layer.id && t.propertyPath === path,
  );
  const atKey = useSyncExternalStore(
    editor.playback.subscribe,
    () =>
      !!track?.keyframes.some(
        (k) => Math.abs(k.time - editor.playback.time) < TIME_EPSILON,
      ),
  );
  const animatedValue = useSyncExternalStore(
    (fn) => editor.playback.subscribeLayer(layer.id, fn),
    () => editor.playback.layerSnapshot(layer.id)[path],
  );
  const displayed = animatedValue ?? value;
  function edit(v: any) {
    if (!binding || !editor.editValue(layer.id, path, v, gesture.current))
      onChange(v);
  }
  return (
    <div
      className="animated-property"
      onFocus={() => {
        editor.setActivePath(path);
        if (editor.playback.playing) editor.playback.pause();
      }}
      onPointerDown={(e) => {
        if (
          (e.target as HTMLElement).matches(
            'input[type="range"],input[type="color"]',
          )
        ) {
          gesture.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
      }}
      onPointerUp={() => {
        if (gesture.current) {
          gesture.current = false;
          editor.finish();
        }
      }}
      onPointerCancel={() => {
        gesture.current = false;
        editor.cancel();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          gesture.current = false;
          editor.cancel();
        }
      }}
    >
      {binding && (
        <div className="animation-source">
          <button
            className={`key-button ${atKey ? "active" : ""}`}
            aria-label={`Add or select ${property.ui.label || name} keyframe`}
            title="Insert value at playhead, or select existing key"
            onClick={() => editor.insert(layer.id, path)}
          >
            ◆
          </button>
          <select
            aria-label={`${property.ui.label || name} animation ownership`}
            value={track?.enabled ? "timeline" : "base"}
            onChange={(e) => {
              if (e.target.value === "timeline" && !track)
                editor.insert(layer.id, path);
              else if (track)
                editor.change({
                  ...editor.document,
                  tracks: editor.document.tracks.map((t) =>
                    t.id === track.id
                      ? { ...t, enabled: e.target.value === "timeline" }
                      : t,
                  ),
                });
            }}
          >
            <option value="base">
              {path.startsWith("props.") &&
              layer.drivers[name]?.enabled !== false &&
              layer.drivers[name]
                ? "Shader driver"
                : "Static"}
            </option>
            <option value="timeline">Timeline</option>
          </select>
          {editor.playback.hasStage(layer.id, path) && (
            <>
              <span>Staged</span>
              <button onClick={() => editor.playback.clearStage()}>
                Cancel
              </button>
            </>
          )}
        </div>
      )}
      <PropertyControl
        name={name}
        p={property}
        value={displayed}
        onChange={edit}
        onReset={() =>
          binding && track?.enabled ? edit(property.default) : onReset()
        }
      />
    </div>
  );
}
