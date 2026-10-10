import { useState } from "react";
import type { Layer } from "../../features/compositions/schema";
import { flatten } from "../../features/compositions/schema";
import { Icon, IconButton } from "../controls/Primitives";
export function LayerList({
  layers,
  selected,
  onSelect,
  onChange,
  onMove,
  onDelete,
  onDuplicate,
}: {
  layers: Layer[];
  selected: string | null;
  onSelect: (id: string) => void;
  onChange: (id: string, changes: Partial<Layer>) => void;
  onMove: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [drag, setDrag] = useState<string | null>(null);
  function branch(nodes: Layer[], depth = 0) {
    return [...nodes].reverse().map((l, reverseIndex) => {
      const index = nodes.length - 1 - reverseIndex;
      return (
        <div key={l.id}>
          <div
            className={`layer-row ${selected === l.id ? "selected" : ""} ${!l.visible ? "hidden-layer" : ""}`}
            style={{ paddingLeft: 10 + depth * 16 }}
            draggable
            onDragStart={(e) => {
              setDrag(l.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setDrag(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = nodes.findIndex((x) => x.id === drag);
              if (from >= 0 && drag && from !== index)
                onMove(drag, index - from);
              setDrag(null);
            }}
          >
            <Icon name="grip-vertical" />
            {l.children.length > 0 && (
              <button
                className="disclosure"
                aria-label={`${collapsed.has(l.id) ? "Expand" : "Collapse"} ${l.name}`}
                aria-expanded={!collapsed.has(l.id)}
                onClick={() =>
                  setCollapsed((s) => {
                    const n = new Set(s);
                    if (n.has(l.id)) n.delete(l.id);
                    else n.add(l.id);
                    return n;
                  })
                }
              >
                <Icon
                  name={collapsed.has(l.id) ? "chevron-right" : "chevron-down"}
                />
              </button>
            )}
            <button
              className="layer-select"
              onClick={() => onSelect(l.id)}
              aria-pressed={selected === l.id}
            >
              <span>{l.name}</span>
              {!l.visible && <small>Hidden</small>}
              {!l.children.length && <small>{l.type}</small>}
            </button>
            <IconButton
              icon={l.visible ? "eye" : "eye-slash"}
              label={`${l.visible ? "Hide" : "Show"} ${l.name}`}
              onClick={() => onChange(l.id, { visible: !l.visible })}
            />
          </div>
          {selected === l.id && (
            <div className="layer-actions">
              <IconButton
                icon="arrow-up"
                label={`Move ${l.name} up`}
                disabled={index === nodes.length - 1}
                onClick={() => onMove(l.id, 1)}
              />
              <IconButton
                icon="arrow-down"
                label={`Move ${l.name} down`}
                disabled={index === 0}
                onClick={() => onMove(l.id, -1)}
              />
              <IconButton
                icon="copy"
                label={`Duplicate ${l.name}`}
                onClick={() => onDuplicate(l.id)}
              />
              <IconButton
                icon="trash3"
                label={`Delete ${l.name}`}
                onClick={() => onDelete(l.id)}
              />
            </div>
          )}
          {!collapsed.has(l.id) && branch(l.children, depth + 1)}
        </div>
      );
    });
  }
  return (
    <section className="layer-stack">
      <header className="panel-heading">
        <h2>Composition</h2>
        <span>
          {flatten(layers).length}{" "}
          {flatten(layers).length === 1 ? "layer" : "layers"}
        </span>
      </header>
      <div className="layer-list">
        {branch(layers)}
        {!layers.length && (
          <div className="empty-state">
            <Icon name="layers" />
            <p>Your canvas is blank.</p>
            <small>Add an effect from the library.</small>
          </div>
        )}
      </div>
      <div className="stack-note">
        Top layer is drawn last · drag to reorder
      </div>
    </section>
  );
}
