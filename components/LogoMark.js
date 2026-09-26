"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];
const GOLD = "#f6c344";
const GOLD_DEEP = "#e8b02e";

/**
 * Detailed Nimbus cloud mark with idle motion.
 * `tone`: "blue" | "white" | "ink" — matches AppBrand.
 */
export default function LogoMark({
  className = "size-9",
  title,
  tone = "blue",
  animated = true,
}) {
  const reduceMotion = useReducedMotion();
  const live = animated && !reduceMotion;
  const onLight = tone !== "white";

  const cloud = onLight ? "currentColor" : "#ffffff";
  const highlight = onLight ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.55)";
  const bar = onLight ? "rgba(255,255,255,0.92)" : "rgba(21,66,176,0.45)";
  const glow = onLight ? "currentColor" : "#ffffff";
  const spark = onLight ? "currentColor" : "#ffffff";

  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      overflow="visible"
      initial={live ? { opacity: 0, scale: 0.86, y: 4 } : false}
      animate={live ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease }}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        <filter id="nimbusGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft aura */}
      {live ? (
        <motion.ellipse
          cx="32"
          cy="36"
          rx="22"
          ry="12"
          fill={glow}
          opacity="0.12"
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "32px 36px" }}
        />
      ) : (
        <ellipse cx="32" cy="38" rx="20" ry="8" fill={glow} opacity="0.1" />
      )}

      <motion.g
        animate={live ? { y: [0, -1.6, 0] } : undefined}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cloud body */}
        <g fill={cloud} filter="url(#nimbusGlow)">
          <rect x="11" y="31" width="42" height="15" rx="7.5" />
          <circle cx="21.5" cy="32" r="9.5" />
          <circle cx="33" cy="26.5" r="12.5" />
          <circle cx="46" cy="32" r="9" />
        </g>

        {/* Soft top highlight */}
        <ellipse
          cx="30"
          cy="22.5"
          rx="8"
          ry="4.2"
          fill={highlight}
        />
        <path
          d="M18 33.5c1.2-3.8 4.6-6.2 8.4-6.2"
          stroke={highlight}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Storage bars — pulse like syncing data */}
        <g>
          <motion.rect
            x="24"
            y="31.5"
            width="16"
            height="2.6"
            rx="1.3"
            fill={bar}
            animate={live ? { opacity: [0.55, 1, 0.55] } : undefined}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="26"
            y="35.2"
            width="12"
            height="2.6"
            rx="1.3"
            fill={bar}
            animate={live ? { opacity: [0.4, 0.85, 0.4] } : undefined}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.25,
            }}
          />
          <motion.rect
            x="28"
            y="38.9"
            width="8"
            height="2.6"
            rx="1.3"
            fill={bar}
            animate={live ? { opacity: [0.28, 0.7, 0.28] } : undefined}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </g>

        {/* Secure / synced badge */}
        <motion.g
          animate={
            live
              ? { scale: [1, 1.08, 1], rotate: [0, 4, 0] }
              : undefined
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          style={{ transformOrigin: "48px 18px" }}
        >
          <circle cx="48" cy="18" r="7.2" fill={GOLD} />
          <circle cx="48" cy="18" r="7.2" fill={GOLD_DEEP} opacity="0.35" />
          <circle
            cx="48"
            cy="18"
            r="5.8"
            fill="none"
            stroke="#fff"
            strokeWidth="1.1"
            opacity="0.55"
          />
          <path
            d="M45.2 18.1 47.1 20l3.8-4.2"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </motion.g>

      {/* Rising sync sparks */}
      {live ? (
        <>
          <motion.circle
            cx="16"
            cy="28"
            r="1.4"
            fill={spark}
            animate={{ y: [4, -10], opacity: [0, 0.85, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
          />
          <motion.circle
            cx="52"
            cy="30"
            r="1.1"
            fill={spark}
            animate={{ y: [2, -12], opacity: [0, 0.7, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
          />
          <motion.circle
            cx="38"
            cy="16"
            r="1.2"
            fill={GOLD}
            animate={{ y: [3, -9], opacity: [0, 1, 0], scale: [0.7, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          />
        </>
      ) : null}
    </motion.svg>
  );
}
