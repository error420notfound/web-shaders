// Dependency-injected so the exact same compiler runs in the editor and exports.
export function createMotionRuntime(
  root,
  sequences,
  gsap,
  ScrollTrigger,
  test = false,
  onUpdate = () => {},
) {
  gsap.registerPlugin(ScrollTrigger);
  const cleanups = [],
    timelines = new Map();
  const resolve = (t) =>
    [...root.querySelectorAll("[data-motion-id]")].find(
      (el) =>
        el.dataset.motionId === t.elementId &&
        (el.dataset.motionInstance || "") ===
          (t.kind === "instance" ? t.instanceId : ""),
    );
  for (const s of sequences)
    for (const a of s.animations) {
      if (a.split !== "none" || a.stagger !== 0)
        throw new Error(
          "Text splitting and stagger are not supported in this release. Set split to none and stagger to 0.",
        );
      if (!resolve(a.target))
        throw new Error("Animation target could not be rendered");
    }
  const bases = new Map(
    sequences.flatMap((s) =>
      s.animations.map((a) => [
        a.id,
        Object.fromEntries(
          [
            ...new Set([
              ...Object.keys(a.from),
              ...Object.keys(a.to),
              ...a.keyframes.flatMap((k) => Object.keys(k.values)),
            ]),
          ].map((k) => [k, gsap.getProperty(resolve(a.target), k)]),
        ),
      ]),
    ),
  );
  const context = gsap.context(() => {}, root);
  let master;
  try {
    context.add(() => {
      master = gsap.timeline({
        paused: true,
        onUpdate: () => onUpdate(master.time(), !master.paused()),
        onComplete: () => onUpdate(master.time(), false),
      });
      for (const s of sequences) {
        const tl = gsap.timeline({ paused: true });
        timelines.set(s.id, tl);
        for (const [label, time] of Object.entries(s.labels))
          tl.addLabel(label, time);
        for (const a of s.animations) {
          const el = resolve(a.target),
            position = a.at + a.delay;
          const options = {
            duration: a.duration,
            ease: a.ease,
            repeat: a.repeat,
            repeatDelay: a.repeatDelay,
            yoyo: a.yoyo,
            immediateRender: false,
          };
          if (a.mode === "from")
            tl.from(el, { ...a.from, ...options }, position);
          else if (a.mode === "to")
            tl.to(el, { ...a.to, ...options }, position);
          else if (a.mode === "fromTo")
            tl.fromTo(el, { ...a.from }, { ...a.to, ...options }, position);
          else {
            const child = gsap.timeline({
              repeat: a.repeat,
              repeatDelay: a.repeatDelay,
              yoyo: a.yoyo,
            });
            let previous = 0;
            for (const k of a.keyframes) {
              if (k.time === 0) child.set(el, { ...k.values }, 0);
              else
                child.to(
                  el,
                  {
                    ...k.values,
                    duration: k.time - previous,
                    ease: k.ease ?? a.ease,
                  },
                  previous,
                );
              previous = k.time;
            }
            if (previous < a.duration)
              child.to({}, { duration: a.duration - previous }, previous);
            tl.add(child, position);
          }
        }
        if (!test) {
          if (s.trigger.type !== "scroll")
            master.add(tl, s.trigger.type === "load" ? s.trigger.delay : 0);
          tl.paused(s.trigger.type === "scroll");
          continue;
        }
        const t = s.trigger,
          target = "target" in t ? resolve(t.target) : null;
        if (t.type === "load") {
          const call = gsap.delayedCall(t.delay, () => tl.play(0));
          cleanups.push(() => call.kill());
        } else if (t.type === "hover" && target) {
          const enter = () => tl.play(),
            leave = () => (t.leave === "reverse" ? tl.reverse() : tl.pause(0));
          target.addEventListener("mouseenter", enter);
          target.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            target.removeEventListener("mouseenter", enter);
            target.removeEventListener("mouseleave", leave);
          });
        } else if (t.type === "click" && target) {
          const click = () => {
            if (t.action === "play") tl.restart();
            else if (t.action === "pause") tl.pause();
            else if (t.action === "reverse") tl.reverse();
            else if (tl.paused()) tl.play();
            else tl.pause();
          };
          target.addEventListener("click", click);
          cleanups.push(() => target.removeEventListener("click", click));
        } else if (t.type === "viewport" && target) {
          const Observer = root.ownerDocument.defaultView.IntersectionObserver;
          const observer = new Observer(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  tl.play();
                  if (t.once) observer.disconnect();
                } else if (t.reverseOnExit) tl.reverse();
              }
            },
            {
              root: root.hasAttribute("data-motion-scroller") ? root : null,
              threshold: t.threshold,
              rootMargin: t.rootMargin,
            },
          );
          observer.observe(target);
          cleanups.push(() => observer.disconnect());
        } else if (t.type === "scroll" && target) {
          const trigger = ScrollTrigger.create({
            trigger: target,
            scroller: t.scrollContainer
              ? resolve(t.scrollContainer)
              : root.hasAttribute("data-motion-scroller")
                ? root
                : undefined,
            start: t.start,
            end: t.end,
            scrub: t.scrub,
            pin: t.pin,
            toggleActions: t.toggleActions,
            animation: tl,
            onUpdate: () => onUpdate(tl.time(), false),
          });
          cleanups.push(() => trigger.kill());
        }
      }
    });
  } catch (error) {
    cleanups.forEach((fn) => fn());
    context.revert();
    throw error;
  }
  const finiteDuration = Math.max(
    1,
    ...sequences
      .filter((s) => s.trigger.type !== "scroll")
      .flatMap((s) =>
        s.animations.map(
          (a) =>
            (s.trigger.type === "load" ? s.trigger.delay : 0) +
            a.at +
            a.delay +
            a.duration * (a.repeat < 0 ? 1 : a.repeat + 1) +
            a.repeatDelay * Math.max(0, a.repeat),
        ),
      ),
  );
  return {
    timeline: master,
    timelines,
    duration: finiteDuration,
    resolve,
    seek(time, sequenceId) {
      const tl = sequenceId ? timelines.get(sequenceId) : master;
      tl?.pause(Math.max(0, time), false);
    },
    sample(a) {
      const el = resolve(a.target);
      return Object.fromEntries(
        [
          ...new Set([
            ...Object.keys(a.from),
            ...Object.keys(a.to),
            ...a.keyframes.flatMap((k) => Object.keys(k.values)),
          ]),
        ].map((k) => [k, gsap.getProperty(el, k)]),
      );
    },
    endpoints(a) {
      return {
        initial: a.mode === "to" ? bases.get(a.id) : { ...a.from },
        final: a.mode === "from" ? bases.get(a.id) : { ...a.to },
      };
    },
    destroy() {
      cleanups.forEach((fn) => fn());
      context.revert();
      timelines.clear();
    },
  };
}
