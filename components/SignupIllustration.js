"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const floatY = (delay = 0, y = 8, duration = 3.2) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" },
});

const pulse = (delay = 0) => ({
  animate: { scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] },
  transition: { duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" },
});

export function SignupIllustration() {
  return (
    <motion.svg
      viewBox="0 0 360 250"
      className="signup-illu pointer-events-none mx-auto h-auto max-h-[min(38vh,230px)] w-full max-w-[320px] md:max-h-[min(22vh,140px)] md:max-w-[200px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <defs>
        <linearGradient id="sCloud" x1="180" y1="12" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c5d9ff" />
        </linearGradient>
        <linearGradient id="sCard" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8f0ff" />
        </linearGradient>
        <linearGradient id="sPlus" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8bffbf" />
          <stop offset="1" stopColor="#2fbf6e" />
        </linearGradient>
        <radialGradient id="sGlow" cx="50%" cy="40%" r="55%">
          <stop stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="sShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6.5" floodColor="#06153f" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="180" cy="122" rx="152" ry="96" fill="url(#sGlow)" />
      <motion.circle cx="34" cy="52" r="16" fill="#fff" opacity="0.09" {...floatY(0.2, 10, 4)} />
      <motion.circle cx="330" cy="66" r="24" fill="#fff" opacity="0.07" {...floatY(0.7, 13, 4.6)} />

      <motion.ellipse
        cx="180"
        cy="228"
        rx="110"
        ry="11"
        fill="#0a2268"
        opacity="0.38"
        animate={{ scaleX: [1, 1.06, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Welcome cloud + plus */}
      <motion.g filter="url(#sShadow)" {...floatY(0, 8, 3.3)}>
        <path
          d="M104 74c0-18 14-33 33-33 5 0 11 1 15 4 6-12 19-21 35-21 22 0 40 17 40 39 0 1 0 3-.2 4h10c15 0 28 12 28 27s-13 27-28 27H116c-18 0-33-14-33-31 0-10 4-18 12-24 3-8 6-14 11-19Z"
          fill="url(#sCloud)"
        />
        <path d="M126 66c8-11 20-15 30-10 4-9 13-16 24-16 14 0 26 11 27 24" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity="0.42" />
        <motion.g
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "180px 56px" }}
        >
          <circle cx="180" cy="56" r="18" fill="url(#sPlus)" />
          <circle cx="180" cy="56" r="13" fill="#fff" opacity="0.22" />
          <rect x="176.5" y="44" width="7" height="24" rx="3.5" fill="#fff" />
          <rect x="168" y="52.5" width="24" height="7" rx="3.5" fill="#fff" />
        </motion.g>
      </motion.g>

      {/* Invite beams into card */}
      <motion.path
        d="M48 145 C90 145 100 165 124 170"
        stroke="#8eb4ff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeDasharray="3 5"
        animate={{ strokeDashoffset: [0, -14], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M314 148 C280 148 270 165 252 175"
        stroke="#7dffb2"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeDasharray="3 5"
        animate={{ strokeDashoffset: [0, 14], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Profile card */}
      <motion.g
        filter="url(#sShadow)"
        animate={{ y: [6, -2, 6] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="108" y="120" width="144" height="96" rx="18" fill="url(#sCard)" />
        <rect x="108" y="120" width="144" height="32" rx="18" fill="#6ea0ff" />
        <rect x="108" y="138" width="144" height="14" fill="#6ea0ff" />
        <circle cx="142" cy="136" r="16" fill="#ffd4ba" />
        <path d="M128 124c9-11 22-8 24 4-9 1-17 1-24-4Z" fill="#1f2433" />
        <rect x="168" y="128" width="60" height="7" rx="3.5" fill="#fff" opacity="0.92" />
        <rect x="168" y="140" width="40" height="5.5" rx="2.5" fill="#fff" opacity="0.55" />
        <motion.rect
          x="124"
          y="164"
          width="112"
          height="11"
          rx="5.5"
          fill="#c5d4f5"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.rect
          x="124"
          y="182"
          width="112"
          height="11"
          rx="5.5"
          fill="#d7e4ff"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2, delay: 0.25, repeat: Infinity }}
        />
        <rect x="124" y="200" width="72" height="11" rx="5.5" fill="#5ad98c" opacity="0.9" />
        <path d="M134 205.5 139 210 150 200" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* Avatar chip left */}
      <motion.g filter="url(#sShadow)" {...floatY(0.35, 7, 3)}>
        <circle cx="48" cy="134" r="24" fill="#fff" />
        <circle cx="48" cy="126" r="10" fill="#ffd0b5" />
        <path d="M38 117c6-8 15-6 16 3-6 0-11 0-16-3Z" fill="#1f2433" />
        <path d="M32 142c2-9 28-9 32 0v10H32v-10Z" fill="#3d6fe0" />
        <motion.g
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ transformOrigin: "64px 148px" }}
        >
          <circle cx="64" cy="148" r="9" fill="url(#sPlus)" />
          <rect x="62.2" y="142.5" width="3.6" height="11" rx="1.8" fill="#fff" />
          <rect x="58.5" y="146.2" width="11" height="3.6" rx="1.8" fill="#fff" />
        </motion.g>
      </motion.g>

      {/* Avatar chip right */}
      <motion.g filter="url(#sShadow)" {...floatY(0.9, 6, 3.4)}>
        <circle cx="314" cy="142" r="22" fill="#fff" />
        <circle cx="314" cy="134" r="9" fill="#ffc9a8" />
        <path d="M305 126c6-7 14-5 15 3-6 0-10 0-15-3Z" fill="#1a1f2e" />
        <path d="M298 148c2-8 26-8 30 0v10h-30v-10Z" fill="#ff8f6b" />
      </motion.g>

      {/* Invite envelope */}
      <motion.g
        filter="url(#sShadow)"
        animate={{ y: [0, -11, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="286" y="48" width="52" height="38" rx="7" fill="#fff" />
        <path d="M286 55 312 72 338 55" stroke="#6ea0ff" strokeWidth="2.4" strokeLinejoin="round" fill="none" />
        <path d="M286 78 304 64" stroke="#9db7ef" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M338 78 320 64" stroke="#9db7ef" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="328" cy="78" r="7" fill="#f6c344" />
        <path d="M325 78 327.5 80.5 332 76" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      {/* Confetti */}
      {[
        { x: 96, y: 110, c: "#f6c344", d: 0 },
        { x: 248, y: 114, c: "#7dffb2", d: 0.35 },
        { x: 232, y: 124, c: "#ff8f6b", d: 0.7 },
        { x: 88, y: 128, c: "#8eb4ff", d: 0.2 },
      ].map((p) => (
        <motion.rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width="7"
          height="7"
          rx="1.5"
          fill={p.c}
          animate={{ y: [0, 18, 0], opacity: [1, 0.15, 1], rotate: [0, 50, 0] }}
          transition={{ duration: 2.5, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.path d="M90 36 94 45 103 49 94 53 90 62 86 53 77 49 86 45Z" fill="#fff" {...pulse(0)} />
      <motion.path d="M248 30 251 37 258 40 251 43 248 50 245 43 238 40 245 37Z" fill="#fff" {...pulse(0.7)} />
      <motion.circle cx="264" cy="104" r="2.5" fill="#fff" {...pulse(1.1)} />
      <motion.circle cx="76" cy="98" r="2.2" fill="#f6c344" {...pulse(0.4)} />
    </motion.svg>
  );
}
