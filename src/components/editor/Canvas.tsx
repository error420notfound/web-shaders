import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import type { Project } from "../../features/compositions/schema";
import type { RenderStatus } from "../../features/renderer/ShaderRenderer";
import { RenderBoundary } from "../../features/renderer/RenderBoundary";
import { Icon, IconButton } from "../controls/Primitives";
import { workshopAssetUrl } from "../../features/assets";
const Renderer = lazy(() => import("../../features/renderer/ShaderRenderer"));
export function Canvas({
  project,
  playing,
  reduced,
  zoom,
  onZoom,
  onDevice,
  onStatus,
  forceFallback,
}: {
  project: Project;
  playing: boolean;
  reduced: boolean;
  zoom: number;
  onZoom: (n: number) => void;
  onDevice: (d: Project["preview"]["device"]) => void;
  onStatus: (s: RenderStatus) => void;
  forceFallback: boolean;
}) {
  const bounds = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 580 });
  const [status, setStatus] = useState<RenderStatus>("loading");
  const [reason, setReason] = useState("");
  const [retry, setRetry] = useState(0);
  const noWebGPU = !("gpu" in navigator);
  const [pageVisible, setPageVisible] = useState(
    () => document.visibilityState !== "hidden",
  );
  useEffect(() => {
    const fn = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []);
  const updateStatus = useCallback(
    (s: RenderStatus, r?: string) => {
      setStatus(s);
      setReason(r || "");
      onStatus(s);
    },
    [onStatus],
  );
  useEffect(() => {
    if (reduced) updateStatus("reduced");
    else if (forceFallback)
      updateStatus("unavailable", "Controlled fallback preview");
    else if (noWebGPU)
      updateStatus(
        "unavailable",
        "This browser does not support WebGPU. Editing and export remain available.",
      );
  }, [reduced, forceFallback, noWebGPU, updateStatus]);
  useEffect(() => {
    const o = new ResizeObserver((entries) => {
      const b = entries[0].contentRect;
      setSize({ w: b.width, h: b.height });
    });
    if (bounds.current) o.observe(bounds.current);
    return () => o.disconnect();
  }, []);
  const width =
    project.preview.device === "desktop"
      ? 960
      : project.preview.device === "tablet"
        ? 768
        : 390;
  const [a, b] = project.preview.ratio.split("/").map(Number),
    height = (width * b) / a;
  const fit = Math.min((size.w - 64) / width, (size.h - 80) / height, 1);
  const scale = zoom || Math.max(0.1, fit);
  const p = project.preview;
  const fallback =
    status === "unavailable" ||
    status === "error" ||
    reduced ||
    forceFallback ||
    noWebGPU;
  const compositionKey = project.id + ":" + retry;
  return (
    <main className="canvas-area">
      <header className="canvas-header">
        <div>
          <span className="canvas-label">LIVE PREVIEW</span>
          <span>
            {project.context === "website"
              ? "Website Section"
              : "Item Background"}
          </span>
        </div>
        <div className="device-switch" aria-label="Preview device">
          {(["desktop", "tablet", "mobile"] as const).map((d, i) => (
            <IconButton
              key={d}
              icon={["display", "tablet", "phone"][i]}
              label={`${d} preview`}
              active={p.device === d}
              onClick={() => onDevice(d)}
            />
          ))}
        </div>
      </header>
      <div ref={bounds} className="canvas-workspace">
        <div className="preview-dimensions">
          {width} × {Math.round(height)}{" "}
          <span> / {project.preview.ratio.replace("/", " : ")}</span>
        </div>
        <div
          className="preview-frame"
          style={{
            width,
            height,
            transform: `translate(-50%, -50%) scale(${scale})`,
            background: p.baseColor,
            color: p.textColor,
          }}
        >
          {!reduced && !forceFallback && !noWebGPU && pageVisible && (
            <RenderBoundary
              key={compositionKey}
              onError={(e) => updateStatus("error", e)}
            >
              <Suspense
                fallback={
                  <div className="render-loading">Loading shader engine…</div>
                }
              >
                <Renderer
                  layers={project.layers}
                  playing={playing}
                  onStatus={updateStatus}
                />
              </Suspense>
            </RenderBoundary>
          )}
          {project.context === "website" && p.showContent && (
            <div
              className={`sample-content align-${p.alignment} pos-${p.position}`}
              style={{
                padding: width <= 400 ? "32px" : "7%",
                pointerEvents: "none",
              }}
            >
              <h1
                style={{ fontSize: width <= 400 ? 38 : width <= 768 ? 48 : 58 }}
              >
                {p.heading}
              </h1>
              <p>{p.paragraph}</p>
              {p.cta && (
                <span className="sample-cta">
                  {p.cta}
                  <Icon name="arrow-up-right" />
                </span>
              )}
            </div>
          )}
          {project.context === "item" && (
            <img
              className="preview-object"
              src={workshopAssetUrl(p.image || "/sample-object.svg")}
              alt={
                p.imageName || "Neutral FORM sample object, a 2D preview image"
              }
              style={{
                height: `${p.imageScale}%`,
                left: `${p.imageX * 100}%`,
                top: `${p.imageY * 100}%`,
              }}
            />
          )}
        </div>
        {fallback && (
          <div className="fallback-note" role="status">
            <Icon name={reduced ? "pause-circle" : "exclamation-circle"} />
            <span>
              {reduced
                ? "Reduced motion · static preview"
                : status === "error"
                  ? "Renderer error · static background"
                  : "WebGPU unavailable · static background"}
              <small>
                {reason || "Composition editing and export remain available."}
              </small>
            </span>
            {status === "error" && (
              <button
                className="small-button"
                onClick={() => {
                  setRetry((n) => n + 1);
                  updateStatus("loading");
                }}
              >
                Retry
              </button>
            )}
          </div>
        )}
        {project.layers.length === 0 && (
          <span className="blank-canvas-label">
            Blank composition · add your first effect
          </span>
        )}
      </div>
      <footer className="canvas-footer">
        <span>
          <Icon name="bounding-box" />{" "}
          {project.context === "website"
            ? "Content is a preview aid"
            : "2D image preview"}
        </span>
        <div>
          <IconButton
            icon="dash"
            label="Zoom out"
            onClick={() => onZoom(Math.max(0.1, scale - 0.1))}
          />
          <select
            aria-label="Canvas zoom"
            value={zoom === 0 ? "fit" : String(zoom)}
            onChange={(e) =>
              onZoom(e.target.value === "fit" ? 0 : Number(e.target.value))
            }
          >
            <option value="fit">Fit canvas</option>
            {[...new Set([0.25, 0.5, 0.75, 1, 1.5, 2, ...(zoom ? [zoom] : [])])]
              .sort((a, b) => a - b)
              .map((n) => (
                <option key={n} value={String(n)}>
                  {Math.round(n * 100)}%
                </option>
              ))}
          </select>
          <IconButton
            icon="plus"
            label="Zoom in"
            onClick={() => onZoom(Math.min(2, scale + 0.1))}
          />
          <IconButton
            icon="arrows-fullscreen"
            label="Fit canvas"
            onClick={() => onZoom(0)}
          />
        </div>
      </footer>
    </main>
  );
}
