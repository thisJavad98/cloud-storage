"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { easeOut } from "../../lib/motion";

function filePalette(mimeType = "") {
  if (mimeType.startsWith("image/")) {
    return { body: "#f59e0b", tab: "#fcd34d", ink: "#fffbeb", badge: "#b45309" };
  }
  if (mimeType.includes("pdf")) {
    return { body: "#ef4444", tab: "#fca5a5", ink: "#fef2f2", badge: "#b91c1c" };
  }
  if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
    return { body: "#8b5cf6", tab: "#c4b5fd", ink: "#f5f3ff", badge: "#6d28d9" };
  }
  if (mimeType.startsWith("text/") || mimeType.includes("json")) {
    return { body: "#3b82f6", tab: "#93c5fd", ink: "#eff6ff", badge: "#1d4ed8" };
  }
  return { body: "#0ea5e9", tab: "#7dd3fc", ink: "#ecfeff", badge: "#0369a1" };
}

function fileMark(mimeType = "") {
  if (mimeType.startsWith("image/")) return "IMG";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.startsWith("video/")) return "VID";
  if (mimeType.startsWith("audio/")) return "AUD";
  if (mimeType.startsWith("text/")) return "TXT";
  return "DOC";
}

/** Folder = tropical island with grass, sand, palm, and folder hut */
function FolderIslandArt({ accent, uid }) {
  return (
    <svg
      viewBox="0 0 96 88"
      className="h-[76px] w-[88px] drop-shadow-[0_8px_14px_rgba(8,47,73,0.4)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-land`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="45%" stopColor="#4ade80" />
          <stop offset="78%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id={`${uid}-sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id={`${uid}-cliff`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* water glow / reflection */}
      <ellipse cx="48" cy="80" rx="34" ry="7" fill={`url(#${uid}-glow)`} />
      <ellipse cx="48" cy="82" rx="28" ry="4.5" fill="rgba(8,47,73,0.35)" />

      {/* underwater cliff */}
      <path
        d="M22 58 C28 70 40 76 48 76 C56 76 68 70 74 58 L70 52 C62 58 54 60 48 60 C42 60 34 58 26 52 Z"
        fill={`url(#${uid}-cliff)`}
      />

      {/* main land mound */}
      <path
        d="M14 54 C18 42 28 34 40 32 C48 31 56 32 64 36 C74 42 80 50 82 56 C70 62 58 64 48 64 C36 64 24 62 14 54 Z"
        fill={`url(#${uid}-land)`}
      />

      {/* sandy beach ring */}
      <path
        d="M18 54 C26 58 36 60 48 60 C60 60 70 58 78 54 C74 58 62 62 48 62 C34 62 22 58 18 54 Z"
        fill={`url(#${uid}-sand)`}
      />

      {/* palm trunk */}
      <path
        d="M58 34 C60 28 61 22 60 16"
        stroke="#854d0e"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* palm leaves */}
      <path d="M60 16 C48 12 42 8 40 6 C48 10 54 14 60 16 Z" fill="#15803d" />
      <path d="M60 16 C70 10 76 8 80 7 C72 12 66 15 60 16 Z" fill="#16a34a" />
      <path d="M60 16 C66 14 72 18 74 22 C68 18 64 17 60 16 Z" fill="#22c55e" />
      <path d="M60 16 C52 14 48 18 46 22 C52 18 56 17 60 16 Z" fill="#4ade80" />

      {/* folder hut on island */}
      <g transform="translate(24,34)">
        <path
          d="M2 10c0-2.2 1.8-4 4-4h8.2l3 3H30c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V10Z"
          fill={accent}
        />
        <path
          d="M2 13h32v2.2c0 .5-.4.9-.9.9H2.9c-.5 0-.9-.4-.9-.9V13Z"
          fill="rgba(255,255,255,0.28)"
        />
        <path
          d="M6 6h7.4l2.2 2.2H6c-.8 0-1.5.3-2 .8V8c0-1.1.9-2 2-2Z"
          fill="rgba(255,255,255,0.4)"
        />
        <path
          d="M9 20h14M9 24h10"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** File = rocky islet with document standing on sand */
function FileIslandArt({ mimeType, uid }) {
  const palette = filePalette(mimeType);
  const mark = fileMark(mimeType);

  return (
    <svg
      viewBox="0 0 88 84"
      className="h-[72px] w-[78px] drop-shadow-[0_8px_14px_rgba(8,47,73,0.4)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-rock`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="40%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#44403c" />
        </linearGradient>
        <linearGradient id={`${uid}-moss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id={`${uid}-sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="44" cy="76" rx="30" ry="6.5" fill={`url(#${uid}-glow)`} />
      <ellipse cx="44" cy="78" rx="24" ry="4" fill="rgba(8,47,73,0.35)" />

      {/* rock base */}
      <path
        d="M16 56 C20 46 28 40 38 38 C48 36 58 40 66 48 C72 54 74 60 70 64 C60 70 50 72 44 72 C34 72 22 66 16 56 Z"
        fill={`url(#${uid}-rock)`}
      />
      {/* moss patches */}
      <path
        d="M24 52 C30 46 38 44 44 46 C40 50 34 52 28 54 Z"
        fill={`url(#${uid}-moss)`}
        opacity="0.85"
      />
      <path
        d="M50 48 C56 46 62 50 64 56 C58 56 52 54 50 48 Z"
        fill={`url(#${uid}-moss)`}
        opacity="0.7"
      />
      {/* sand shelf */}
      <path
        d="M20 60 C28 64 36 66 44 66 C52 66 60 64 68 60 C62 66 52 70 44 70 C36 70 26 66 20 60 Z"
        fill={`url(#${uid}-sand)`}
      />

      {/* tiny coral / rock tips */}
      <circle cx="26" cy="50" r="2.2" fill="#f97316" opacity="0.8" />
      <circle cx="62" cy="52" r="1.8" fill="#fb7185" opacity="0.75" />

      {/* document on top */}
      <g transform="translate(30,18)">
        <path
          d="M2 4c0-1.4 1.1-2.5 2.5-2.5H16l10 10v28c0 1.4-1.1 2.5-2.5 2.5h-19c-1.4 0-2.5-1.1-2.5-2.5V4Z"
          fill={palette.body}
        />
        <path d="M16 1.5v7.5c0 1.1.9 2 2 2H28L16 1.5Z" fill={palette.tab} />
        <path
          d="M7 20h16M7 25h12M7 30h10"
          stroke={palette.ink}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.8"
        />
        <rect x="7" y="34.5" width="14" height="5.5" rx="1.4" fill={palette.badge} />
        <text
          x="14"
          y="38.6"
          textAnchor="middle"
          fill={palette.ink}
          fontSize="4.2"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {mark}
        </text>
      </g>
    </svg>
  );
}

function IslandArtwork({ kind, mimeType, accent, uid }) {
  if (kind === "file") {
    return <FileIslandArt mimeType={mimeType} uid={uid} />;
  }
  return <FolderIslandArt accent={accent} uid={uid} />;
}

export default function IslandNode({
  item,
  kind,
  x,
  y,
  index,
  meta,
  seaWidth,
  seaHeight,
  onMove,
  onOpen,
}) {
  const reduce = useReducedMotion();
  const dragMoved = useRef(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [pos, setPos] = useState({ x, y });
  const accents = ["#f59e0b", "#fbbf24", "#eab308", "#f97316", "#d97706"];
  const accent = accents[index % accents.length];
  const uid = `isle-${kind}-${item.id || index}`;

  useEffect(() => {
    setPos({ x, y });
    dragX.set(0);
    dragY.set(0);
  }, [x, y, dragX, dragY]);

  return (
    <motion.div
      className="absolute z-10 touch-none select-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, x: dragX, y: dragY }}
      initial={reduce ? false : { opacity: 0, scale: 0.55, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: 16 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.4),
        ease: easeOut,
      }}
      drag={!reduce}
      dragMomentum={false}
      dragElastic={0.12}
      onDragStart={() => {
        dragMoved.current = false;
      }}
      onDrag={() => {
        dragMoved.current = true;
      }}
      onDragEnd={(_e, info) => {
        const width = seaWidth || 1;
        const height = seaHeight || 1;
        const next = {
          x: Math.min(86, Math.max(2, pos.x + (info.offset.x / width) * 100)),
          y: Math.min(78, Math.max(4, pos.y + (info.offset.y / height) * 100)),
        };
        setPos(next);
        dragX.set(0);
        dragY.set(0);
        onMove?.(next);
      }}
      whileHover={reduce ? undefined : { scale: 1.08, zIndex: 30 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      whileDrag={
        reduce ? undefined : { scale: 1.12, zIndex: 40, cursor: "grabbing" }
      }
    >
      <motion.button
        type="button"
        className="island-node group relative flex w-[96px] flex-col items-center outline-none"
        onClick={() => {
          if (dragMoved.current) {
            dragMoved.current = false;
            return;
          }
          onOpen?.(item, kind);
        }}
        aria-label={item.name}
      >
        <motion.div
          className="relative"
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -5, 0],
                  rotate: [0, index % 2 === 0 ? 1.4 : -1.4, 0],
                }
          }
          transition={{
            duration: 3.2 + (index % 4) * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index % 5) * 0.15,
          }}
        >
          <IslandArtwork
            kind={kind}
            mimeType={item.mimeType}
            accent={accent}
            uid={uid}
          />

          {/* soft water ripple under island */}
          {!reduce ? (
            <motion.span
              className="pointer-events-none absolute bottom-1 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-[100%] bg-cyan-200/25 blur-[2px]"
              animate={{
                scaleX: [1, 1.18, 1],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (index % 3) * 0.2,
              }}
            />
          ) : null}
        </motion.div>

        <motion.div
          className="island-label relative -mt-1 max-w-[96px] rounded-2xl px-2 py-1.5 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(120, 53, 15, 0.82) 0%, rgba(69, 26, 3, 0.9) 100%)",
            boxShadow:
              "0 6px 14px rgba(8,47,73,0.35), inset 0 1px 0 rgba(253,230,138,0.25)",
          }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -1, 0],
                }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-amber-200/30" />
          <p className="truncate text-[10px] font-bold leading-tight text-amber-50">
            {item.name}
          </p>
          <p className="mt-0.5 truncate text-[8px] leading-none text-amber-100/75">
            {meta}
          </p>
        </motion.div>

        {!reduce ? (
          <motion.span
            className="pointer-events-none absolute -inset-3 rounded-[40%] border border-cyan-100/20"
            animate={{ opacity: [0, 0.4, 0], scale: [0.88, 1.14, 1.22] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              delay: (index % 4) * 0.35,
              ease: "easeOut",
            }}
          />
        ) : null}
      </motion.button>
    </motion.div>
  );
}
