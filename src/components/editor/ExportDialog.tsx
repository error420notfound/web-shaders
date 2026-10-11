import { useState, useMemo } from "react";
import type { Project } from "../../features/compositions/schema";
import { generateCode, download } from "../../features/export/code";
import { Modal, Icon } from "../controls/Primitives";
export function ExportDialog({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
}) {
  const [tab, setTab] = useState<"react" | "json">("react");
  const [section, setSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const generated = useMemo(
    () =>
      open
        ? generateCode(project, section)
        : { code: "", css: "", warnings: [] },
    [open, project, section],
  );
  const text = useMemo(
    () =>
      !open
        ? ""
        : tab === "react"
          ? generated.code
          : JSON.stringify(project, null, 2) + "\n",
    [open, tab, generated.code, project],
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export composition"
      description="Take your composition into another project."
      wide
    >
      <div className="export-options">
        <div className="segmented">
          <button
            className={tab === "react" ? "active" : ""}
            onClick={() => setTab("react")}
          >
            React / TypeScript
          </button>
          <button
            className={tab === "json" ? "active" : ""}
            onClick={() => setTab("json")}
          >
            Project JSON
          </button>
        </div>
        {tab === "react" && project.context === "website" && (
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={section}
              onChange={(e) => setSection(e.target.checked)}
            />{" "}
            Include section content
          </label>
        )}
      </div>
      {generated.warnings.map((w) => (
        <p className="notice" key={w}>
          {w}
        </p>
      ))}
      <pre className="code-output" tabIndex={0}>
        <code>{text}</code>
      </pre>
      {tab === "react" && (
        <details className="css-export">
          <summary>CSS sizing example · shader-composition.css</summary>
          <pre>
            <code>{generated.css}</code>
          </pre>
          <button
            className="small-button"
            onClick={() =>
              download("shader-composition.css", generated.css, "text/css")
            }
          >
            Download CSS
          </button>
        </details>
      )}
      <footer className="dialog-actions">
        <span>
          {tab === "react"
            ? "Verified package API · shader composition independent of preview"
            : "Schema version 2 · animation and uploaded images embedded"}
        </span>
        <button
          className="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              setError(
                "Clipboard unavailable. Select the code and copy it manually.",
              );
            }
          }}
        >
          <Icon name={copied ? "check2" : "clipboard"} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          className="button primary"
          onClick={() =>
            download(
              tab === "react"
                ? "ShaderComposition.tsx"
                : `${project.name.replace(/[^a-z0-9-]/gi, "-")}.shader.json`,
              text,
              tab === "react" ? "text/plain" : "application/json",
            )
          }
        >
          <Icon name="download" />
          Download {tab === "react" ? "TSX" : "JSON"}
        </button>
      </footer>
      {error && (
        <p className="control-error" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
