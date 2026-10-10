import type {
  Layer,
  Project,
  Driver,
} from "../../features/compositions/schema";
import { flatten } from "../../features/compositions/schema";
import { effects, blendModes } from "../../data/registry";
import type { Property } from "../../data/registry";
import { PropertyControl } from "../controls/PropertyControl";
import {
  NumberControl,
  ColorControl,
  SelectControl,
  Icon,
} from "../controls/Primitives";

function DriverEndpoint({
  label,
  value,
  prop,
  onChange,
}: {
  label: string;
  value: number | { value: number; unit: "px" | "uv" };
  prop: Property;
  onChange: (v: number | { value: number; unit: "px" | "uv" }) => void;
}) {
  const numeric = typeof value === "number";
  const amount = numeric ? value : value.value;
  return (
    <>
      <NumberControl
        label={label}
        value={amount}
        min={numeric ? prop.ui.min : undefined}
        max={numeric ? prop.ui.max : undefined}
        step={prop.ui.step || 0.01}
        range={false}
        onChange={(v) => onChange(numeric ? v : { ...value, value: v })}
      />
      <SelectControl
        label={`${label} units`}
        value={numeric ? "number" : value.unit}
        options={[
          { label: "Number (prop units)", value: "number" },
          { label: "Pixels", value: "px" },
          { label: "UV units", value: "uv" },
        ]}
        onChange={(unit) =>
          onChange(unit === "number" ? amount : { value: amount, unit })
        }
      />
    </>
  );
}

