"use client";

import { motion, useReducedMotion } from "motion/react";

const BUBBLES = [
  { left: "5%", delay: 0, duration: 9, size: 7 },
  { left: "14%", delay: 1.3, duration: 11, size: 4 },
  { left: "25%", delay: 0.5, duration: 8.5, size: 9 },
  { left: "38%", delay: 2.2, duration: 10.5, size: 5 },
  { left: "50%", delay: 0.9, duration: 9.2, size: 6 },
  { left: "62%", delay: 1.8, duration: 12, size: 4 },
  { left: "73%", delay: 0.3, duration: 8.8, size: 8 },
  { left: "84%", delay: 2.5, duration: 10, size: 5 },
  { left: "93%", delay: 1.1, duration: 11.5, size: 6 },
];

const RAYS = [
  { left: "10%", rotate: -8, delay: 0, width: "14%" },
  { left: "32%", rotate: 4, delay: 0.8, width: "16%" },
  { left: "54%", rotate: -4, delay: 1.5, width: "15%" },
  { left: "76%", rotate: 6, delay: 0.4, width: "14%" },
];

/** Tileable wave bands in a 2880×900 viewBox (two identical halves for seamless drift). */
const WAVE_BANDS = [
  {
    fill: "rgba(186, 230, 253, 0.42)",
    duration: 9,
    yBob: -5,
    d: "M0,110 C180,50 360,170 540,110 C720,50 900,170 1080,110 C1260,50 1380,140 1440,110 C1620,50 1800,170 1980,110 C2160,50 2340,170 2520,110 C2700,50 2820,140 2880,110 L2880,900 L0,900 Z",
  },
  {
    fill: "rgba(56, 189, 248, 0.38)",
    duration: 11,
    yBob: 4,
    d: "M0,210 C200,150 400,270 600,210 C800,150 1000,270 1200,210 C1320,180 1400,240 1440,210 C1640,150 1840,270 2040,210 C2240,150 2440,270 2640,210 C2760,180 2840,240 2880,210 L2880,900 L0,900 Z",
  },
  {
    fill: "rgba(14, 165, 233, 0.46)",
    duration: 13,
    yBob: -6,
    d: "M0,330 C160,270 320,390 480,330 C640,270 800,390 960,330 C1120,270 1280,380 1440,330 C1600,270 1760,390 1920,330 C2080,270 2240,390 2400,330 C2560,270 2720,380 2880,330 L2880,900 L0,900 Z",
  },
  {
    fill: "rgba(2, 132, 199, 0.52)",
    duration: 15,
    yBob: 5,
    d: "M0,470 C180,410 360,530 540,470 C720,410 900,530 1080,470 C1260,410 1380,500 1440,470 C1620,410 1800,530 1980,470 C2160,410 2340,530 2520,470 C2700,410 2820,500 2880,470 L2880,900 L0,900 Z",
  },
  {
    fill: "rgba(12, 74, 110, 0.6)",
    duration: 17,
    yBob: -4,
    d: "M0,610 C200,550 400,670 600,610 C800,550 1000,670 1200,610 C1320,580 1400,640 1440,610 C1640,550 1840,670 2040,610 C2240,550 2440,670 2640,610 C2760,580 2840,640 2880,610 L2880,900 L0,900 Z",
  },
  {
    fill: "rgba(8, 47, 73, 0.76)",
    duration: 19,
    yBob: 3,
    d: "M0,750 C160,700 320,800 480,750 C640,700 800,800 960,750 C1120,700 1280,790 1440,750 C1600,700 1760,800 1920,750 C2080,700 2240,800 2400,750 C2560,700 2720,790 2880,750 L2880,900 L0,900 Z",
  },
];

const FISH = [
  { top: "22%", size: 22, duration: 17, delay: 0.4, direction: 1, bob: 7, opacity: 0.82 },
  { top: "28%", size: 34, duration: 18, delay: 0, direction: 1, bob: 10, opacity: 0.92 },
  { top: "32%", size: 18, duration: 21, delay: 8.5, direction: -1, bob: 6, opacity: 0.78 },
  { top: "36%", size: 30, duration: 20, delay: 7, direction: 1, bob: 9, opacity: 0.88 },
  { top: "40%", size: 24, duration: 15, delay: 1.8, direction: -1, bob: 8, opacity: 0.86 },
  { top: "42%", size: 26, duration: 22, delay: 3, direction: -1, bob: 8, opacity: 0.85 },
  { top: "48%", size: 20, duration: 19, delay: 6.2, direction: 1, bob: 7, opacity: 0.8 },
  { top: "52%", size: 32, duration: 17.5, delay: 4.1, direction: 1, bob: 11, opacity: 0.9 },
  { top: "55%", size: 40, duration: 16, delay: 1.2, direction: 1, bob: 12, opacity: 0.95 },
  { top: "60%", size: 19, duration: 23, delay: 9.5, direction: -1, bob: 6, opacity: 0.76 },
  { top: "64%", size: 28, duration: 18.5, delay: 3.6, direction: 1, bob: 9, opacity: 0.88 },
  { top: "68%", size: 22, duration: 24, delay: 5, direction: -1, bob: 7, opacity: 0.8 },
  { top: "72%", size: 36, duration: 20.5, delay: 0.8, direction: -1, bob: 10, opacity: 0.9 },
  { top: "74%", size: 28, duration: 19, delay: 2.4, direction: -1, bob: 11, opacity: 0.9 },
  { top: "78%", size: 21, duration: 16.5, delay: 11, direction: 1, bob: 8, opacity: 0.84 },
];

