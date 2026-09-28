"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IconIsland } from "./Icons";
import { useI18n } from "../lib/i18n/I18nProvider";
import { easeOut } from "../lib/motion";

const FISH = [
  { top: "18%", size: 13, duration: 9, delay: 0, dir: 1 },
  { top: "28%", size: 16, duration: 10, delay: 0.6, dir: 1 },
  { top: "36%", size: 11, duration: 12, delay: 3.4, dir: -1 },
  { top: "42%", size: 14, duration: 11, delay: 1.5, dir: 1 },
  { top: "52%", size: 12, duration: 14, delay: 5.2, dir: -1 },
  { top: "58%", size: 15, duration: 13, delay: 2.2, dir: -1 },
  { top: "68%", size: 10, duration: 10.5, delay: 6.8, dir: 1 },
  { top: "74%", size: 13, duration: 12.5, delay: 4, dir: -1 },
];

const SHARKS = [
  { top: "40%", size: 34, duration: 16, delay: 1.2, dir: 1 },
  { top: "62%", size: 28, duration: 19, delay: 7, dir: -1 },
];

function MiniFish({ size = 14, flip = false }) {
  return (
    <svg
      viewBox="0 0 64 36"
      width={size}
      height={size * 0.56}
      className={flip ? "sea-flip" : undefined}
      aria-hidden="true"
    >
      <ellipse cx="30" cy="18" rx="18" ry="11" fill="#ef4444" />
      <ellipse cx="28" cy="22" rx="11" ry="5.5" fill="#fca5a5" opacity="0.55" />
      <path d="M12 18 L1 8 L4 18 L1 28 Z" fill="#dc2626" />
      <circle cx="42" cy="15" r="2.8" fill="#fff" />
      <circle cx="43" cy="15" r="1.4" fill="#1f2937" />
    </svg>
  );
}

function MiniShark({ size = 32, flip = false }) {
  return (
    <svg
      viewBox="0 0 120 52"
      width={size}
      height={size * 0.42}
      className={flip ? "sea-flip" : undefined}
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    >
      <path
        d="M18 28 C28 12 52 8 78 14 C96 18 108 24 114 28 C108 32 96 38 78 40 C52 44 28 40 18 28 Z"
        fill="#334155"
      />
      <path d="M58 14 L66 2 L74 16 Z" fill="#1e293b" />
      <path d="M18 28 L4 10 L10 28 L4 44 Z" fill="#1e293b" />
      <circle cx="96" cy="24" r="2" fill="#e2e8f0" />
      <circle cx="96.5" cy="24" r="1" fill="#0f172a" />
    </svg>
  );
}

function MiniIsland({ className = "" }) {
  return (
    <svg
      viewBox="0 0 72 64"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="36" cy="58" rx="22" ry="4" fill="rgba(8,47,73,0.28)" />
      <path
        d="M12 42 C16 30 26 24 36 24 C46 24 56 30 60 42 C52 48 42 50 36 50 C28 50 18 48 12 42 Z"
        fill="#4ade80"
      />
      <path
        d="M14 42 C22 46 30 48 36 48 C42 48 50 46 58 42 C52 46 44 48 36 48 C28 48 20 46 14 42 Z"
        fill="#fde68a"
      />
      <path
        d="M42 24 C43 18 45 14 48 10"
        stroke="#854d0e"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M48 10 C40 8 36 5 34 3 C40 6 44 9 48 10 Z" fill="#16a34a" />
      <path d="M48 10 C54 7 58 6 62 5 C56 8 52 10 48 10 Z" fill="#22c55e" />
      <rect x="24" y="28" width="16" height="12" rx="2.5" fill="#f59e0b" />
      <path d="M24 31h16" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" />
    </svg>
  );
}

