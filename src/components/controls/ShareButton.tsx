import { useEffect, useState } from "react";
import { IconButton, Modal } from "./Primitives";

const appUrl = "https://error420notfound.github.io/web-shaders/";

export function ShareButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState(false);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  async function share() {
    setBusy(true);
    setMessage("");
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Shader Workshop",
            text: "Create shader compositions in your browser.",
            url: appUrl,
          });
          setMessage("App link shared");
          return;
        } catch (error) {
          // Cancelling the native share sheet is a normal user action.
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      try {
        await navigator.clipboard.writeText(appUrl);
        setMessage("App link copied");
      } catch {
        setManualCopy(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="share-control">
      <IconButton
        icon="share"
        label="Share app"
        disabled={busy}
        onClick={() => void share()}
      />
      {message && (
        <div className="share-feedback" role="status">
          {message}
        </div>
      )}
      <Modal
        open={manualCopy}
        onClose={() => setManualCopy(false)}
        title="Share Shader Workshop"
        description="Copy this link to share the app."
      >
        <input
          className="share-url"
          aria-label="App link"
          value={appUrl}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
      </Modal>
    </div>
  );
}
