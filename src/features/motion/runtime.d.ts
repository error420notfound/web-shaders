import type { MotionAnimation, Sequence, Target } from "./schema";
import type { gsap } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
export interface MotionRuntime {
  timeline: gsap.core.Timeline;
  timelines: Map<string, gsap.core.Timeline>;
  duration: number;
  resolve: (t: Target) => HTMLElement | undefined;
  seek: (time: number, sequenceId?: string) => void;
  sample: (a: MotionAnimation) => MotionAnimation["from"];
  endpoints: (a: MotionAnimation) => {
    initial: MotionAnimation["from"];
    final: MotionAnimation["to"];
  };
  destroy: () => void;
}
export function createMotionRuntime(
  root: HTMLElement,
  sequences: Sequence[],
  engine: typeof gsap,
  scrollPlugin: typeof ScrollTrigger,
  test?: boolean,
  onUpdate?: (time: number, playing: boolean) => void,
): MotionRuntime;
