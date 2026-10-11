import { Activity, lazy, Suspense, useState } from "react";
import ShaderWorkspace from "./workspaces/ShaderWorkspace";
const MotionWorkspace = lazy(() => import("./workspaces/MotionWorkspace"));
export default function App() {
  const [workspace, setWorkspace] = useState<"shader" | "motion">("shader");
  const [motionVisited, setMotionVisited] = useState(false);
  function openMotion() {
    setMotionVisited(true);
    setWorkspace("motion");
  }
  return (
    <>
      <Activity mode={workspace === "shader" ? "visible" : "hidden"}>
        <ShaderWorkspace onSwitch={openMotion} />
      </Activity>
      {motionVisited && (
        <Activity mode={workspace === "motion" ? "visible" : "hidden"}>
          <Suspense fallback={<p role="status">Opening Motion Designer…</p>}>
            <MotionWorkspace onSwitch={() => setWorkspace("shader")} />
          </Suspense>
        </Activity>
      )}
    </>
  );
}