function DriverControl({
  prop,
  name,
  driver,
  onChange,
  layers,
  id,
  value,
}: {
  prop: Property;
  name: string;
  driver?: Driver;
  onChange: (d?: Driver) => void;
  layers: Layer[];
  id: string;
  value: any;
}) {
  const kind = Array.isArray(prop.ui.type) ? prop.ui.type[0] : prop.ui.type;
  const position = kind === "position";
  const rest = driver?.rest ?? value ?? prop.default;
  const d = driver?.config;
  function patch(changes: Record<string, any>) {
    if (driver)
      onChange({ ...driver, config: { ...driver.config, ...changes } as any });
  }
  const source = layers.find((l) => l.id !== id);
  return (
    <div className="driver-control">
      <SelectControl
        label={`${name} source`}
        value={d?.type || "static"}
        options={[
          { label: "Static value", value: "static" },
          ...(position
            ? [{ label: "Pointer position", value: "mouse-position" }]
            : [
                { label: "Automatic loop", value: "auto-animate" },
                { label: "Pointer axis", value: "mouse" },
                ...(source ? [{ label: "Layer output", value: "map" }] : []),
              ]),
        ]}
        onChange={(type) => {
          if (type === "static") {
            onChange();
            return;
          }
          const min = prop.ui.min ?? 0,
            max = prop.ui.max ?? 1;
          const amplitude = (max - min) * 0.1;
          const center =
            typeof rest === "number"
              ? Math.max(min, Math.min(max, rest))
              : (min + max) / 2;
          const config =
            type === "mouse-position"
              ? { type, smoothing: 0.12 }
              : type === "auto-animate"
                ? {
                    type,
                    mode: "ping-pong",
                    outputMin: Math.max(min, center - amplitude),
                    outputMax: Math.min(max, center + amplitude),
                    speed: 0.06,
                    easing: "sine",
                  }
                : type === "mouse"
                  ? {
                      type,
                      axis: "x",
                      outputMin: min,
                      outputMax: max,
                      smoothing: 0.1,
                    }
                  : {
                      type,
                      source: source!.id,
                      channel: "luminance",
                      inputMin: 0,
                      inputMax: 1,
                      outputMin: min,
                      outputMax: max,
                    };
          onChange({ rest, config: config as any });
        }}
      />
      {d && (
        <div className="driver-fields">
          {"outputMin" in d && (
            <>
              <DriverEndpoint
                label="Output minimum"
                value={d.outputMin}
                prop={prop}
                onChange={(v) => patch({ outputMin: v })}
              />
              <DriverEndpoint
                label="Output maximum"
                value={d.outputMax}
                prop={prop}
                onChange={(v) => patch({ outputMax: v })}
              />
            </>
          )}
          {d.type === "auto-animate" && (
            <>
              <NumberControl
                label="Speed"
                value={d.speed ?? 1}
                step={0.01}
                range={false}
                unit="cycles/s"
                onChange={(v) => patch({ speed: v })}
              />
              <SelectControl
                label="Loop mode"
                value={d.mode}
                onChange={(v) => patch({ mode: v })}
                options={["ping-pong", "loop"].map((value) => ({
                  label: value,
                  value,
                }))}
              />
              <SelectControl
                label="Easing"
                value={d.easing || "sine"}
                onChange={(v) => patch({ easing: v })}
                options={["sine", "linear", "quad", "expo", "bounce"].map(
                  (value) => ({ label: value, value }),
                )}
              />
            </>
          )}
          {d.type === "mouse" && (
            <SelectControl
              label="Pointer axis"
              value={d.axis}
              options={[
                { label: "Horizontal (X)", value: "x" },
                { label: "Vertical (Y)", value: "y" },
              ]}
              onChange={(v) => patch({ axis: v })}
            />
          )}
          {(d.type === "mouse" || d.type === "mouse-position") && (
            <>
              <NumberControl
                label="Smoothing"
                value={d.smoothing ?? 0}
                min={0}
                max={1}
                onChange={(v) => patch({ smoothing: v })}
              />
              <NumberControl
                label="Momentum"
                value={d.momentum ?? 0}
                min={0}
                max={1}
                onChange={(v) => patch({ momentum: v })}
              />
            </>
          )}
          {d.type === "mouse-position" && (
            <NumberControl
              label="Pointer reach"
              value={d.reach ?? 1}
              step={0.1}
              range={false}
              onChange={(v) => patch({ reach: v })}
            />
          )}
          {d.type === "map" && (
            <>
              <SelectControl
                label="Source layer"
                value={d.source}
                options={layers
                  .filter((l) => l.id !== id)
                  .map((l) => ({ label: l.name, value: l.id }))}
                onChange={(v) => patch({ source: v })}
              />
              <SelectControl
                label="Channel"
                value={d.channel}
                options={[
                  "alpha",
                  "alphaInverted",
                  "luminance",
                  "luminanceInverted",
                ].map((value) => ({ label: value, value }))}
                onChange={(v) => patch({ channel: v })}
              />
              <NumberControl
                label="Input minimum"
                value={d.inputMin}
                range={false}
                onChange={(v) => patch({ inputMin: v })}
              />
              <NumberControl
                label="Input maximum"
                value={d.inputMax}
                range={false}
                onChange={(v) => patch({ inputMax: v })}
              />
            </>
          )}
          <small>Pause and reduced motion use the static rest value.</small>
        </div>
      )}
    </div>
  );
}
export function Inspector({
  project,
  layer,
  tab,
  onTab,
  onLayer,
  onPreview,
}: {
  project: Project;
  layer?: Layer;
  tab: "layer" | "preview";
  onTab: (t: "layer" | "preview") => void;
  onLayer: (changes: Partial<Layer>, group?: string) => void;
  onPreview: (changes: Partial<Project["preview"]>, group?: string) => void;
}) {
  const e = layer ? effects[layer.type] : undefined;
  const all = flatten(project.layers);
  const groups = e
    ? [
        ...new Set(
          Object.values(e.props).map((p) => p.ui.group || "Properties"),
        ),
      ]
    : [];
  function prop(key: string, value: any) {
    if (!layer) return;
    const drivers = { ...layer.drivers };
    if (drivers[key]) drivers[key] = { ...drivers[key], rest: value };
    onLayer(
      { props: { ...layer.props, [key]: value }, drivers },
      `prop:${layer.id}:${key}`,
    );
  }
  function modifier(changes: Partial<Layer["modifiers"]>) {
    if (layer)
      onLayer(
        { modifiers: { ...layer.modifiers, ...changes } },
        `modifiers:${layer.id}`,
      );
  }
  function resetProp(key: string, definition: Property) {
    if (!layer) return;
    const drivers = { ...layer.drivers };
    delete drivers[key];
    onLayer({ props: { ...layer.props, [key]: definition.default }, drivers });
  }
  const p = project.preview;
  return (
    <aside className="inspector">
      <div className="inspector-tabs">
        <button
          className={tab === "layer" ? "active" : ""}
          onClick={() => onTab("layer")}
        >
          Layer
        </button>
        <button
          className={tab === "preview" ? "active" : ""}
          onClick={() => onTab("preview")}
        >
          Preview
        </button>
      </div>
      <div className="inspector-scroll">
        {tab === "layer" &&
          (!layer || !e ? (
            <div className="empty-state">
              <Icon name="sliders2" />
              <p>Select a layer to edit its properties.</p>
            </div>
          ) : (
            <>
              <div className="selected-heading">
                <span className="eyebrow">SELECTED LAYER</span>
                <input
                  aria-label="Layer name"
                  key={layer.id + layer.name}
                  defaultValue={layer.name}
                  onBlur={(ev) => {
                    if (ev.target.value.trim())
                      onLayer({ name: ev.target.value.trim() });
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") ev.currentTarget.blur();
                  }}
                />
                <p>{e.description}</p>
                <a
                  href={`https://shaders.com/docs/components/${layer.type.replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Component documentation <Icon name="arrow-up-right" />
                </a>
              </div>
              {groups.map((group, i) => (
                <details
                  key={group}
                  className="property-group"
                  open={i < 2 && group !== "Advanced"}
                >
                  <summary>{group}</summary>
                  {Object.entries(e.props)
                    .filter(([, v]) => (v.ui.group || "Properties") === group)
                    .map(([key, definition]) => (
                      <div key={key}>
                        <PropertyControl
                          name={key}
                          p={definition}
                          value={
                            Object.hasOwn(layer.props, key)
                              ? layer.props[key]
                              : definition.default
                          }
                          onChange={(v) => prop(key, v)}
                          onReset={() => resetProp(key, definition)}
                        />
                        {definition.dynamic && (
                          <DriverControl
                            value={
                              Object.hasOwn(layer.props, key)
                                ? layer.props[key]
                                : definition.default
                            }
                            name={definition.ui.label || key}
                            prop={definition}
                            driver={layer.drivers[key]}
                            layers={all}
                            id={layer.id}
                            onChange={(d) => {
                              const drivers = { ...layer.drivers };
                              if (d)
                                drivers[key] = {
                                  ...d,
                                  rest: Object.hasOwn(layer.props, key)
                                    ? layer.props[key]
                                    : definition.default,
                                };
                              else delete drivers[key];
                              onLayer({ drivers });
                            }}
                          />
                        )}
                      </div>
                    ))}
                </details>
              ))}
              <details className="property-group" open>
                <summary>Compositing</summary>
                <NumberControl
                  label="Opacity"
                  value={layer.modifiers.opacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => modifier({ opacity: v })}
                />
                <SelectControl
                  label="Blend mode"
                  value={layer.modifiers.blendMode}
                  options={blendModes.map((value) => ({ label: value, value }))}
                  onChange={(v) => modifier({ blendMode: v })}
                />
                <SelectControl
                  label="Mask source"
                  value={layer.modifiers.maskSource || ""}
                  options={[
                    { label: "None", value: "" },
                    ...all
                      .filter((l) => l.id !== layer.id)
                      .map((l) => ({ label: l.name, value: l.id })),
                  ]}
                  onChange={(v) => {
                    const mods = { ...layer.modifiers };
                    if (v) mods.maskSource = v;
                    else delete mods.maskSource;
                    onLayer({ modifiers: mods });
                  }}
                />
                {layer.modifiers.maskSource && (
                  <SelectControl
                    label="Mask type"
                    value={layer.modifiers.maskType || "alpha"}
                    options={[
                      "alpha",
                      "alphaInverted",
                      "luminance",
                      "luminanceInverted",
                    ].map((value) => ({ label: value, value }))}
                    onChange={(v) => modifier({ maskType: v })}
                  />
                )}
              </details>
              <details className="property-group">
                <summary>Layer transform</summary>
                {(["offsetX", "offsetY", "scale", "rotation"] as const).map(
                  (key) => (
                    <NumberControl
                      key={key}
                      label={
                        key === "offsetX"
                          ? "Position X"
                          : key === "offsetY"
                            ? "Position Y"
                            : key === "rotation"
                              ? "Rotation"
                              : "Scale"
                      }
                      value={
                        layer.modifiers.transform?.[key] ??
                        (key === "scale" ? 1 : 0)
                      }
                      unit={key === "rotation" ? "°" : undefined}
                      min={key === "scale" ? 0.01 : undefined}
                      step={key === "rotation" ? 1 : 0.01}
                      range={false}
                      onChange={(v) =>
                        modifier({
                          transform: { ...layer.modifiers.transform, [key]: v },
                        })
                      }
                    />
                  ),
                )}
                <button
                  className="small-button"
                  onClick={() => {
                    const mods = { ...layer.modifiers };
                    delete mods.transform;
                    onLayer({ modifiers: mods });
                  }}
                >
                  Reset transform
                </button>
              </details>
            </>
          ))}
        {tab === "preview" && (
          <>
            <div className="selected-heading">
              <span className="eyebrow">PREVIEW CONTEXT</span>
              <h2>
                {project.context === "website"
                  ? "Website Section"
                  : "Item Background"}
              </h2>
              <p>
                {project.context === "website"
                  ? "Judge the effect with real content."
                  : "A 2D image placed over your composition."}
              </p>
            </div>
            <div className="preview-fields">
              <ColorControl
                label="Base colour"
                value={p.baseColor}
                onChange={(v) => onPreview({ baseColor: v })}
              />
              <SelectControl
                label="Aspect ratio"
                value={p.ratio}
                options={["16/9", "4/3", "1/1", "3/4", "21/9"].map((value) => ({
                  label: value.replace("/", " : "),
                  value,
                }))}
                onChange={(v) => onPreview({ ratio: v })}
              />
              {project.context === "website" ? (
                <>
                  <label className="toggle-row">
                    Show sample content
                    <input
                      type="checkbox"
                      checked={p.showContent}
                      onChange={(ev) =>
                        onPreview({ showContent: ev.target.checked })
                      }
                    />
                  </label>
                  <ColorControl
                    label="Text colour"
                    value={p.textColor}
                    onChange={(v) => onPreview({ textColor: v })}
                  />
                  <label className="field">
                    <span>Heading</span>
                    <textarea
                      aria-label="Heading"
                      value={p.heading}
                      onChange={(ev) =>
                        onPreview(
                          { heading: ev.target.value },
                          "preview:heading",
                        )
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Paragraph</span>
                    <textarea
                      aria-label="Paragraph"
                      value={p.paragraph}
                      onChange={(ev) =>
                        onPreview(
                          { paragraph: ev.target.value },
                          "preview:paragraph",
                        )
                      }
                    />
                  </label>
                  <label className="field">
                    <span>CTA text</span>
                    <input
                      aria-label="CTA text"
                      value={p.cta}
                      onChange={(ev) =>
                        onPreview({ cta: ev.target.value }, "preview:cta")
                      }
                    />
                  </label>
                  <SelectControl
                    label="Text alignment"
                    value={p.alignment}
                    options={["left", "center", "right"].map((value) => ({
                      label: value,
                      value,
                    }))}
                    onChange={(v) => onPreview({ alignment: v })}
                  />
                  <SelectControl
                    label="Content position"
                    value={p.position}
                    options={["top", "center", "bottom"].map((value) => ({
                      label: value,
                      value,
                    }))}
                    onChange={(v) => onPreview({ position: v })}
                  />
                </>
              ) : (
                <>
                  <label className="upload-button">
                    <Icon name="upload" /> Upload preview image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      aria-label="Upload preview image"
                      onChange={(ev) => {
                        const f = ev.target.files?.[0];
                        if (f) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            onPreview({
                              image: String(reader.result),
                              imageName: f.name,
                            });
                          reader.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                  <p className="help-text">
                    {p.imageName || "Built-in FORM sample object"} · embedded in
                    project JSON
                  </p>
                  {p.image && (
                    <button
                      className="small-button"
                      onClick={() =>
                        onPreview({ image: null, imageName: null })
                      }
                    >
                      Use sample object
                    </button>
                  )}
                  <NumberControl
                    label="Image scale"
                    value={p.imageScale}
                    min={10}
                    max={160}
                    step={1}
                    unit="%"
                    onChange={(v) =>
                      onPreview({ imageScale: v }, "preview:scale")
                    }
                  />
                  <NumberControl
                    label="Image position X"
                    value={p.imageX}
                    min={0}
                    max={1}
                    onChange={(v) => onPreview({ imageX: v }, "preview:x")}
                  />
                  <NumberControl
                    label="Image position Y"
                    value={p.imageY}
                    min={0}
                    max={1}
                    onChange={(v) => onPreview({ imageY: v }, "preview:y")}
                  />
                  <p className="help-text">
                    2D image preview. GLB / USDZ scenes are outside this
                    version.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <footer className="inspector-footer">
        <Icon name="check2-circle" /> Supported Shaders properties only
      </footer>
    </aside>
  );
}
