import { Field } from "./MotionControls";
import {
  useMotionEditor,
  selectedAnimation,
} from "../../features/motion/editor";
import {
  applyPreset,
  eases,
  properties,
  presets,
  resizeAnimation,
  moveKeyframe,
  targetOwner,
  matchesOwner,
} from "../../features/motion/animations";
import { flattenNodes } from "../../features/motion/schema";
import type {
  MotionAnimation,
  Sequence,
  Target,
} from "../../features/motion/schema";

export function AnimationInspector() {
  const e = useMotionEditor(),
    found = selectedAnimation(e),
    a = found?.animation,
    s = found?.sequence;
  const options = e.sequences
    .flatMap((s) => s.animations)
    .filter((a) => targetOwner(a.target) === e.selected);
  const inherited = e.displaySequences
    .filter((s) => !e.sequences.includes(s))
    .flatMap((s) => s.animations)
    .filter((a) => matchesOwner(a.target, e.selected));
  const targets = flattenNodes(e.roots).flatMap((n) =>
    n.kind === "element"
      ? [
          {
            label: n.name,
            target: { kind: "element", elementId: n.id } as Target,
          },
        ]
      : flattenNodes([
          e.project.components.find((d) => d.id === n.definitionId)!.root,
        ])
          .filter((c) => c.kind === "element")
          .map((c) => ({
            label: `${n.name} / ${c.name}`,
            target: {
              kind: "instance",
              instanceId: n.id,
              elementId: c.id,
            } as Target,
          })),
  );
  function edit(fn: (a: MotionAnimation) => MotionAnimation) {
    if (a)
      e.change((old) =>
        old.map((s) => ({
          ...s,
          animations: s.animations.map((x) => (x.id === a.id ? fn(x) : x)),
        })),
      );
  }
  function trigger(t: Sequence["trigger"]) {
    if (s)
      e.change((old) =>
        old.map((x) => (x.id === s.id ? { ...x, trigger: t } : x)),
      );
  }
  const key = a?.keyframes.find((k) => k.id === e.keyId);
  const keys = [
    ...new Set([
      ...properties,
      ...Object.keys(a?.from ?? {}),
      ...Object.keys(a?.to ?? {}),
      ...(a?.keyframes.flatMap((k) => Object.keys(k.values)) ?? []),
    ]),
  ];
  return (
    <div className="motion-animation-inspector">
      <h2>Animation</h2>
      {!a && (
        <p className="motion-muted">
          {inherited.length
            ? "This instance inherits animations from its component definition."
            : "No animations on this element. Add an animation to bring it to life."}
        </p>
      )}
      {inherited.map((a) => (
        <button className="button" key={a.id} onClick={() => e.choose(a.id)}>
          Edit component animation
        </button>
      ))}
      <button className="button primary" onClick={e.add} disabled={!e.selected}>
        Add Animation
      </button>
      {a && s && (
        <>
          <label className="motion-field">
            Selected animation
            <select
              aria-label="Selected animation"
              value={a.id}
              onChange={(ev) => e.choose(ev.target.value)}
            >
              {options.map((a, i) => (
                <option key={a.id} value={a.id}>
                  Animation {i + 1} · {a.mode}
                </option>
              ))}
            </select>
          </label>
          <label className="motion-field">
            Animation type
            <select
              aria-label="Animation type"
              value={a.mode}
              onChange={(ev) =>
                edit((x) =>
                  ev.target.value === "keyframes"
                    ? {
                        ...x,
                        mode: "keyframes",
                        keyframes: [
                          {
                            id: crypto.randomUUID(),
                            time: 0,
                            values: {
                              ...(e.runtime.current?.endpoints(x).initial ??
                                x.from),
                            },
                          },
                          {
                            id: crypto.randomUUID(),
                            time: x.duration,
                            values: {
                              ...(e.runtime.current?.endpoints(x).final ??
                                x.to),
                            },
                          },
                        ],
                      }
                    : {
                        ...x,
                        mode: ev.target.value as MotionAnimation["mode"],
                        keyframes: [],
                      },
                )
              }
            >
              {["from", "to", "fromTo", "keyframes"].map((v, i) => (
                <option key={v} value={v}>
                  {["From", "To", "From-To", "Keyframes"][i]}
                </option>
              ))}
            </select>
          </label>
          <label className="motion-field">
            Preset
            <select
              aria-label="Animation preset"
              value=""
              onChange={(ev) => {
                if (ev.target.value)
                  edit((x) =>
                    applyPreset(x, ev.target.value as keyof typeof presets),
                  );
              }}
            >
              <option value="">Apply preset…</option>
              {Object.keys(presets).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <div className="motion-animation-numbers">
            <Field
              label="Start time"
              value={a.at}
              onCommit={(v) => edit((x) => ({ ...x, at: Number(v) }))}
            />
            <Field
              label="Duration"
              value={a.duration}
              onCommit={(v) => edit((x) => resizeAnimation(x, Number(v)))}
            />
            <Field
              label="Delay"
              value={a.delay}
              onCommit={(v) => edit((x) => ({ ...x, delay: Number(v) }))}
            />
            <Field
              label="Repeat"
              value={a.repeat}
              onCommit={(v) => edit((x) => ({ ...x, repeat: Number(v) }))}
            />
            <Field
              label="Repeat delay"
              value={a.repeatDelay}
              onCommit={(v) => edit((x) => ({ ...x, repeatDelay: Number(v) }))}
            />
          </div>
          <label className="motion-field">
            Easing
            <select
              aria-label="Animation easing"
              value={a.ease}
              onChange={(ev) =>
                edit((x) => ({
                  ...x,
                  ease: ev.target.value as MotionAnimation["ease"],
                }))
              }
            >
              {eases.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="motion-check">
            <input
              type="checkbox"
              checked={a.yoyo}
              onChange={(ev) =>
                edit((x) => ({ ...x, yoyo: ev.target.checked }))
              }
            />
            Yoyo
          </label>
          <h2>{key ? "Selected keyframe values" : "Animated properties"}</h2>
          {keys.map((p) => {
            const enabled =
              p in a.from ||
              p in a.to ||
              a.keyframes.some((k) => p in k.values);
            const defaultValue =
              p === "opacity" || p.startsWith("scale")
                ? 1
                : p === "transformOrigin"
                  ? "50% 50%"
                  : p === "clipPath"
                    ? "inset(0 0% 0 0)"
                    : 0;
            const value = (v: string) =>
              [
                "transformOrigin",
                "clipPath",
                "color",
                "backgroundColor",
                "filter",
              ].includes(p) || p.startsWith("--")
                ? v
                : Number.isFinite(Number(v))
                  ? Number(v)
                  : v;
            const set = (side: "from" | "to", v: string) =>
              edit((x) =>
                key
                  ? {
                      ...x,
                      keyframes: x.keyframes.map((k) =>
                        k.id === key.id
                          ? { ...k, values: { ...k.values, [p]: value(v) } }
                          : k,
                      ),
                    }
                  : {
                      ...x,
                      [side]: { ...x[side], [p]: value(v) },
                      keyframes: x.keyframes.map((k, i) =>
                        (
                          side === "from"
                            ? i === 0
                            : i === x.keyframes.length - 1
                        )
                          ? { ...k, values: { ...k.values, [p]: value(v) } }
                          : k,
                      ),
                    },
              );
            return (
              <div className="motion-property" key={p}>
                <label className="motion-check">
                  <input
                    aria-label={`Animate ${p}`}
                    type="checkbox"
                    checked={enabled}
                    onChange={(ev) =>
                      edit((x) => {
                        const from = { ...x.from },
                          to = { ...x.to };
                        if (ev.target.checked) {
                          from[p] = defaultValue;
                          to[p] = defaultValue;
                        } else {
                          delete from[p];
                          delete to[p];
                        }
                        return {
                          ...x,
                          from,
                          to,
                          keyframes: x.keyframes.map((k) => {
                            const values = { ...k.values };
                            if (ev.target.checked) values[p] = defaultValue;
                            else delete values[p];
                            return { ...k, values };
                          }),
                        };
                      })
                    }
                  />
                  {p}
                </label>
                {enabled &&
                  (key ? (
                    <Field
                      label={`${p} keyframe`}
                      value={key.values[p] ?? defaultValue}
                      onCommit={(v) => set("to", v)}
                    />
                  ) : (
                    <div className="motion-animation-numbers">
                      {a.mode !== "to" && (
                        <Field
                          label={`${p} initial`}
                          value={a.from[p] ?? defaultValue}
                          onCommit={(v) => set("from", v)}
                        />
                      )}{" "}
                      {a.mode !== "from" && (
                        <Field
                          label={`${p} final`}
                          value={a.to[p] ?? defaultValue}
                          onCommit={(v) => set("to", v)}
                        />
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
          {a.mode === "keyframes" && (
            <>
              <h2>Keyframes</h2>
              {a.keyframes.map((k) => (
                <button
                  key={k.id}
                  className={`button ${k.id === key?.id ? "primary" : ""}`}
                  onClick={() => e.choose(a.id, k.id)}
                >
                  {k.time.toFixed(3)}s
                </button>
              ))}
            </>
          )}
          {key && (
            <>
              <Field
                label="Keyframe time"
                value={key.time}
                onCommit={(v) =>
                  edit((x) => moveKeyframe(x, key.id, Number(v)))
                }
              />
              <label className="motion-field">
                Keyframe easing
                <select
                  aria-label="Keyframe easing"
                  value={key.ease ?? a.ease}
                  onChange={(ev) =>
                    edit((x) => ({
                      ...x,
                      keyframes: x.keyframes.map((k) =>
                        k.id === key.id
                          ? {
                              ...k,
                              ease: ev.target.value as MotionAnimation["ease"],
                            }
                          : k,
                      ),
                    }))
                  }
                >
                  {eases.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <button
                className="button"
                disabled={a.keyframes.length <= 1}
                onClick={() =>
                  edit((x) => ({
                    ...x,
                    keyframes: x.keyframes.filter((k) => k.id !== key.id),
                  }))
                }
              >
                Delete keyframe
              </button>
            </>
          )}
          <button
            className="button"
            onClick={() => {
              e.choose(a.id);
              e.addKey();
            }}
            disabled={e.test}
          >
            Add keyframe at playhead
          </button>
          <h2>Trigger</h2>
          <label className="motion-field">
            Trigger
            <select
              aria-label="Animation trigger"
              value={s.trigger.type}
              onChange={(ev) => {
                const type = ev.target.value;
                const target = a.target;
                trigger(
                  type === "load"
                    ? { type, delay: 0, once: true }
                    : type === "viewport"
                      ? {
                          type,
                          target,
                          threshold: 0.2,
                          rootMargin: "0px",
                          once: true,
                          reverseOnExit: false,
                        }
                      : type === "hover"
                        ? { type, target, leave: "reverse" }
                        : type === "click"
                          ? { type, target, action: "play" }
                          : {
                              type: "scroll",
                              target,
                              start: "top bottom",
                              end: "bottom top",
                              scrub: true,
                              pin: false,
                              toggleActions: "play none none reverse",
                              scrollContainer: null,
                            },
                );
              }}
            >
              {["load", "viewport", "scroll", "hover", "click"].map((v, i) => (
                <option key={v} value={v}>
                  {["On Load", "Viewport Entry", "Scroll", "Hover", "Click"][i]}
                </option>
              ))}
            </select>
          </label>
          {"target" in s.trigger && (
            <label className="motion-field">
              Trigger target
              <select
                aria-label="Trigger target"
                value={JSON.stringify(s.trigger.target)}
                onChange={(ev) => {
                  if ("target" in s.trigger)
                    trigger({
                      ...s.trigger,
                      target: JSON.parse(ev.target.value),
                    });
                }}
              >
                {targets.map((t) => (
                  <option
                    key={JSON.stringify(t.target)}
                    value={JSON.stringify(t.target)}
                  >
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {s.trigger.type === "load" && (
            <Field
              label="Load delay"
              value={s.trigger.delay}
              onCommit={(v) =>
                trigger({
                  ...s.trigger,
                  type: "load",
                  delay: Number(v),
                  once: s.trigger.type === "load" ? s.trigger.once : true,
                })
              }
            />
          )}
          {s.trigger.type === "viewport" && (
            <>
              <Field
                label="Viewport threshold"
                value={s.trigger.threshold}
                onCommit={(v) => {
                  if (s.trigger.type === "viewport")
                    trigger({ ...s.trigger, threshold: Number(v) });
                }}
              />
              <Field
                label="Viewport margin"
                value={s.trigger.rootMargin}
                onCommit={(v) => {
                  if (s.trigger.type === "viewport")
                    trigger({ ...s.trigger, rootMargin: v });
                }}
              />
              <label className="motion-check">
                <input
                  type="checkbox"
                  checked={s.trigger.once}
                  onChange={(ev) => {
                    if (s.trigger.type === "viewport")
                      trigger({ ...s.trigger, once: ev.target.checked });
                  }}
                />
                Once
              </label>
              <label className="motion-check">
                <input
                  type="checkbox"
                  checked={s.trigger.reverseOnExit}
                  onChange={(ev) => {
                    if (s.trigger.type === "viewport")
                      trigger({
                        ...s.trigger,
                        reverseOnExit: ev.target.checked,
                      });
                  }}
                />
                Reverse on exit
              </label>
            </>
          )}
          {s.trigger.type === "hover" && (
            <label className="motion-field">
              On leave
              <select
                aria-label="Hover leave"
                value={s.trigger.leave}
                onChange={(ev) => {
                  if (s.trigger.type === "hover")
                    trigger({
                      ...s.trigger,
                      leave: ev.target.value as "reverse" | "reset",
                    });
                }}
              >
                <option>reverse</option>
                <option>reset</option>
              </select>
            </label>
          )}
          {s.trigger.type === "click" && (
            <label className="motion-field">
              Click action
              <select
                aria-label="Click action"
                value={s.trigger.action}
                onChange={(ev) => {
                  if (s.trigger.type === "click")
                    trigger({
                      ...s.trigger,
                      action: ev.target.value as
                        "play" | "pause" | "reverse" | "toggle",
                    });
                }}
              >
                {["play", "pause", "reverse", "toggle"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          )}
          {s.trigger.type === "scroll" && (
            <>
              <Field
                label="Scroll start"
                value={s.trigger.start}
                onCommit={(v) => {
                  if (s.trigger.type === "scroll")
                    trigger({ ...s.trigger, start: v });
                }}
              />
              <Field
                label="Scroll end"
                value={s.trigger.end}
                onCommit={(v) => {
                  if (s.trigger.type === "scroll")
                    trigger({ ...s.trigger, end: v });
                }}
              />
              <label className="motion-check">
                <input
                  type="checkbox"
                  checked={s.trigger.scrub !== false}
                  onChange={(ev) => {
                    if (s.trigger.type === "scroll")
                      trigger({ ...s.trigger, scrub: ev.target.checked });
                  }}
                />
                Scrub with scroll
              </label>
              <Field
                label="Scroll smoothing (seconds)"
                value={
                  typeof s.trigger.scrub === "number" ? s.trigger.scrub : 0
                }
                onCommit={(v) => {
                  if (s.trigger.type === "scroll")
                    trigger({ ...s.trigger, scrub: Number(v) || true });
                }}
              />
              <label className="motion-check">
                <input
                  type="checkbox"
                  checked={s.trigger.pin}
                  onChange={(ev) => {
                    if (s.trigger.type === "scroll")
                      trigger({ ...s.trigger, pin: ev.target.checked });
                  }}
                />
                Pin
              </label>
              <Field
                label="Scroll toggle actions"
                value={s.trigger.toggleActions}
                onCommit={(v) => {
                  if (s.trigger.type === "scroll")
                    trigger({ ...s.trigger, toggleActions: v });
                }}
              />
              <p className="motion-muted">
                Use Test mode and scroll inside the scene preview.
              </p>
            </>
          )}
          {s.trigger.type === "scroll" && (
            <label className="motion-field">
              Scroll container
              <select
                aria-label="Scroll container"
                value={
                  s.trigger.scrollContainer
                    ? JSON.stringify(s.trigger.scrollContainer)
                    : ""
                }
                onChange={(ev) => {
                  if (s.trigger.type === "scroll")
                    trigger({
                      ...s.trigger,
                      scrollContainer: ev.target.value
                        ? JSON.parse(ev.target.value)
                        : null,
                    });
                }}
              >
                <option value="">Preview / page scrolling</option>
                {targets.map((t) => (
                  <option
                    key={JSON.stringify(t.target)}
                    value={JSON.stringify(t.target)}
                  >
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="button"
            onClick={() =>
              e.change((old) =>
                old
                  .map((s) => ({
                    ...s,
                    animations: s.animations.filter((x) => x.id !== a.id),
                  }))
                  .filter((s) => s.animations.length),
              )
            }
          >
            Delete animation
          </button>
        </>
      )}
      {e.error && (
        <p role="alert" className="motion-animation-error">
          {e.error}
        </p>
      )}
    </div>
  );
}
