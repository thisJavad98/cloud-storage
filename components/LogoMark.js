"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];
const ACCENT = "#e8782a";
const ACCENT_DEEP = "#c96118";

/**
 * Nimbus mark — clean cloud built from overlapping circles,
 * storage bars inside, check badge floating clear of the silhouette.
 */
export default function LogoMark({
  className = "size-9",
  title,
  tone = "blue",
  animated = true,
}) {
  const reduceMotion = useReducedMotion();
  const live = animated && !reduceMotion;
  const uid = useId().replace(/:/g, "");
  const glowId = `nm-glow-${uid}`;

  const onLight = tone !== "white";
  const cloud = onLight ? "currentColor" : "#ffffff";
  const bar = onLight ? "rgba(255,255,255,0.92)" : ACCENT_DEEP;
  const barOp = onLight ? [0.95, 0.75, 0.55] : [0.72, 0.55, 0.38];

  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      overflow="visible"
      initial={live ? { opacity: 0, scale: 0.9, y: 2 } : false}
      animate={live ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease }}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="0.9" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        filter={`url(#${glowId})`}
        animate={live ? { y: [0, -1.1, 0] } : undefined}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cloud from overlapping circles + base — classic, favicon-clean */}
        <g fill={cloud}>
          <circle cx="22" cy="34" r="11" />
          <circle cx="33" cy="27" r="13.5" />
          <circle cx="45" cy="34" r="10.5" />
          <rect x="12" y="34" width="40" height="14" rx="7" />
        </g>

        {/* Storage bars */}
        <motion.rect
          x="22"
          y="32"
          width="20"
          height="3"
          rx="1.5"
          fill={bar}
          opacity={barOp[0]}
          animate={
            live
              ? { opacity: [barOp[0] * 0.7, barOp[0], barOp[0] * 0.7] }
              : undefined
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="24"
          y="36.5"
          width="16"
          height="3"
          rx="1.5"
          fill={bar}
          opacity={barOp[1]}
          animate={
            live
              ? { opacity: [barOp[1] * 0.65, barOp[1], barOp[1] * 0.65] }
              : undefined
          }
          transition={{
            duration: 2.2,
            delay: 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.rect
          x="27"
          y="41"
          width="10"
          height="3"
          rx="1.5"
          fill={bar}
          opacity={barOp[2]}
          animate={
            live
              ? { opacity: [barOp[2] * 0.6, barOp[2], barOp[2] * 0.6] }
              : undefined
          }
          transition={{
            duration: 2.2,
            delay: 0.36,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Check badge — clear of cloud edge */}
        <motion.g
          animate={live ? { scale: [1, 1.05, 1] } : undefined}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 18px" }}
        >
          <circle cx="50" cy="18" r="7.5" fill={onLight ? ACCENT : "#fff4e8"} />
          <path
            d="M46.8 18.2 49.1 20.4l4.4-4.8"
            stroke={onLight ? "#ffffff" : ACCENT_DEEP}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
