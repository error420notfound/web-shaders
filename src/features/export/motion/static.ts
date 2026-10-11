import type {
  Definition,
  MotionNode,
  MotionProject,
  Parameter,
  Styles,
} from "../../motion/schema";
import { parseMotionProject } from "../../motion/schema";
import { resolveInstance, renderedInstancePath } from "../../motion/commands";
import { resolvedSequences } from "../../motion/animations";
import { createMotionRuntime } from "../../motion/runtime.js";
export interface ExportFile {
  path: string;
  content: string | Uint8Array;
}
const escape = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const literal = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
const token = (v: string) =>
  Array.from(v, (c) => c.codePointAt(0)!.toString(16)).join("-");
const kebab = (v: string) => v.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const cssValue = (key: string, value: string | number) =>
  typeof value === "number" &&
  !["opacity", "zIndex", "fontWeight", "lineHeight"].includes(key)
    ? `${value}px`
    : String(value);
export function exportStaticMotion(
  input: MotionProject,
  id: string,
  component = false,
): ExportFile[] {
  const p = parseMotionProject(input),
    astro = p.export.target === "astro";
  const d: Definition | undefined = component
    ? p.components.find((d) => d.id === id)
    : undefined;
  const scene = p.scenes.find((s) => s.id === id);
  if (!d && !scene) throw new Error("Export target is missing");
  const roots = d ? [d.root] : scene!.roots;
  const sequences = resolvedSequences(
    roots,
    d?.sequences ?? scene!.sequences,
    p,
  );
  if (
    sequences.some((s) =>
      s.animations.some((a) => a.split !== "none" || a.stagger !== 0),
    )
  )
    throw new Error(
      "Text splitting and stagger are not supported. Export JSON to retain these options.",
    );
  const animated = sequences.length > 0;
  const parameters = d?.parameters ?? [];
  const files: ExportFile[] = [],
    css: string[] = [];
  const scope = `motion-${token(id)}`;
  function source(url: string): string {
    if (!url.startsWith("asset:")) return url;
    const asset = p.assets.find((a) => a.id === url.slice(6));
    if (!asset) throw new Error("Missing asset");
    const ext = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
    }[asset.mime];
    const name = `${token(asset.id)}.${ext}`,
      path = `public/motion-assets/${name}`;
    if (!files.some((f) => f.path === path))
      files.push({
        path,
        content: Uint8Array.from(atob(asset.data.split(",")[1]), (c) =>
          c.charCodeAt(0),
        ),
      });
    return `/motion-assets/${name}`;
  }
  const propDefault = (param: Parameter) =>
    param.property === "source"
      ? source(String(param.defaultValue))
      : param.defaultValue;
  function declarations(styles: Styles, nodeId: string, base = false) {
    const entries = new Map(Object.entries(styles));
    if (base)
      for (const param of parameters.filter(
        (p) =>
          p.targetId === nodeId && !["source", "content"].includes(p.property),
      ))
        entries.set(param.property, param.defaultValue);
    return [...entries]
      .map(([key, value]) => {
        const param =
          base && astro
            ? parameters.find(
                (p) => p.targetId === nodeId && p.property === key,
              )
            : undefined;
        return `${kebab(key)}:${param ? `var(--motion-${token(param.id)},${cssValue(key, value)})` : cssValue(key, value)}`;
      })
      .join(";");
  }
  function text(value: string) {
    return astro ? `{${literal(value)}}` : escape(value);
  }
  let index = 0;
  function render(node: MotionNode, instancePath = ""): string {
    const n = resolveInstance(node, p),
      className = `element-${++index}`,
      selector = `.${scope} .${className}`;
    const path = renderedInstancePath(node, p, instancePath);
    const attributes = `data-motion-id="${escape(n.id)}" data-motion-instance="${escape(path)}"`;
    css.push(`${selector}{${declarations(n.styles, n.id, true)}}`);
    if (Object.keys(n.responsive.tablet).length)
      css.push(
        `@media(max-width:1024px){${selector}{${declarations(n.responsive.tablet, n.id)}}}`,
      );
    if (Object.keys(n.responsive.mobile).length)
      css.push(
        `@media(max-width:640px){${selector}{${declarations(n.responsive.mobile, n.id)}}}`,
      );
    const param = parameters.find(
      (param) => param.targetId === n.id && param.property === "content",
    );
    const content =
      astro && param
        ? `{${param.name}}`
        : text(param?.defaultValue.toString() ?? n.content);
    const tag = {
      heading: "h2",
      paragraph: "p",
      text: "span",
      container: "div",
      group: "div",
      button: "button",
      image: "img",
      shape: "div",
      svg: "svg",
    }[n.type];
    if (n.type === "image") {
      const imageParam = parameters.find(
        (param) => param.targetId === n.id && param.property === "source",
      );
      const url = source(String(imageParam?.defaultValue ?? n.source));
      // Public assets account for Astro's configured deployment base.
      const src = astro
        ? imageParam
          ? `src={${imageParam.name}.startsWith('/motion-assets/') ? import.meta.env.BASE_URL + ${imageParam.name}.slice(1) : ${imageParam.name}}`
          : `src={${url.startsWith("/motion-assets/") ? `import.meta.env.BASE_URL + ${JSON.stringify(url.slice(1))}` : JSON.stringify(url)}}`
        : `src="${escape(url)}"`;
      return `<img class="${className}" ${attributes} ${src} alt=${astro ? `{${JSON.stringify(n.alt)}}` : `"${escape(n.alt)}"`} />`;
    }
    if (n.type === "svg")
      return `<svg class="${className}" ${attributes} viewBox="0 0 100 100" role="img" aria-label=${astro ? `{${JSON.stringify(n.alt || n.name)}}` : `"${escape(n.alt || n.name)}"`}><path d="${escape(n.svgPath)}" fill="currentColor" /></svg>`;
    return `<${tag} class="${className}" ${attributes}${n.type === "button" ? ' type="button"' : ""}>${content}${n.children.map((c) => render(c, path)).join("\n")}</${tag}>`;
  }
  const markup = roots.map((n) => render(n)).join("\n");
  const documentAttribute = animated
    ? ` data-motion-export data-motion-sequences=${astro ? `{${literal(JSON.stringify(sequences))}}` : `"${escape(JSON.stringify(sequences))}"`}`
    : "";
  const styleParameters = parameters.filter(
    (p) => !["content", "source"].includes(p.property),
  );
  const inline =
    astro && styleParameters.length
      ? ` style={{${styleParameters.map((p) => `${JSON.stringify(`--motion-${token(p.id)}`)}: ${typeof p.defaultValue === "number" && !["opacity", "zIndex", "fontWeight", "lineHeight"].includes(p.property) ? `String(${p.name}) + 'px'` : `String(${p.name})`}`).join(",")}}}`
      : "";
  if (astro) {
    const props = parameters.length
      ? `export interface Props {\n${parameters.map((p) => `  ${p.name}?: ${typeof p.defaultValue};`).join("\n")}\n}\nconst { ${parameters.map((p) => `${p.name} = ${literal(propDefault(p))}`).join(", ")} } = Astro.props;\n`
      : "";
    files.push({
      path: "MotionComponent.astro",
      content: `---\nimport './motion.css';\n${props}---\n<section class="${scope}"${inline}${documentAttribute}>\n${markup}\n</section>\n${animated ? "<script>import './motion-init.js';</script>\n" : ""}`,
    });
  } else
    files.push({
      path: "index.html",
      content: `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(d?.name ?? scene!.name)}</title><link rel="stylesheet" href="motion.css"></head><body><section class="${scope}"${documentAttribute}>${markup}</section>${animated ? '<script type="module" src="./motion-init.js"></script>' : ""}</body></html>`,
    });
  css.unshift(
    `.${scope}{font-family:system-ui,sans-serif} .${scope} *{box-sizing:border-box} .${scope} h2,.${scope} p{margin:0} .${scope} img{max-width:100%} .${scope} button{font:inherit;cursor:pointer} .${scope} button:focus-visible{outline:2px solid currentColor;outline-offset:4px} .${scope} svg{width:100px;height:100px}`,
  );
  files.push({ path: "motion.css", content: css.join("\n") });
  if (animated) {
    files.push({
      path: "motion-runtime.js",
      content: `export const createMotionRuntime = ${createMotionRuntime.toString()};\n`,
    });
    files.push({
      path: "motion-init.js",
      content: `import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMotionRuntime } from './motion-runtime.js';
// One lifecycle registry per page, even when different exported bundles are present.
const registry = window.__motionExports ||= new Map();
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
function initialize() {
  for (const root of document.querySelectorAll('[data-motion-export]')) {
    if(registry.has(root) || media.matches) continue;
    const runtime = createMotionRuntime(root, JSON.parse(root.dataset.motionSequences), gsap, ScrollTrigger, true);
    registry.set(root, runtime);
    root.motionRuntime = runtime;
  }
}
function dispose() { for(const [root,runtime] of registry){runtime.destroy();delete root.motionRuntime;} registry.clear(); }
document.addEventListener('astro:page-load', initialize);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', initialize);
media.addEventListener('change', () => { dispose(); initialize(); });
initialize();
`,
    });
    if (!astro)
      files.push({
        path: "package.json",
        content: JSON.stringify(
          {
            private: true,
            type: "module",
            scripts: {
              dev: "vite --host 127.0.0.1",
              build: "vite build",
              preview: "vite preview --host 127.0.0.1",
            },
            dependencies: { gsap: "^3.15.0" },
            devDependencies: { vite: "^7.1.0" },
          },
          null,
          2,
        ),
      });
  }
  files.push({
    path: "README.md",
    content: `# Motion export\n\n${animated ? "This export uses GSAP and ScrollTrigger with the same sequence compiler as the editor. Run npm install gsap in your Astro project; keep both motion JavaScript files beside the component and CSS. Vanilla output includes package.json: run npm install, npm run dev, and npm run build." : "This export contains static semantic markup and responsive styles with no runtime dependency."} No React hydration is required.\n\n${astro ? "Copy MotionComponent.astro and motion.css into the same src/components directory. Merge public/ into the Astro project's public/ directory. Import MotionComponent.astro in a page; it supports multiple instances and explicitly exposed props." : "Serve index.html and motion.css, and merge public/ into the web server's root directory. Props are resolved to defaults in vanilla output."}\n\nAnimations are scoped to each component root and cleaned up on Astro navigation. Reduced motion and JavaScript-disabled users see base styles. Remote images retain their network dependency.\n`,
  });
  return files;
}
