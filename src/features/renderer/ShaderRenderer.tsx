import { createElement, useEffect, useMemo } from "react";
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
    props[key] = playing ? d.config : d.rest;
  for (const [key, value] of Object.entries(props))
    if (typeof value === "string") props[key] = workshopAssetUrl(value);
  return props;
}
function node(l: Layer, playing: boolean): ReactElement {
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
    },
    l.children.map((c) => node(c, playing)),
  );
}
export default function ShaderRenderer({
  layers,
  playing,
  onStatus,
}: {
  layers: Layer[];
  playing: boolean;
  onStatus: (s: RenderStatus, reason?: string) => void;
}) {
  useEffect(() => {
    onStatus("loading");
  }, [onStatus]);
  const children = useMemo(
    () => layers.map((l) => node(l, playing)),
    [layers, playing],
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
