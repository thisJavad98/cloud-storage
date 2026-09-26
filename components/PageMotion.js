"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut, fadeUp, pageTransition, scaleIn } from "../lib/motion";

const STICKY_TONES = {
  surface:
    "sticky top-0 z-30 bg-[color-mix(in_srgb,var(--cs-surface)_90%,transparent)] pb-3 backdrop-blur-md",
  blue:
    "sticky top-0 z-30 bg-[color-mix(in_srgb,var(--cs-blue)_88%,transparent)] pb-3 backdrop-blur-md",
};

/** Top app bar — sticky by default. Opacity-only entrance (Y transform breaks sticky). */
export function MotionHeader({
  children,
  className = "",
  delay = 0,
  sticky = true,
  tone = "surface",
}) {
  const reduce = useReducedMotion();
  const stickyClass = sticky ? STICKY_TONES[tone] || STICKY_TONES.surface : "";
  const classes = `${stickyClass} ${className}`.trim();

  if (reduce) return <header className={classes}>{children}</header>;

  return (
    <motion.header
      className={classes}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...pageTransition, delay }}
    >
      {children}
    </motion.header>
  );
}

/** Generic block that fades up on mount */
export function MotionBlock({
  children,
  className = "",
  delay = 0,
  as = "div",
  variant = "up",
  ...rest
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  const preset = variant === "scale" ? scaleIn : fadeUp;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Comp
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      transition={{ ...pageTransition, delay, ease: easeOut }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Staggered list / grid container */
export function MotionStagger({ children, className = "", delay = 0.05 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: { staggerChildren: 0.06, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={className}
      variants={{
        initial: { opacity: 0, y: 14 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: easeOut },
        },
      }}
    >
      {children}
    </Comp>
  );
}
