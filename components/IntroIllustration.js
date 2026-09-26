"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const floatY = (delay = 0, y = 8, duration = 3.2) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" },
});

const pulse = (delay = 0, scale = 1.12) => ({
  animate: { scale: [1, scale, 1], opacity: [0.45, 1, 0.45] },
  transition: { duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" },
});

export function IntroIllustration() {
  return (
    <motion.svg
      viewBox="0 0 360 270"
      className="intro-illu pointer-events-none mx-auto h-auto max-h-[min(42vh,270px)] w-full max-w-[340px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease }}
    >
      <defs>
        <linearGradient id="iDesk" x1="180" y1="130" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6b96f7" />
          <stop offset="1" stopColor="#1f4fc4" />
        </linearGradient>
        <linearGradient id="iScreen" x1="180" y1="140" x2="180" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d4e4ff" />
        </linearGradient>
        <linearGradient id="iCloud" x1="180" y1="10" x2="180" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#b4ceff" />
        </linearGradient>
        <linearGradient id="iFolder" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffe69a" />
          <stop offset="1" stopColor="#f0b429" />
        </linearGradient>
        <linearGradient id="iServer" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8eb4ff" />
          <stop offset="1" stopColor="#2f63d8" />
        </linearGradient>
        <radialGradient id="iGlow" cx="50%" cy="42%" r="55%">
          <stop stopColor="#fff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="iShadow" x="-35%" y="-35%" width="170%" height="190%">
          <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#06153f" floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="180" cy="135" rx="160" ry="100" fill="url(#iGlow)" />

      <motion.circle cx="28" cy="48" r="18" fill="#fff" opacity="0.1" {...floatY(0.1, 11, 4.2)} />
      <motion.circle cx="332" cy="64" r="26" fill="#fff" opacity="0.08" {...floatY(0.7, 14, 4.8)} />
      <motion.circle cx="48" cy="200" r="9" fill="#fff" opacity="0.07" {...pulse(0.3)} />

      <motion.ellipse
        cx="180"
        cy="248"
        rx="126"
        ry="12"
        fill="#0a2268"
        opacity="0.4"
        animate={{ scaleX: [1, 1.07, 1], opacity: [0.32, 0.48, 0.32] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main cloud + badge */}
      <motion.g filter="url(#iShadow)" {...floatY(0, 8, 3.3)}>
        <path
          d="M100 82c0-20 15-34 34-34 5 0 11 1 15 4 7-13 20-22 36-22 23 0 42 18 42 41 0 1 0 3-.2 4h11c16 0 30 13 30 29s-14 29-30 29H110c-19 0-34-15-34-33 0-10 5-19 13-26 3-8 7-14 11-18Z"
          fill="url(#iCloud)"
        />
        <path
          d="M124 74c7-11 19-16 30-11 4-9 13-16 24-16 15 0 27 11 28 25"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <motion.g
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "180px 62px" }}
        >
          <circle cx="180" cy="62" r="17" fill="#f6c344" />
          <circle cx="180" cy="62" r="12" fill="#ffd978" opacity="0.55" />
          <path d="M172 62.5 177.5 68 190 54.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
        <motion.path
          d="M160 44c10-10 30-10 40 0"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.5"
          animate={{ opacity: [0.25, 0.7, 0.25], pathLength: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        <motion.path
          d="M152 36c14-14 42-14 56 0"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.28"
          animate={{ opacity: [0.12, 0.4, 0.12] }}
          transition={{ duration: 2.6, delay: 0.2, repeat: Infinity }}
        />
      </motion.g>

      {/* Beam from cloud to desk */}
      <motion.path
        d="M180 100 C180 118 180 128 180 148"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 6"
        animate={{ strokeDashoffset: [0, -20], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M42 190 C90 150 120 130 160 120"
        stroke="#8eb4ff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 5"
        animate={{ strokeDashoffset: [0, -16], opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M310 145 C270 130 230 120 200 118"
        stroke="#ffe08a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 5"
        animate={{ strokeDashoffset: [0, 16], opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Upload stream */}
      {[0, 0.35, 0.7].map((delay, i) => (
        <motion.rect
          key={delay}
          x={168 + i * 8}
          y={98}
          width={5 + (i % 2)}
          height={7}
          rx="2"
          fill={i === 1 ? "#ffe08a" : "#fff"}
          animate={{ y: [0, 34, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Desk / dashboard */}
      <g filter="url(#iShadow)">
        <rect x="82" y="136" width="196" height="84" rx="18" fill="url(#iDesk)" />
        <rect x="82" y="136" width="196" height="20" rx="18" fill="#8eb4ff" opacity="0.35" />
        <rect x="96" y="150" width="168" height="54" rx="11" fill="url(#iScreen)" />
        <circle cx="110" cy="161" r="3.2" fill="#ff7b7b" />
        <circle cx="121" cy="161" r="3.2" fill="#f6c344" />
        <circle cx="132" cy="161" r="3.2" fill="#5ad98c" />
        {[
          ["#9ec0ff", 108],
          ["#f6c344", 146],
          ["#6ea0ff", 184],
          ["#ff9a6b", 222],
        ].map(([color, x], i) => (
          <motion.g
            key={color}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
          >
            <rect x={x} y="170" width="30" height="24" rx="6" fill={color} opacity={color === "#f6c344" ? 0.9 : 1} />
            <rect x={x + 5} y="175" width="20" height="2.5" rx="1.2" fill="#fff" opacity="0.7" />
            <rect x={x + 5} y="181" width="14" height="2.5" rx="1.2" fill="#fff" opacity="0.5" />
          </motion.g>
        ))}
        <rect x="72" y="218" width="216" height="14" rx="5" fill="#143a96" />
        <motion.rect
          x="96"
          y="222"
          width="48"
          height="4"
          rx="2"
          fill="#4d7cf0"
          animate={{ x: [96, 200, 96], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* Server tower */}
      <motion.g filter="url(#iShadow)" {...floatY(0.4, 6, 3.7)}>
        <rect x="16" y="158" width="46" height="64" rx="9" fill="url(#iServer)" />
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x="23"
            y={168 + i * 12}
            width="32"
            height="7"
            rx="2"
            fill="#c5d8ff"
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 1.6, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
        <circle cx="28" cy="210" r="3.2" fill="#5ad98c" />
        <circle cx="39" cy="210" r="3.2" fill="#f6c344" />
        <circle cx="50" cy="210" r="3.2" fill="#ff7b7b" />
      </motion.g>

      {/* Floating folder */}
      <motion.g
        filter="url(#iShadow)"
        animate={{ y: [0, -10, 0], x: [0, 6, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M286 122h20c2.2 0 3.5 1.2 3.5 3.2v3.3h24c3.2 0 5.5 2.2 5.5 5.5v30c0 3.3-2.3 5.5-5.5 5.5H286c-3.2 0-5.5-2.2-5.5-5.5v-36.5c0-3.3 2.3-5.5 5.5-5.5Z" fill="url(#iFolder)" />
        <path d="M286 129h53v4.5H286Z" fill="#fff" opacity="0.35" />
        <path d="M294 142h28M294 150h18" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.45" />
      </motion.g>

      {/* Floating doc */}
      <motion.g
        filter="url(#iShadow)"
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="298" y="40" width="42" height="52" rx="9" fill="#fff" />
        <rect x="306" y="52" width="26" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="306" y="60" width="18" height="3.5" rx="1.5" fill="#9db7ef" />
        <rect x="306" y="68" width="22" height="3.5" rx="1.5" fill="#c5d4f5" />
        <circle cx="319" cy="82" r="6" fill="#5ad98c" opacity="0.85" />
        <path d="M316 82 318 84 323 79" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>

      {/* People */}
      <motion.g {...floatY(0.2, 5, 3)}>
        <circle cx="86" cy="118" r="14" fill="#ffd0b5" />
        <path d="M72 105c8-12 22-8 24 3-9 1-16 1-24-3Z" fill="#1f2433" />
        <path d="M70 136c2-12 28-12 30 0v26H70v-26Z" fill="#3d6fe0" />
        <rect x="70" y="160" width="12" height="26" rx="3" fill="#163d9e" />
        <rect x="88" y="160" width="12" height="26" rx="3" fill="#163d9e" />
        <circle cx="82" cy="116" r="1.5" fill="#5a3a2a" opacity="0.5" />
        <circle cx="90" cy="116" r="1.5" fill="#5a3a2a" opacity="0.5" />
      </motion.g>

      <motion.g {...floatY(0.55, 6, 3.2)}>
        <circle cx="180" cy="102" r="16" fill="#ffc9a8" />
        <path d="M164 87c10-14 28-10 32 4-11 0-22 0-32-4Z" fill="#1a1f2e" />
        <path d="M160 124c3-16 38-16 42 0v32h-42v-32Z" fill="#fff" />
        <rect x="170" y="134" width="24" height="11" rx="3" fill="#6ea0ff" />
        <rect x="166" y="154" width="13" height="30" rx="3" fill="#163d9e" />
        <rect x="185" y="154" width="13" height="30" rx="3" fill="#163d9e" />
        <circle cx="175" cy="100" r="1.6" fill="#5a3a2a" opacity="0.5" />
        <circle cx="185" cy="100" r="1.6" fill="#5a3a2a" opacity="0.5" />
        <path d="M176 107c2.2 2 6.5 2 8.5 0" stroke="#c4886a" strokeWidth="1.4" strokeLinecap="round" />
      </motion.g>

      <motion.g {...floatY(0.9, 5, 3.1)}>
        <circle cx="274" cy="120" r="14" fill="#ffd0b5" />
        <path d="M260 107c9-11 22-7 24 4-9 0-16 0-24-4Z" fill="#1f2433" />
        <path d="M258 138c2-12 28-12 30 0v26h-30v-26Z" fill="#ff8f6b" />
        <rect x="258" y="162" width="12" height="24" rx="3" fill="#163d9e" />
        <rect x="276" y="162" width="12" height="24" rx="3" fill="#163d9e" />
      </motion.g>

      {/* Plant */}
      <motion.g {...floatY(1.1, 4, 4)}>
        <rect x="318" y="188" width="16" height="24" rx="3" fill="#2456c8" />
        <path d="M326 188c-9-16 2-28 2-28s11 12 5 28c-1 3.5-5 3.5-7 0Z" fill="#7dffb2" />
        <path d="M326 186c7-14-3-26-3-26s-10 13-2 28c2 3 4.5 2 5-2Z" fill="#4ad98a" />
      </motion.g>

      {/* Sparkles */}
      <motion.path d="M242 24 246 33 255 37 246 41 242 50 238 41 229 37 238 33Z" fill="#fff" {...pulse(0, 1.18)} />
      <motion.path d="M92 30 95 37 102 40 95 43 92 50 89 43 82 40 89 37Z" fill="#fff" {...pulse(0.6, 1.15)} />
      <motion.circle cx="260" cy="100" r="2.6" fill="#fff" {...pulse(1)} />
      <motion.circle cx="70" cy="70" r="2.2" fill="#f6c344" {...pulse(1.3)} />
    </motion.svg>
  );
}
