import { effects } from "./registry";
import { emptyAnimation } from "../features/animation/runtime";
import type { Project, Layer } from "../features/compositions/schema";
export function makeLayer(
  type: string,
  props: Record<string, any> = {},
  children: Layer[] = [],
): Layer {
  return {
    id: crypto.randomUUID(),
    name: type.replace(/([a-z])([A-Z])/g, "$1 $2"),
    type,
    visible: true,
    props,
    drivers: {},
    modifiers: { opacity: 1, blendMode: "normal" },
    children,
  };
}
export const starterNames = [
  "Quiet Gradient Field",
  "Fine Grain & Colour Wash",
  "Soft Refractive Glass",
  "Slow Atmospheric Movement",
  "High-Contrast Editorial",
  "Product Spotlight",
];
export function createProject(starter = -1): Project {
  const grad = () =>
    makeLayer("LinearGradient", {
      colorA: "#f3d3ba",
      colorB: "#b9bbc9",
      angle: 125,
      colorSpace: "oklch",
    });
  let layers: Layer[] = [];
  if (starter === 0) layers = [grad()];
  if (starter === 1)
    layers = [
      makeLayer("FilmGrain", { strength: 0.12, bias: 0.6, animated: false }, [
        makeLayer("FractalNoise", {
          colorA: "#efd0bc",
          colorB: "#565b82",
          detail: 2,
          speed: 0.1,
        }),
      ]),
    ];
  if (starter === 2)
    layers = [
      makeLayer(
        "Glass",
        {
          refraction: 0.35,
          aberration: 0.08,
          blur: 2,
          shape: '{"type":"sphere3D","radius":0.35}',
        },
        [grad()],
      ),
    ];
  if (starter === 3) {
    const l = grad();
    l.drivers.angle = {
      rest: 125,
      config: {
        type: "auto-animate",
        mode: "ping-pong",
        outputMin: 110,
        outputMax: 150,
        speed: 0.035,
        easing: "sine",
      },
    };
    layers = [
      l,
      makeLayer("Aurora", {
        colorA: "#705f98",
        colorB: "#cbb49e",
        colorC: "#879aac",
        speed: 0.3,
        intensity: 25,
      }),
    ];
  }
  if (starter === 4)
    layers = [
      makeLayer("LinearGradient", {
        colorA: "#10151b",
        colorB: "#6a6558",
        angle: 160,
      }),
    ];
  if (starter === 5)
    layers = [
      makeLayer("RadialGradient", {
        colorA: "#ecded0",
        colorB: "#777e91",
        radius: 0.8,
        colorSpace: "oklch",
      }),
    ];
  // Explicit preset overrides are checked by the same import validator as user projects.
  for (const l of layers)
    if (!effects[l.type])
      throw new Error(`Unavailable starter component ${l.type}`);
  const now = new Date().toISOString();
  return {
    schemaVersion: 2,
    animation: emptyAnimation(),
    id: crypto.randomUUID(),
    name: starter < 0 ? "Untitled Composition" : starterNames[starter],
    createdAt: now,
    updatedAt: now,
    context: starter === 5 ? "item" : "website",
    preview: {
      baseColor: "#dfd9d1",
      textColor: starter === 4 ? "#ffffff" : "#292938",
      heading:
        starter === 4
          ? "Ideas with an edge."
          : "A little atmosphere.\nA different perspective.",
      paragraph:
        "An exploration of colour, texture and movement.\nMade for the moments that deserve a closer look.",
      cta: "Explore our work",
      showContent: true,
      alignment: "left",
      position: "center",
      device: "desktop",
      ratio: "16/9",
      image: null,
      imageName: null,
      imageScale: 70,
      imageX: 0.5,
      imageY: 0.5,
    },
    layers,
  };
}
