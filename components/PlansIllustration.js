"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

export function PlansIllustration({ className = "mx-auto h-auto w-full max-w-[280px]" }) {
  return (
    <motion.svg
      viewBox="0 0 320 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <defs>
        <linearGradient id="pCloud" x1="160" y1="16" x2="160" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c8dcff" />
        </linearGradient>
        <linearGradient id="pA" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#9ec0ff" />
          <stop offset="1" stopColor="#6a90ea" />
        </linearGradient>
        <linearGradient id="pB" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#5b8cff" />
          <stop offset="1" stopColor="#1e55d6" />
        </linearGradient>
        <linearGradient id="pC" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffd56a" />
          <stop offset="1" stopColor="#f08a3a" />
        </linearGradient>
        <radialGradient id="pGlow" cx="50%" cy="40%" r="55%">
          <stop stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="pShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#06153f" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="160" cy="100" rx="140" ry="82" fill="url(#pGlow)" />
      <motion.circle
        cx="32"
        cy="44"
        r="16"
        fill="#fff"
        opacity="0.1"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="292"
        cy="38"
        r="22"
        fill="#fff"
        opacity="0.08"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.6, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="160"
        cy="186"
        rx="104"
        ry="9"
        fill="#0d2a74"
        opacity="0.35"
        animate={{ scaleX: [1, 1.06, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        filter="url(#pShadow)"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M104 60c0-15 12-28 28-28 4 0 8 1 11 3 5-10 15-17 28-17 18 0 33 14 33 32 0 1 0 2 0 3h8c13 0 23 10 23 22s-10 22-23 22H112c-15 0-27-11-27-26 0-8 3-15 10-20 2-6 5-10 9-13Z"
          fill="url(#pCloud)"
        />
        <path d="M124 52c7-9 18-13 27-9 4-8 12-14 22-14 13 0 24 10 25 22" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.4" />
        <motion.g
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "160px 46px" }}
        >
          <circle cx="160" cy="46" r="13" fill="#f5c03d" />
          <circle cx="160" cy="46" r="9" fill="#ffe08a" opacity="0.45" />
          <path d="M154 46.5 158 50.5 168 39.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>

      <g filter="url(#pShadow)">
        {[
          { x: 66, h: 52, y: 118, fill: "url(#pA)", delay: 0 },
          { x: 138, h: 74, y: 96, fill: "url(#pB)", delay: 0.15 },
          { x: 210, h: 62, y: 108, fill: "url(#pC)", delay: 0.3 },
        ].map((bar) => (
          <motion.g
            key={bar.x}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.45, delay: 0.25 + bar.delay },
              y: { duration: 2.8 + bar.delay, delay: bar.delay, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <rect x={bar.x} y={bar.y} width="44" height={bar.h} rx="11" fill={bar.fill} />
            <rect x={bar.x + 8} y={bar.y + 12} width="28" height="5" rx="2.5" fill="#fff" opacity="0.75" />
            <rect x={bar.x + 8} y={bar.y + 22} width="18" height="5" rx="2.5" fill="#fff" opacity="0.45" />
          </motion.g>
        ))}
        <motion.circle
          cx="160"
          cy="148"
          r="9"
          fill="#fff"
          opacity="0.22"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "160px 148px" }}
        />
        <path d="M160 143v10M155 148h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>

      <motion.g
        filter="url(#pShadow)"
        animate={{ y: [0, -9, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="20" y="86" width="36" height="44" rx="8" fill="#fff" />
        <rect x="27" y="96" width="22" height="4" rx="2" fill="#9db7ef" />
        <rect x="27" y="106" width="14" height="4" rx="2" fill="#c5d4f5" />
      </motion.g>
      <motion.g
        filter="url(#pShadow)"
        animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 3.1, delay: 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="266" y="72" width="36" height="44" rx="8" fill="#fff" />
        <rect x="273" y="82" width="22" height="4" rx="2" fill="#9db7ef" />
        <circle cx="284" cy="100" r="6" fill="#5ad98c" opacity="0.9" />
        <path d="M281 100 283.2 102.2 288 97" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      {[
        { d: "M248 28 251 35 258 38 251 41 248 48 245 41 238 38 245 35Z", delay: 0 },
        { d: "M72 30 75 36 81 39 75 42 72 48 69 42 63 39 69 36Z", delay: 0.5 },
      ].map((s) => (
        <motion.path
          key={s.d}
          d={s.d}
          fill="#fff"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </motion.svg>
  );
}