export default function DataSeaBanner({ className = "" }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className={className}>
      <Link
        href="/data-island"
        className="group relative block overflow-hidden rounded-[1.5rem] text-white shadow-[0_16px_36px_rgba(2,132,199,0.35)] ring-1 ring-cyan-200/25 transition active:scale-[0.99]"
        aria-label={t("dashboard.dataSeaBannerCta")}
      >
        {/* sea gradient base */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, #38bdf8 0%, #0ea5e9 35%, #0284c7 70%, #0c4a6e 100%)",
          }}
          animate={
            reduce
              ? undefined
              : { backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* horizon shimmer */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[55%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(224,242,254,0.55), transparent)",
          }}
          animate={reduce ? undefined : { opacity: [0.45, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* animated wave strips */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-[220%] max-w-none"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M0,70 C180,30 360,110 540,70 C720,30 900,110 1080,70 C1260,30 1380,90 1440,70 L1440,180 L0,180 Z"
            fill="rgba(14,116,144,0.35)"
            animate={reduce ? undefined : { x: [0, -120, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 C1320,80 1400,110 1440,100 L1440,180 L0,180 Z"
            fill="rgba(8,47,73,0.4)"
            animate={reduce ? undefined : { x: [0, -180, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* floating bubbles */}
        {!reduce
          ? [12, 28, 48, 68, 84].map((left, i) => (
              <motion.span
                key={`bubble-${i}`}
                className="pointer-events-none absolute bottom-3 rounded-full bg-white/50"
                style={{
                  left: `${left}%`,
                  width: 4 + (i % 3) * 2,
                  height: 4 + (i % 3) * 2,
                }}
                animate={{
                  y: [0, -56 - i * 6],
                  opacity: [0, 0.7, 0],
                  scale: [0.6, 1.1, 0.8],
                }}
                transition={{
                  duration: 3.5 + i * 0.4,
                  delay: i * 0.45,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))
          : null}

        {/* swimming fish + sharks (CSS transform — mobile-safe) */}
        {!reduce
          ? FISH.map((fish, i) => (
              <span
                key={`fish-${i}`}
                className={`pointer-events-none sea-swim-track ${
                  fish.dir === 1 ? "sea-swim-ltr" : "sea-swim-rtl"
                }`}
                style={{
                  top: fish.top,
                  animationDuration: `${fish.duration}s`,
                  animationDelay: `${fish.delay}s`,
                }}
              >
                <span
                  className="sea-creature-bob"
                  style={{
                    animationDuration: "2.2s",
                    animationDelay: `${fish.delay * 0.1}s`,
                  }}
                >
                  <MiniFish size={fish.size} flip={fish.dir === -1} />
                </span>
              </span>
            ))
          : null}

        {!reduce
          ? SHARKS.map((shark, i) => (
              <span
                key={`shark-${i}`}
                className={`pointer-events-none sea-swim-track ${
                  shark.dir === 1 ? "sea-swim-ltr" : "sea-swim-rtl"
                }`}
                style={{
                  top: shark.top,
                  animationDuration: `${shark.duration}s`,
                  animationDelay: `${shark.delay}s`,
                }}
              >
                <span
                  className="sea-creature-bob"
                  style={{
                    animationDuration: "3s",
                    animationDelay: `${shark.delay * 0.1}s`,
                  }}
                >
                  <MiniShark size={shark.size} flip={shark.dir === -1} />
                </span>
              </span>
            ))
          : null}

        {/* content */}
        <div className="relative z-[1] flex items-center gap-3 px-4 py-4">
          <motion.div
            className="relative shrink-0"
            animate={
              reduce
                ? undefined
                : { y: [0, -4, 0], rotate: [0, 2, -1, 0] }
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <MiniIsland className="size-[58px] drop-shadow-[0_8px_12px_rgba(8,47,73,0.35)]" />
            <motion.span
              className="pointer-events-none absolute -inset-1 rounded-full border border-cyan-100/30"
              animate={{ opacity: [0, 0.55, 0], scale: [0.9, 1.15, 1.25] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          <div className="min-w-0 flex-1 text-start">
            <motion.p
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cyan-50 ring-1 ring-white/20 backdrop-blur-sm"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <IconIsland className="size-3.5" />
              {t("dashboard.dataSeaEyebrow")}
            </motion.p>
            <motion.h2
              className="mt-1.5 font-brand text-[17px] leading-6 text-white"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
            >
              {t("dashboard.dataSeaTitle")}
            </motion.h2>
            <motion.p
              className="mt-1 text-[11px] leading-5 text-cyan-50/90"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
            >
              {t("dashboard.dataSeaSubtitle")}
            </motion.p>
          </div>

          <motion.span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/18 text-white ring-1 ring-white/25 backdrop-blur-sm transition group-hover:bg-white/28"
            animate={reduce ? undefined : { x: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="size-4 rtl:rotate-180" fill="none">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </div>

        {/* light sweep */}
        {!reduce ? (
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ left: ["-20%", "120%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        ) : null}
      </Link>
    </section>
  );
}
