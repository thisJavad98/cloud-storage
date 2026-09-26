"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const floatY = (delay = 0, y = 6, duration = 3) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" },
});

/**
 * Detailed iOS Add-to-Home-Screen guide illustration with motion.
 * Shows: iPhone → Share tap → sheet highlight → home icon appear.
 */
export default function AddToHomeIllustration() {
  return (
    <motion.svg
      viewBox="0 0 360 280"
      className="pointer-events-none mx-auto h-auto max-h-[min(34vh,220px)] w-full max-w-[320px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="visible"
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <defs>
        <linearGradient id="a2hsPhone" x1="90" y1="20" x2="270" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a6af0" />
          <stop offset="1" stopColor="#1542b0" />
        </linearGradient>
        <linearGradient id="a2hsScreen" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f4f7ff" />
          <stop offset="1" stopColor="#dce8ff" />
        </linearGradient>
        <linearGradient id="a2hsSheet" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef3ff" />
        </linearGradient>
        <linearGradient id="a2hsIcon" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2a6af0" />
          <stop offset="1" stopColor="#1e55d6" />
        </linearGradient>
        <filter id="a2hsShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#06153f" floodOpacity="0.28" />
        </filter>
        <radialGradient id="a2hsGlow" cx="50%" cy="40%" r="55%">
          <stop stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="180" cy="140" rx="150" ry="95" fill="url(#a2hsGlow)" />

      <motion.circle cx="36" cy="52" r="14" fill="#fff" opacity="0.1" {...floatY(0.2, 10, 4)} />
      <motion.circle cx="324" cy="70" r="20" fill="#fff" opacity="0.08" {...floatY(0.8, 12, 4.5)} />
      <motion.circle
        cx="48"
        cy="210"
        r="7"
        fill="#f6c344"
        animate={{ opacity: [0.25, 0.8, 0.25], scale: [1, 1.2, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Phone body */}
      <motion.g filter="url(#a2hsShadow)" {...floatY(0, 5, 3.6)}>
        <rect x="108" y="18" width="144" height="244" rx="28" fill="url(#a2hsPhone)" />
        <rect x="116" y="28" width="128" height="224" rx="22" fill="url(#a2hsScreen)" />
        {/* Dynamic Island */}
        <rect x="152" y="36" width="56" height="12" rx="6" fill="#152a5c" opacity="0.85" />

        {/* Fake Safari chrome */}
        <rect x="128" y="58" width="104" height="18" rx="9" fill="#fff" opacity="0.95" />
        <circle cx="140" cy="67" r="3.5" fill="#1e55d6" opacity="0.55" />
        <rect x="150" y="64" width="60" height="6" rx="3" fill="#c5d4f5" />

        {/* Content cards */}
        <motion.rect
          x="132"
          y="88"
          width="96"
          height="28"
          rx="10"
          fill="#1e55d6"
          opacity="0.18"
          animate={{ opacity: [0.14, 0.28, 0.14] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="132" y="124" width="70" height="10" rx="5" fill="#9bb6ef" opacity="0.55" />
        <rect x="132" y="140" width="88" height="10" rx="5" fill="#b8cbf5" opacity="0.45" />

        {/* Share button (bottom toolbar) */}
        <rect x="128" y="220" width="104" height="22" rx="8" fill="#fff" opacity="0.9" />
        <motion.g
          animate={{ scale: [1, 1.18, 1], y: [0, -2, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "180px 231px" }}
        >
          {/* iOS share icon */}
          <rect x="172" y="226" width="16" height="12" rx="2.5" stroke="#1e55d6" strokeWidth="1.8" fill="none" />
          <path
            d="M180 222v10"
            stroke="#1e55d6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M175.5 226.5 180 222l4.5 4.5"
            stroke="#1e55d6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>

        {/* Tap ripple on share */}
        <motion.circle
          cx="180"
          cy="231"
          r="10"
          fill="none"
          stroke="#1e55d6"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.6, 1.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
        />
      </motion.g>

      {/* Share sheet sliding up */}
      <motion.g
        filter="url(#a2hsShadow)"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [28, 0, 0, 28], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.75, 1] }}
      >
        <rect x="122" y="148" width="116" height="108" rx="18" fill="url(#a2hsSheet)" />
        <rect x="168" y="156" width="24" height="4" rx="2" fill="#c5d4f5" />

        {/* Row: Copy */}
        <rect x="134" y="168" width="92" height="18" rx="8" fill="#e8efff" />
        <rect x="142" y="174" width="40" height="6" rx="3" fill="#9bb6ef" opacity="0.7" />

        {/* Row: Add to Home Screen — highlighted */}
        <motion.g
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "180px 204px" }}
        >
          <rect x="134" y="192" width="92" height="22" rx="9" fill="#1e55d6" />
          <rect x="142" y="198" width="10" height="10" rx="2.5" fill="#fff" opacity="0.95" />
          {/* plus on square */}
          <path d="M147 200.5v5M144.5 203h5" stroke="#1e55d6" strokeWidth="1.3" strokeLinecap="round" />
          <rect x="158" y="200" width="52" height="6" rx="3" fill="#fff" opacity="0.92" />
        </motion.g>

        <rect x="134" y="220" width="92" height="18" rx="8" fill="#e8efff" />
        <rect x="142" y="226" width="48" height="6" rx="3" fill="#9bb6ef" opacity="0.55" />
      </motion.g>

      {/* Home-screen icon popping in (right side) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.5, 0.5, 1.08, 1, 0.9],
          y: [20, 20, -4, 0, 8],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: ease, times: [0, 0.35, 0.5, 0.8, 1] }}
      >
        <rect x="268" y="96" width="56" height="56" rx="14" fill="url(#a2hsIcon)" />
        {/* mini cloud */}
        <g fill="#fff">
          <rect x="280" y="122" width="32" height="12" rx="6" />
          <circle cx="288" cy="122" r="7" />
          <circle cx="298" cy="118" r="9" />
          <circle cx="308" cy="122" r="6.5" />
        </g>
        {/* gold badge */}
        <circle cx="312" cy="108" r="6" fill="#f6c344" />
        <path
          d="M309.6 108.1 311.2 109.7l3.2-3.4"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <rect x="276" y="158" width="40" height="6" rx="3" fill="#fff" opacity="0.55" />
      </motion.g>

      {/* Arrow from sheet to icon */}
      <motion.path
        d="M238 210 C252 210 258 150 268 130"
        stroke="#f6c344"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="5 5"
        fill="none"
        animate={{ strokeDashoffset: [0, -20], opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Step dots */}
      <motion.g
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="150" cy="268" r="3.5" fill="#fff" opacity="0.85" />
        <circle cx="168" cy="268" r="3.5" fill="#f6c344" />
        <circle cx="186" cy="268" r="3.5" fill="#fff" opacity="0.55" />
      </motion.g>
    </motion.svg>
  );
}
