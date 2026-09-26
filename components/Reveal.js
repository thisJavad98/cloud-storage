"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { revealTransition } from "../lib/motion";

/**
 * Scroll / mount reveal with optional polymorphic element (div, article, Link…).
 */
export default function Reveal({
  as: Comp = "div",
  delay = 0,
  className = "",
  children,
  once = true,
  hover = false,
  ...rest
}) {
  const reduce = useReducedMotion();

  const MotionComp = useMemo(() => {
    if (typeof Comp === "string") {
      return motion[Comp] || motion.div;
    }
    return motion.create(Comp);
  }, [Comp]);

  if (reduce) {
    const Static = typeof Comp === "string" ? Comp : Comp;
    return (
      <Static className={className} {...rest}>
        {children}
      </Static>
    );
  }

  return (
    <MotionComp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.12, margin: "0px 0px -5% 0px" }}
      transition={revealTransition(delay)}
      {...(hover
        ? {
            whileHover: { y: -3, transition: { duration: 0.2 } },
            whileTap: { scale: 0.98 },
          }
        : {})}
      {...rest}
    >
      {children}
    </MotionComp>
  );
}
