import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { normalizeColor } from "../../features/animation/colors";
import { rgba } from "../../features/animation/runtime";
export function Icon({ name }: { name: string }) {
  return <i className={`bi bi-${name}`} aria-hidden="true" />;
}
export function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      className={`icon-button ${active ? "active" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className={`dialog ${wide ? "dialog-wide" : ""}`}
          aria-describedby={description ? "modal-description" : undefined}
        >
          <header className="dialog-header">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              {description && (
                <Dialog.Description id="modal-description">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" aria-label="Close dialog">
                <Icon name="x-lg" />
              </button>
            </Dialog.Close>
          </header>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  range = true,
  unit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  unit?: string;
}) {
  function change(s: string) {
    if (s.trim() === "") return;
    const n = Number(s);
    if (Number.isFinite(n))
      onChange(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n)));
  }
  return (
    <div className="number-control">
      <label>
        <span>
          {label}
          {unit && <small> {unit}</small>}
        </span>
        <input
          aria-label={label}
          type="number"
          value={Number(value.toFixed(4))}
          min={min}
          max={max}
          step={step}
          onChange={(e) => change(e.target.value)}
        />
      </label>
      {range && min !== undefined && max !== undefined && (
        <input
          aria-label={`${label} slider`}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => change(e.target.value)}
        />
      )}
    </div>
  );
}
export function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: { label: string; value: any }[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={String(value)}
        onChange={(e) =>
          onChange(
            options.find((o) => String(o.value) === e.target.value)?.value,
          )
        }
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  let pickerValue = "#888888";
  try {
    pickerValue =
      "#" +
      rgba(normalizeColor(value))
        .slice(0, 3)
        .map((v) =>
          Math.round(v * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
  } catch {
    /* Unsupported static CSS colors remain editable as text. */
  }
  return (
    <label className="color-control">
      <span>{label}</span>
      <div>
        <input
          aria-label={`${label} picker`}
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          aria-label={`${label} hex`}
          defaultValue={value}
          key={value}
          onBlur={(e) => {
            if (CSS.supports("color", e.target.value)) onChange(e.target.value);
            else e.target.value = value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </div>
    </label>
  );
}
