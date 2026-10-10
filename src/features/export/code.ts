import { flatten } from "../compositions/schema";
import type { Project, Layer } from "../compositions/schema";
import { effects } from "../../data/registry";
export function codeWarnings(project: Project): string[] {
  const nodes = flatten(project.layers);
  return [
    ...new Set(
      nodes.flatMap((l) =>
        !effects[l.type]
          ? [
              `Custom component ${l.type}: its registered definition/source must also be exported. Code export is blocked until it is available.`,
            ]
          : Object.values(l.props).some(
                (v) => typeof v === "string" && v.startsWith("/"),
              )
            ? [
                `${l.name}: copy the local asset into the consuming site's public directory.`,
              ]
            : [],
      ),
    ),
  ];
}
export function generateCode(
  project: Project,
  includeSection = false,
): { code: string; css: string; warnings: string[] } {
  const warnings = codeWarnings(project);
  if (flatten(project.layers).some((l) => !effects[l.type]))
    return {
      code: "// Export blocked: custom component source is required.\n",
      css: "",
      warnings,
    };
  const names = [...new Set(flatten(project.layers).map((l) => l.type))].sort();
  function render(l: Layer, depth: number): string {
    const indent = "  ".repeat(depth);
    const props: Record<string, any> = {
      id: l.id,
      visible: l.visible,
      ...l.modifiers,
      ...l.props,
    };
    const attrs = Object.entries(props)
      .filter(([k]) => !(k in l.drivers))
      .map(([k, v]) => `${k}={${JSON.stringify(v)}}`);
    for (const [k, d] of Object.entries(l.drivers))
      attrs.push(`${k}={${JSON.stringify(d.config)}}`);
    return `${indent}<${l.type}${attrs.length ? "\n" + attrs.map((a) => indent + "  " + a).join("\n") : ""}${l.children.length ? ">\n" + l.children.map((c) => render(c, depth + 1)).join("\n") + "\n" + indent + `</${l.type}>` : " />"}`;
  }
  const section = includeSection && project.context === "website";
  const code = `import { useEffect, useState } from 'react';
import { Shader${names.length ? ", " + names.join(", ") : ""} } from 'shaders/react';
import './shader-composition.css';

// Verified against shaders@4.0.4. Requires a browser with WebGPU.
// Reduced motion uses the static, accessible fallback rather than native animation.
export default function ShaderComposition() {
  const [unavailable, setUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <${section ? "section" : "div"} className="shader-composition" style={{ background: ${JSON.stringify(project.preview.baseColor)}, color: ${JSON.stringify(project.preview.textColor)} }}>
      {!reducedMotion && !unavailable && (
        <Shader disableTelemetry className="shader-composition__effect" onUnavailable={() => setUnavailable(true)}>
${project.layers.map((l) => render(l, 5)).join("\n")}
        </Shader>
      )}
      {(unavailable || reducedMotion) && <span className="shader-composition__sr">Static visual background</span>}
${
  section && project.preview.showContent
    ? `      <div className="shader-composition__content" style={{ textAlign: ${JSON.stringify(project.preview.alignment)} }}>
        <h1>{${JSON.stringify(project.preview.heading)}}</h1>
        <p>{${JSON.stringify(project.preview.paragraph)}}</p>
        {/* Preview CTA: connect this label to your site's destination or action. */}
        <span className="shader-composition__cta">{${JSON.stringify(project.preview.cta)}}</span>
      </div>\n`
    : ""
}    </${section ? "section" : "div"}>
  );
}
`;
  const css = `.shader-composition { position: relative; width: 100%; aspect-ratio: ${project.preview.ratio}; min-height: 280px; overflow: hidden; }
.shader-composition__effect { position: absolute; inset: 0; width: 100%; height: 100%; }
.shader-composition__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
${
  section
    ? `.shader-composition__content { position: absolute; inset: 0; box-sizing: border-box; z-index: 1; display: flex; flex-direction: column; justify-content: ${project.preview.position === "top" ? "flex-start" : project.preview.position === "bottom" ? "flex-end" : "center"}; align-items: ${project.preview.alignment === "center" ? "center" : project.preview.alignment === "right" ? "flex-end" : "flex-start"}; padding: clamp(24px, 6vw, 80px); white-space: pre-line; }
.shader-composition__content h1 { font: 500 clamp(32px, 5vw, 64px)/1.1 system-ui; margin: 0 0 24px; }
.shader-composition__content p { font: 400 16px/1.6 system-ui; max-width: 40ch; }
.shader-composition__cta { font: inherit; padding: 12px 20px; border: 1px solid currentColor; }\n`
    : ""
}`;
  return { code, css, warnings };
}
export function download(name: string, text: string, type = "text/plain") {
  const u = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
