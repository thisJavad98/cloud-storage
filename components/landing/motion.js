"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export const EASE = [0.16, 1, 0.3, 1];

export const springSoft = { type: "spring", stiffness: 120, damping: 18, mass: 0.7 };
export const springSnappy = { type: "spring", stiffness: 260, damping: 22, mass: 0.45 };

/** Shared scroll-reveal props for section blocks. */
export function reveal(reduce, delay = 0, y = 28) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, delay, ease: EASE },
  };
}

/** Pointer-driven 3D tilt on a card/stage. Honors reduced motion. */
export function Tilt3D({
  children,
  className = "",
  max = 10,
  perspective = 900,
  scale = 1.02,
  glare = true,
}) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [max, -max]), springSoft);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-max, max]), springSoft);
  const glareX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(rawY, [-0.5, 0.5], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), transparent 55%)`;

  function onMove(event) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{
        perspective,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale }}
      transition={springSnappy}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="relative z-[1]">{children}</div>
      {glare ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glareBg, opacity: 0.28 }}
        />
      ) : null}
    </motion.div>
  );
}

/** Soft perpetual float for depth layers. */
export function Float3D({
  children,
  className = "",
  amplitude = 10,
  duration = 4.5,
  delay = 0,
  rotate = 2,
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.55, 0],
        rotateZ: [0, rotate, 0, -rotate, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

/** Lift + soft shadow for cards; image zoom via CSS `.landing-media-zoom` child. */
export function HoverLift({
  children,
  className = "",
  as: Comp = motion.article,
  y = -6,
  scale = 1.01,
  delay = 0,
  ...rest
}) {
  const reduce = useReducedMotion();
  return (
    <Comp
      className={`landing-hover-card ${className}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      whileHover={
        reduce
          ? undefined
          : {
              y,
              scale,
              transition: springSnappy,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.985 }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
