"use client";

import { motion } from "motion/react";

/** Looping SVG scenes for empty / loading moments. */
export function EmptyFoldersIllu({ className = "mx-auto h-auto w-40" }) {
  return (
    <motion.svg
      viewBox="0 0 200 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.ellipse
        cx="100"
        cy="126"
        rx="54"
        ry="7"
        fill="#1f4fc4"
        opacity="0.12"
        animate={{ scaleX: [1, 1.08, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M52 58h36l10 10h50c6 0 10 4 10 10v36c0 6-4 10-10 10H52c-6 0-10-4-10-10V68c0-6 4-10 10-10Z"
          fill="#fff4d4"
        />
        <path d="M52 58h36l10 10H52V58Z" fill="#f6c344" />
        <path
          d="M52 68h96c6 0 10 4 10 10v36c0 6-4 10-10 10H52c-6 0-10-4-10-10V78c0-6 4-10 10-10Z"
          fill="#f6c344"
        />
        <path d="M68 92h64" stroke="#e5a820" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        <path d="M68 104h40" stroke="#e5a820" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      </motion.g>
      <motion.path
        d="M148 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        fill="#1f4fc4"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "150px 42px" }}
      />
      <motion.circle
        cx="44"
        cy="42"
        r="3"
        fill="#f29a4a"
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
        transition={{ duration: 2.2, delay: 0.3, repeat: Infinity }}
      />
      <motion.circle
        cx="160"
        cy="78"
        r="2.5"
        fill="#4d7cf0"
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 1.8, delay: 0.6, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function EmptyFilesIllu({ className = "mx-auto h-auto w-40" }) {
  return (
    <motion.svg
      viewBox="0 0 200 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.ellipse
        cx="100"
        cy="126"
        rx="50"
        ry="7"
        fill="#1f4fc4"
        opacity="0.12"
        animate={{ scaleX: [1, 1.08, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        animate={{ y: [0, -4, 0], rotate: [-4, 0, -4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "107px 70px" }}
      >
        <rect x="78" y="34" width="58" height="72" rx="10" fill="#d7e3ff" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -5, 0], rotate: [3, -2, 3] }}
        transition={{ duration: 3.1, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "97px 76px" }}
      >
        <rect x="68" y="40" width="58" height="72" rx="10" fill="#b8ccf8" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2.9, delay: 0.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="58" y="48" width="58" height="72" rx="10" fill="#ffffff" stroke="#e6e9f0" strokeWidth="2" />
        <rect x="70" y="64" width="34" height="5" rx="2.5" fill="#9db7ef" />
        <rect x="70" y="76" width="26" height="5" rx="2.5" fill="#c5d4f5" />
        <rect x="70" y="88" width="30" height="5" rx="2.5" fill="#c5d4f5" />
        <circle cx="98" cy="108" r="8" fill="#1f4fc4" opacity="0.15" />
        <path d="M94 108h8M98 104v8" stroke="#1f4fc4" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      <motion.path
        d="M150 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        fill="#f29a4a"
        animate={{ scale: [1, 1.22, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "152px 46px" }}
      />
      <motion.circle
        cx="42"
        cy="56"
        r="3"
        fill="#1f4fc4"
        animate={{ opacity: [0.3, 0.85, 0.3], y: [0, -5, 0] }}
        transition={{ duration: 2.4, delay: 0.4, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function LoadingCloudIllu({ className = "mx-auto h-auto w-28" }) {
  return (
    <motion.svg
      viewBox="0 0 160 110"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M44 72c-12 0-22-9-22-20 0-10 7-18 17-20 3-14 15-24 30-24 14 0 26 9 30 21 2-1 4-1 6-1 12 0 22 9 22 21 0 1 0 2-.2 3H126c10 0 18 7 18 17S136 86 126 86H50c-12 0-22-6-22-14 0-1 0-1 .2-2H44Z"
          fill="#1f4fc4"
          opacity="0.9"
        />
        <path
          d="M52 68c-8 0-14-6-14-13 0-6 4-12 10-13 2-10 10-17 20-17 9 0 17 6 20 14h4c8 0 14 6 14 14 0 .5 0 1-.1 1.5H114c7 0 12 4 12 10s-5 10-12 10H56c-8 0-14-4-14-9 0-.5 0-1 .1-1.5H52Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </motion.g>
      {[66, 80, 94].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="72"
          r="3.5"
          fill="#1f4fc4"
          animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}
