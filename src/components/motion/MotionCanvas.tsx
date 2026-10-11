import { useState } from "react";
import { createPortal } from "react-dom";
import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createMotionRuntime } from "../../features/motion/runtime";
import { resolvedSequences } from "../../features/motion/animations";
import { useMotionEditor } from "../../features/motion/editor";
import type { CSSProperties } from "react";
import {
  effectiveStyles,
  resolveInstance,
  renderedInstancePath,
} from "../../features/motion/commands";
import type {
  MotionNode,
  MotionProject,
  Scene,
} from "../../features/motion/schema";

function RenderNode({
  node,
  project,
  width,
  owner,
  instancePath,
  test,
  selected,
  onSelect,
}: {
  node: MotionNode;
  project: MotionProject;
  width: number;
  owner?: string;
  instancePath?: string;
  test: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const n = resolveInstance(node, project),
    selectionId = owner ?? node.id;
  const path = renderedInstancePath(node, project, instancePath);
  const style = effectiveStyles(n, width) as CSSProperties;
  const children = n.children.map((c) => (
    <RenderNode
      key={c.id}
      node={c}
      project={project}
      width={width}
      owner={node.kind === "instance" ? selectionId : owner}
      instancePath={path}
      test={test}
      selected={selected}
      onSelect={onSelect}
    />
  ));
  const Tag = {
    heading: "h2",
    paragraph: "p",
    text: "span",
    container: "div",
    group: "div",
    image: "img",
    button: "button",
    shape: "div",
    svg: "svg",
  }[n.type] as "div";
  const src = n.source.startsWith("asset:")
    ? project.assets.find((a) => a.id === n.source.slice(6))?.data
    : n.source;
  return (
    <Tag
      data-motion-select={selectionId}
      data-motion-id={n.id}
      data-motion-instance={path ?? ""}
      data-motion-base={JSON.stringify(style)}
      data-motion-selected={selected === selectionId || undefined}
      style={style}
      onClick={(e) => {
        if (test) return;
        e.preventDefault();
        e.stopPropagation();
        onSelect(selectionId);
      }}
      {...(n.type === "image" ? { src: src || undefined, alt: n.alt } : {})}
      {...(n.type === "button" ? { type: "button" as const } : {})}
      {...(n.type === "svg"
        ? { viewBox: "0 0 100 100", role: "img", "aria-label": n.alt || n.name }
        : {})}
    >
      {n.type === "image" ? undefined : n.type === "svg" ? (
        <path d={n.svgPath} fill="currentColor" />
      ) : (
        <>
          {n.content}
          {children}
        </>
      )}
    </Tag>
  );
}
export function MotionCanvas({
  project,
  scene,
  selected,
  onSelect,
  width,
  zoom,
  scroll,
}: {
  project: MotionProject;
  scene: Scene;
  selected: string | null;
  onSelect: (id: string) => void;
  width: number;
  zoom: number;
  scroll: boolean;
}) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const editor = useMotionEditor();
  const { sequences, test, runtime, tick, report } = editor;
  const session = useRef({ time: editor.time, playing: editor.playing });
  session.current = { time: editor.time, playing: editor.playing };
  const compiled = useMemo(
    () => resolvedSequences(scene.roots, sequences, project),
    [scene.roots, sequences, project],
  );
  useLayoutEffect(() => {
    if (!mount) return;
    try {
      for (const el of mount.querySelectorAll<HTMLElement>(
        "[data-motion-base]",
      )) {
        const styles = JSON.parse(el.dataset.motionBase!);
        el.style.cssText = Object.entries(styles)
          .map(
            ([k, v]) =>
              `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${typeof v === "number" && !["opacity", "zIndex", "fontWeight", "lineHeight"].includes(k) ? `${v}px` : v}`,
          )
          .join(";");
      }
      const engine = createMotionRuntime(
        mount,
        compiled,
        gsap,
        ScrollTrigger,
        test,
        tick,
      );
      runtime.current = engine;
      if (!test) {
        engine.seek(session.current.time);
        if (session.current.playing) engine.timeline.play();
      }
      report("");
      return () => {
        engine.destroy();
        runtime.current = null;
      };
    } catch (err) {
      report((err as Error).message);
    }
  }, [mount, compiled, test, runtime, tick, report, width]);
  return (
    <div className="motion-canvas-scroll">
      <div
        className="motion-frame-wrap"
        style={{ width: width * zoom, height: 660 * zoom }}
      >
        <iframe
          title="Motion scene preview"
          className="motion-frame"
          style={{ width, height: 660, transform: `scale(${zoom})` }}
          onLoad={(e) =>
            setMount(
              e.currentTarget.contentDocument!.getElementById("motion-root"),
            )
          }
          srcDoc={
            '<!doctype html><html><head><style>html,body{height:100%;overflow:hidden}#motion-root{height:100%;overflow:auto}body{margin:0;font:16px/1.5 system-ui;color:#30313b;background:white}*{box-sizing:border-box}h2,p{margin:0}img{max-width:100%;min-height:40px}svg{width:100px;height:100px}button{font:inherit;cursor:pointer;border:0} [data-motion-select]{cursor:pointer} [data-motion-select]:hover{outline:1px dashed #5b62e5;outline-offset:2px}[data-motion-selected]{outline:2px solid #5b62e5;outline-offset:3px}.spacer{height:70vh;display:grid;place-content:center;background:#efefef;color:#777}</style></head><body><div id="motion-root" data-motion-scroller></div></body></html>'
          }
        />
        {mount &&
          createPortal(
            <>
              {(scroll ||
                (test &&
                  compiled.some(
                    (s) =>
                      s.trigger.type === "scroll" ||
                      s.trigger.type === "viewport",
                  ))) && <div className="spacer">Scroll to test the scene</div>}
              <section>
                {scene.roots.map((n) => (
                  <RenderNode
                    key={n.id}
                    node={n}
                    project={project}
                    width={width}
                    selected={selected}
                    onSelect={onSelect}
                    test={test}
                  />
                ))}
              </section>
              {(scroll || test) && <div className="spacer">End of scene</div>}
            </>,
            mount,
          )}
      </div>
    </div>
  );
}
