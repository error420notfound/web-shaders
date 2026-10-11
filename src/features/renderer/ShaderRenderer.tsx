import { createElement, useEffect, useMemo, memo } from "react";
import { AnimationPlayback, useLayerValues } from "../animation/playback";
import { animationProps } from "../animation/runtime";
import * as Shaders from "shaders/react";
import type { ComponentType, ReactElement } from "react";
import type { Layer } from "../compositions/schema";
import { effects } from "../../data/registry";
import { workshopAssetUrl } from "../assets";
export type RenderStatus =
  "loading" | "ready" | "unavailable" | "error" | "reduced";
export function resolveProps(
  layer: Layer,
  playing: boolean,
): Record<string, any> {
  const props = { ...layer.props };
  for (const [key, d] of Object.entries(layer.drivers))
    props[key] = playing && d.enabled !== false ? d.config : d.rest;
  for (const [key, value] of Object.entries(props))
    if (typeof value === "string") props[key] = workshopAssetUrl(value);
  return props;
}
const AnimatedNode = memo(function AnimatedNode({
  layer: l,
  playing,
  playback,
}: {
  layer: Layer;
  playing: boolean;
  playback: AnimationPlayback;
}): ReactElement {
  const values = useLayerValues(playback, l.id);
  const overrides = animationProps(values);
  const Component = (Shaders as unknown as Record<string, ComponentType<any>>)[
    l.type
  ];
  if (!Component || !effects[l.type])
    throw new Error(`Component ${l.type} is unavailable`);
  return createElement(
    Component,
    {
      key: l.id,
      id: l.id,
      visible: l.visible,
      ...l.modifiers,
      ...resolveProps(l, playing),
      ...overrides,
      transform: {
        ...l.modifiers.transform,
        ...((overrides.transform as object) ?? {}),
      },
    },
    l.children.map((c) =>
      createElement(AnimatedNode, { key: c.id, layer: c, playing, playback }),
    ),
  );
});
export default function ShaderRenderer({
  layers,
  playing,
  onStatus,
  playback,
}: {
  layers: Layer[];
  playing: boolean;
  playback: AnimationPlayback;
  onStatus: (s: RenderStatus, reason?: string) => void;
}) {
  useEffect(() => {
    onStatus("loading");
  }, [onStatus]);
  const children = useMemo(
    () =>
      layers.map((l) =>
        createElement(AnimatedNode, { key: l.id, layer: l, playing, playback }),
      ),
    [layers, playing, playback],
  );
  return (
    <Shaders.Shader
      disableTelemetry
      className="shader-surface"
      onReady={() => onStatus("ready")}
      onUnavailable={(reason) => onStatus("unavailable", String(reason))}
    >
      {children}
    </Shaders.Shader>
  );
}