const SHARKS = [
  {
    top: "34%",
    size: 78,
    duration: 28,
    delay: 1,
    direction: 1,
    bob: 6,
    opacity: 0.72,
  },
  {
    top: "58%",
    size: 92,
    duration: 34,
    delay: 8,
    direction: -1,
    bob: 8,
    opacity: 0.78,
  },
  {
    top: "76%",
    size: 64,
    duration: 30,
    delay: 14,
    direction: 1,
    bob: 5,
    opacity: 0.65,
  },
];

function RedFish({ size = 32, flip = false, sheenId = "fishSheen" }) {
  return (
    <svg
      viewBox="0 0 64 36"
      width={size}
      height={size * 0.56}
      className={`drop-shadow-[0_3px_6px_rgba(127,29,29,0.35)] ${flip ? "sea-flip" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#ef4444" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="18" rx="18" ry="11" fill="#ef4444" />
      <ellipse cx="30" cy="18" rx="18" ry="11" fill={`url(#${sheenId})`} />
      <ellipse cx="28" cy="22" rx="12" ry="6" fill="#fca5a5" opacity="0.55" />
      <path d="M12 18 L1 8 L4 18 L1 28 Z" fill="#dc2626" />
      <path d="M12 18 L3 12 L5 18 L3 24 Z" fill="#b91c1c" opacity="0.7" />
      <path d="M26 8 C30 2 38 4 40 9 C34 8 28 10 26 8Z" fill="#b91c1c" />
      <path d="M28 22 C32 28 38 27 40 22 C35 24 30 23 28 22Z" fill="#dc2626" />
      <circle cx="42" cy="15" r="3.2" fill="#fff" />
      <circle cx="43" cy="15" r="1.6" fill="#1f2937" />
      <path
        d="M47 19 C49 20 50 21 49 22"
        stroke="#991b1b"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Shark({ size = 80, flip = false, sheenId = "sharkSheen" }) {
  const h = size * 0.42;
  return (
    <svg
      viewBox="0 0 120 52"
      width={size}
      height={h}
      className={`drop-shadow-[0_4px_10px_rgba(15,23,42,0.35)] ${flip ? "sea-flip" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <path
        d="M18 28 C28 12 52 8 78 14 C96 18 108 24 114 28 C108 32 96 38 78 40 C52 44 28 40 18 28 Z"
        fill={`url(#${sheenId})`}
      />
      <path
        d="M34 30 C48 34 68 34 86 30 C74 36 52 38 36 32 Z"
        fill="#cbd5e1"
        opacity="0.55"
      />
      <path d="M58 14 L66 2 L74 16 Z" fill="#1e293b" />
      <path d="M54 32 L68 42 L62 32 Z" fill="#334155" />
      <path d="M18 28 L4 10 L10 28 L4 44 Z" fill="#1e293b" />
      <circle cx="96" cy="24" r="2.4" fill="#e2e8f0" />
      <circle cx="96.6" cy="24" r="1.2" fill="#0f172a" />
      <path
        d="M84 22 v10M88 21.5 v11M92 22 v10"
        stroke="#94a3b8"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M110 26 C114 27 116 28 114 30"
        stroke="#94a3b8"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

function SwimmingCreature({ item, index, reduce, kind = "fish" }) {
  const goingRight = item.direction === 1;
  const height = kind === "shark" ? item.size * 0.42 : item.size * 0.56;
  const bobDuration = kind === "shark" ? 3.6 : 2.8 + (index % 3) * 0.4;
  const wiggleDuration = kind === "shark" ? 0.9 : 0.55;

  if (reduce) {
    return (
      <div
        className="sea-creature absolute"
        style={{
          top: item.top,
          left: `${12 + (index * 11) % 70}%`,
          width: item.size,
          height,
          opacity: item.opacity,
          zIndex: kind === "shark" ? 3 : 2,
        }}
      >
        {kind === "shark" ? (
          <Shark size={item.size} flip={!goingRight} sheenId={`sharkSheen-${index}`} />
        ) : (
          <RedFish size={item.size} flip={!goingRight} sheenId={`fishSheen-${index}`} />
        )}
      </div>
    );
  }

  return (
    <div
      className={`sea-creature sea-swim-track ${goingRight ? "sea-swim-ltr" : "sea-swim-rtl"}`}
      style={{
        top: item.top,
        width: item.size,
        height,
        opacity: item.opacity,
        zIndex: kind === "shark" ? 3 : 2,
        animationDuration: `${item.duration}s`,
        animationDelay: `${item.delay}s`,
      }}
    >
      <div
        className="sea-creature-bob"
        style={{
          animationDuration: `${bobDuration}s`,
          animationDelay: `${item.delay * 0.15}s`,
        }}
      >
        <div
          className="sea-creature-wiggle"
          style={{
            animationDuration: `${wiggleDuration}s`,
            animationDelay: `${item.delay * 0.08}s`,
            transformOrigin: goingRight ? "25% 50%" : "75% 50%",
          }}
        >
          {kind === "shark" ? (
            <Shark
              size={item.size}
              flip={!goingRight}
              sheenId={`sharkSheen-${index}`}
            />
          ) : (
            <RedFish
              size={item.size}
              flip={!goingRight}
              sheenId={`fishSheen-${index}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeaBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      className="sea-stage pointer-events-none absolute inset-0 z-0 h-dvh min-h-dvh w-screen max-w-none overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="sea-gradient absolute inset-0 h-full w-full"
        animate={
          reduce
            ? undefined
            : { backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="sea-horizon absolute inset-x-0 top-0 h-[42%] w-full"
        animate={
          reduce
            ? undefined
            : { opacity: [0.45, 0.85, 0.5], scaleY: [1, 1.05, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {RAYS.map((ray, i) => (
        <motion.div
          key={`ray-${i}`}
          className="sea-ray absolute top-0 h-[55%] origin-top"
          style={{
            left: ray.left,
            width: ray.width,
            rotate: `${ray.rotate}deg`,
          }}
          animate={
            reduce
              ? undefined
              : {
                  opacity: [0.08, 0.3, 0.1],
                  scaleY: [0.9, 1.12, 0.95],
                }
          }
          transition={{
            duration: 5.5 + i * 0.7,
            delay: ray.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Full-viewport wave stack — SVG covers entire screen */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {WAVE_BANDS.map((band, i) => (
          <motion.svg
            key={`wave-${i}`}
            className="sea-wave-svg absolute top-0 left-0 h-full"
            viewBox="0 0 2880 900"
            preserveAspectRatio="none"
            initial={false}
            animate={
              reduce
                ? undefined
                : {
                    x: ["0%", "-50%"],
                    y: [0, band.yBob, 0],
                  }
            }
            transition={{
              x: {
                duration: band.duration,
                repeat: Infinity,
                ease: "linear",
              },
              y: {
                duration: band.duration * 0.55,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <path d={band.d} fill={band.fill} />
          </motion.svg>
        ))}
      </div>

      {/* Red fish + sharks swimming through the sea */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {FISH.map((fish, i) => (
          <SwimmingCreature
            key={`fish-${i}`}
            item={fish}
            index={i}
            reduce={reduce}
            kind="fish"
          />
        ))}
        {SHARKS.map((shark, i) => (
          <SwimmingCreature
            key={`shark-${i}`}
            item={shark}
            index={i}
            reduce={reduce}
            kind="shark"
          />
        ))}
      </div>

      <motion.div
        className="sea-caustics absolute inset-0 h-full w-full"
        animate={
          reduce
            ? undefined
            : {
                backgroundPosition: ["0% 0%", "70% 50%", "20% 90%", "0% 0%"],
                opacity: [0.3, 0.55, 0.38, 0.48],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="sea-foam absolute inset-x-0 bottom-0 h-[18%] w-full"
        animate={
          reduce
            ? undefined
            : { opacity: [0.7, 1, 0.8], y: [0, -4, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {BUBBLES.map((b, i) => (
        <motion.span
          key={`bubble-${i}`}
          className="sea-bubble absolute bottom-[8%] rounded-full"
          style={{ left: b.left, width: b.size, height: b.size }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, "-85vh"],
                  x: [0, i % 2 === 0 ? 24 : -20, 8],
                  opacity: [0, 0.85, 0],
                  scale: [0.5, 1.2, 0.8],
                }
          }
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.div
        className="sea-shimmer absolute inset-0 h-full w-full"
        animate={
          reduce
            ? undefined
            : { backgroundPosition: ["0% 20%", "100% 80%", "0% 20%"] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="sea-swell absolute inset-x-0 top-[20%] h-[55%] w-full"
        animate={
          reduce
            ? undefined
            : { x: ["-3%", "3%", "-3%"], opacity: [0.18, 0.32, 0.2] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
