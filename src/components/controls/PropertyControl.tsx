import { useState } from "react";
import type { Property } from "../../data/registry";
import { propError } from "../../data/registry";
import { NumberControl, ColorControl, SelectControl, Icon } from "./Primitives";
export function JsonControl({
  label,
  value,
  onChange,
  check,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  check?: (v: any) => string | undefined;
}) {
  const [draft, setDraft] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");
  function apply() {
    try {
      const v = JSON.parse(draft);
      const e = check?.(v);
      if (e) throw new Error(e);
      onChange(v);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="json-control">
      <label>
        {label}
        <textarea
          aria-label={`${label} JSON`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
        />
      </label>
      <button className="small-button" onClick={apply}>
        Apply JSON
      </button>
      {error && (
        <p role="alert" className="control-error">
          {error}
        </p>
      )}
    </div>
  );
}
export function PropertyControl({
  name,
  p,
  value,
  onChange,
  onReset,
}: {
  name: string;
  p: Property;
  value: any;
  onChange: (v: any) => void;
  onReset: () => void;
}) {
  const label = p.ui.label || name;
  const kind = Array.isArray(p.ui.type) ? p.ui.type[0] : p.ui.type;
  function change(v: any) {
    if (!propError(v, p)) onChange(v);
  }
  let control;
  if (kind === "readonly")
    control = (
      <label className="field">
        <span>
          {label} <small>derived</small>
        </span>
        <input readOnly value={String(value)} />
      </label>
    );
  else if ((kind === "range" || kind === "number") && typeof value === "number")
    control = (
      <NumberControl
        label={label}
        value={value}
        min={p.ui.min}
        max={p.ui.max}
        step={p.ui.step || 0.01}
        onChange={change}
        range={kind === "range"}
        unit={/angle|rotation/i.test(name) ? "°" : undefined}
      />
    );
  else if (kind === "color" && typeof value === "string")
    control = <ColorControl label={label} value={value} onChange={change} />;
  else if (p.ui.options?.length)
    control = (
      <SelectControl
        label={label}
        value={value}
        onChange={change}
        options={
          p.ui.options.some((o) => o.value === p.default)
            ? p.ui.options
            : [
                {
                  label: `Package default (${String(p.default)})`,
                  value: p.default,
                },
                ...p.ui.options,
              ]
        }
      />
    );
  else if (kind === "checkbox" && typeof value === "boolean")
    control = (
      <label className="toggle-row">
        <span>{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => change(e.target.checked)}
        />
      </label>
    );
  else if (
    kind === "position" &&
    value &&
    typeof value.x === "number" &&
    typeof value.y === "number"
  )
    control = (
      <div className="position-control">
        <div>
          {label} <small>normalised coordinates</small>
        </div>
        <div className="two-fields">
          <NumberControl
            label={`${label} X`}
            value={value.x}
            onChange={(x) => change({ ...value, x })}
            range={false}
          />
          <NumberControl
            label={`${label} Y`}
            value={value.y}
            onChange={(y) => change({ ...value, y })}
            range={false}
          />
        </div>
      </div>
    );
  else if (
    (kind === "text" ||
      kind === "origin" ||
      kind === "font-family" ||
      kind === "font-weight") &&
    (typeof value === "string" || typeof value === "number")
  )
    control = (
      <label className="field">
        <span>{label}</span>
        <input
          aria-label={label}
          defaultValue={value}
          key={String(value)}
          onBlur={(e) => {
            change(
              typeof value === "number"
                ? Number(e.target.value)
                : e.target.value,
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </label>
    );
  else if (kind === "image-upload" || kind === "video-upload")
    control = (
      <div className="media-control">
        <label className="field">
          <span>{label}</span>
          <input
            aria-label={`${label} URL`}
            defaultValue={value}
            key={String(value)}
            placeholder="URL or embedded data URI"
            onBlur={(e) => change(e.target.value)}
          />
        </label>
        <label className="upload-button">
          <Icon name="upload" /> Upload local{" "}
          {kind === "image-upload" ? "image" : "video"}
          <input
            aria-label={`Upload ${label}`}
            type="file"
            accept={kind === "image-upload" ? "image/*" : "video/*"}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                const r = new FileReader();
                r.onload = () => change(r.result);
                r.readAsDataURL(f);
              }
            }}
          />
        </label>
      </div>
    );
  else if (kind === "shape" || kind === "shape3d")
    control = (
      <JsonControl
        key={JSON.stringify(value)}
        label={`${label} configuration`}
        value={typeof value === "string" ? JSON.parse(value) : value}
        check={(v) =>
          propError(typeof value === "string" ? JSON.stringify(v) : v, p)
        }
        onChange={(v) =>
          change(typeof value === "string" ? JSON.stringify(v) : v)
        }
      />
    );
  else
    control = (
      <JsonControl
        key={JSON.stringify(value)}
        label={label}
        value={value}
        check={(v) => propError(v, p)}
        onChange={change}
      />
    );
  return (
    <div className="property">
      <div className="property-input">{control}</div>
      <div className="property-meta">
        <span title={p.description}>{p.description}</span>
        <button
          aria-label={`Reset ${label}`}
          title={`Default: ${JSON.stringify(p.default)}`}
          onClick={onReset}
        >
          <Icon name="arrow-counterclockwise" />
        </button>
      </div>
      {p.ui.min !== undefined && (
        <div className="range-hint">
          {p.ui.min} — {p.ui.max} · default {String(p.default)}
        </div>
      )}
    </div>
  );
}
