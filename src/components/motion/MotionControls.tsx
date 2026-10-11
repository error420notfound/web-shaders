import type React from "react";
import { Icon } from "../controls/Primitives";
import type { MotionNode } from "../../features/motion/schema";
export function Field({
  label,
  value,
  onCommit,
  multiline = false,
}: {
  label: string;
  value: string | number;
  onCommit: (v: string) => void;
  multiline?: boolean;
}) {
  const props = {
    "aria-label": label,
    defaultValue: value,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.currentTarget.value !== String(value))
        onCommit(e.currentTarget.value);
      e.currentTarget.value = String(value);
    },
    onKeyDown: (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (e.key === "Enter" && !multiline) e.currentTarget.blur();
      if (e.key === "Escape") {
        e.currentTarget.value = String(value);
        e.currentTarget.blur();
      }
    },
  };
  return (
    <label className="motion-field">
      {label}
      {multiline ? (
        <textarea key={String(value)} {...props} rows={3} />
      ) : (
        <input key={String(value)} {...props} />
      )}
    </label>
  );
}
export function Hierarchy({
  nodes,
  selected,
  onSelect,
  depth = 0,
}: {
  nodes: MotionNode[];
  selected: string | null;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  return (
    <>
      {nodes.map((n) => (
        <div key={n.id}>
          <button
            className={`motion-tree-row ${n.id === selected ? "active" : ""}`}
            style={{ paddingLeft: 12 + depth * 16 }}
            onClick={() => onSelect(n.id)}
            aria-pressed={n.id === selected}
          >
            <Icon
              name={
                n.kind === "instance"
                  ? "box"
                  : n.type === "heading"
                    ? "type-h2"
                    : "layers"
              }
            />
            <span>{n.name}</span>
          </button>
          {n.kind === "element" && (
            <Hierarchy
              nodes={n.children}
              selected={selected}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}
