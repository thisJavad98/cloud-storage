"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const floatY = (delay = 0, y = 8, duration = 3.2) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" },
});

const pulse = (delay = 0) => ({
  animate: { scale: [1, 1.16, 1], opacity: [0.4, 1, 0.4] },
  transition: { duration: 2.1, delay, repeat: Infinity, ease: "easeInOut" },
});

export function LoginIllustration() {
  return (
    <motion.svg
      viewBox="0 0 360 250"
      className="login-illu pointer-events-none mx-auto h-auto max-h-[min(38vh,230px)] w-full max-w-[320px] md:max-h-[min(22vh,140px)] md:max-w-[200px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <defs>
        <linearGradient id="lArch" x1="180" y1="30" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="0.5" stopColor="#c8dbff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#6ea8ff" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="lCloud" x1="180" y1="14" x2="180" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c5d9ff" />
        </linearGradient>
        <linearGradient id="lRay" x1="180" y1="70" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lLock" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffe08a" />
          <stop offset="1" stopColor="#efad20" />
        </linearGradient>
        <radialGradient id="lGlow" cx="50%" cy="40%" r="52%">
          <stop stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="lShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6.5" floodColor="#06153f" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="180" cy="125" rx="150" ry="95" fill="url(#lGlow)" />
      <motion.circle cx="36" cy="54" r="17" fill="#fff" opacity="0.09" {...floatY(0.2, 10, 4)} />
      <motion.circle cx="328" cy="70" r="22" fill="#fff" opacity="0.07" {...floatY(0.8, 12, 4.5)} />

      <motion.ellipse
        cx="180"
        cy="228"
        rx="108"
        ry="11"
        fill="#0a2268"
        opacity="0.38"
        animate={{ scaleX: [1, 1.06, 1] }}
        transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vault cloud + lock */}
      <motion.g filter="url(#lShadow)" {...floatY(0, 7, 3.2)}>
        <path
          d="M112 70c0-16 13-30 30-30 5 0 10 1 14 4 6-12 18-20 32-20 20 0 37 16 37 36 0 1 0 2-.1 3h11c14 0 26 11 26 25s-12 25-26 25H124c-17 0-31-13-31-29 0-9 4-17 12-23 2-7 5-13 9-17Z"
          fill="url(#lCloud)"
        />
        <path d="M132 62c8-10 20-14 30-9 4-9 13-15 24-15 14 0 26 10 27 23" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity="0.4" />
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "180px 58px" }}
        >
          <rect x="164" y="50" width="32" height="24" rx="6" fill="url(#lLock)" />
          <path d="M171 50v-7c0-7 4.5-11 9-11s9 4 9 11v7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <circle cx="180" cy="60" r="3.6" fill="#fff" />
          <rect x="178.4" y="62.5" width="3.2" height="6" rx="1.2" fill="#fff" />
        </motion.g>
      </motion.g>

      {/* Arch doorway */}
      <path d="M96 220V102c0-42 30-70 84-70s84 28 84 70v118" stroke="#b8d0ff" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
      <path d="M114 220V106c0-34 24-56 66-56s66 22 66 56v114" fill="url(#lArch)" />
      <path d="M114 220V106c0-34 24-56 66-56s66 22 66 56v114" stroke="#fff" strokeWidth="1.6" opacity="0.22" />
      <motion.path
        d="M180 88 C180 120 180 150 180 200"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="4 6"
        animate={{ strokeDashoffset: [0, -24], opacity: [0.2, 0.65, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Door panel lines */}
      <motion.rect
        x="152"
        y="148"
        width="56"
        height="58"
        rx="8"
        fill="#fff"
        opacity="0.12"
        animate={{ opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="198" cy="178" r="3" fill="#fff" opacity="0.45" />

      <motion.g
        animate={{ opacity: [0.3, 0.75, 0.3] }}
        transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M180 78 L142 184 L218 184 Z" fill="url(#lRay)" />
        <path d="M180 90 L120 190 L240 190 Z" fill="url(#lRay)" opacity="0.5" />
      </motion.g>

      <ellipse cx="180" cy="216" rx="52" ry="7" fill="#fff" opacity="0.16" />

      {/* Docs */}
      <motion.g
        filter="url(#lShadow)"
        animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="18" y="116" width="52" height="62" rx="10" fill="#fff" />
        <rect x="18" y="116" width="52" height="16" rx="10" fill="#6ea0ff" />
        <rect x="28" y="123" width="24" height="3.5" rx="1.5" fill="#fff" opacity="0.85" />
        <rect x="30" y="142" width="30" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="30" y="151" width="22" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="30" y="160" width="26" height="3.5" rx="1.5" fill="#c5d4f5" />
      </motion.g>

      <motion.g
        filter="url(#lShadow)"
        animate={{ y: [0, -7, 0], rotate: [2, -3, 2] }}
        transition={{ duration: 3.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="292" y="100" width="48" height="56" rx="10" fill="#fff" />
        <rect x="302" y="114" width="28" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="302" y="123" width="20" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="302" y="132" width="24" height="3.5" rx="1.5" fill="#c5d4f5" />
        <circle cx="316" cy="146" r="7" fill="#5ad98c" opacity="0.9" />
        <path d="M312.5 146 315 148.5 320.5 142.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      </motion.g>

      {/* Floating key */}
      <motion.g
        filter="url(#lShadow)"
        animate={{ y: [0, -12, 0], rotate: [0, 14, 0], x: [0, 4, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="258" cy="156" r="9" fill="#f6c344" />
        <circle cx="258" cy="156" r="4" fill="#fff" opacity="0.85" />
        <rect x="265" y="154" width="22" height="4.5" rx="2" fill="#f6c344" />
        <rect x="280" y="154" width="3.5" height="8" rx="1.2" fill="#f6c344" />
        <rect x="286" y="154" width="3.5" height="6" rx="1.2" fill="#f6c344" />
      </motion.g>

      {/* Person walking in */}
      <motion.g
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="146" cy="132" r="16" fill="#ffd4ba" />
        <path d="M130 110c11-15 28-11 30 5-11 1-21 1-30-5Z" fill="#1f2433" />
        <path d="M128 152c3-15 34-15 36 0v30h-36v-30Z" fill="#fff" />
        <rect x="138" y="160" width="20" height="9" rx="2.5" fill="#6ea0ff" />
        <path d="M132 180l-7 34h14l6-34h-13Z" fill="#1b3f9a" />
        <path d="M152 180l9 34h14l-10-34h-13Z" fill="#163d9e" />
        <motion.path
          d="M162 158c13 2 26 13 28 17l-9 9c-4-4-15-13-24-15v-11Z"
          fill="#ffd4ba"
          animate={{ rotate: [0, 8, 0] }}
          style={{ transformOrigin: "162px 158px" }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="141" cy="130" r="1.7" fill="#5a3a2a" opacity="0.55" />
        <circle cx="151" cy="130" r="1.7" fill="#5a3a2a" opacity="0.55" />
        <path d="M143 137c2.2 2.2 7 2.2 9 0" stroke="#c4886a" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>

      <motion.path d="M238 88 242 97 251 101 242 105 238 114 234 105 225 101 234 97Z" fill="#fff" {...pulse(0)} />
      <motion.path d="M262 122 265 128 271 131 265 134 262 140 259 134 253 131 259 128Z" fill="#fff" {...pulse(0.5)} />
      <motion.circle cx="226" cy="142" r="2.5" fill="#fff" {...pulse(0.9)} />
      <motion.circle cx="98" cy="92" r="2.2" fill="#fff" {...pulse(1.2)} />
    </motion.svg>
  );
}
