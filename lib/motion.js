"use client";

/** Shared motion tokens for dashboard & app pages */
export const easeOut = [0.22, 1, 0.36, 1];

export const pageTransition = {
  duration: 0.5,
  ease: easeOut,
};

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export const fadeDown = {
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
};

export function revealTransition(delayMs = 0) {
  return {
    duration: 0.45,
    delay: Math.max(0, delayMs) / 1000,
    ease: easeOut,
  };
}
