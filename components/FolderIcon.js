"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getFolderIcon, normalizeFolderIconId } from "../lib/folderIcons";
import { easeOut } from "../lib/motion";
import FolderIconMark from "./FolderIconMark";

const SIZES = {
  sm: { box: "size-9 rounded-[0.7rem]", mark: "size-5", ring: "rounded-[0.7rem]" },
  md: { box: "size-12 rounded-xl", mark: "size-7", ring: "rounded-xl" },
  lg: { box: "size-14 rounded-2xl", mark: "size-8", ring: "rounded-2xl" },
};

export default function FolderIcon({
  icon = "default",
  size = "md",
  className = "",
  markClassName,
  animated = true,
}) {
  const reduce = useReducedMotion();
  const meta = getFolderIcon(normalizeFolderIconId(icon));
  const dims = SIZES[size] || SIZES.md;
  const mark = markClassName || dims.mark;

  return (
    <span
      className={`folder-icon relative inline-flex shrink-0 items-center justify-center ${dims.box} ${className}`}
      style={{
        background: `linear-gradient(165deg, ${meta.tile} 0%, color-mix(in srgb, ${meta.tile} 72%, white) 100%)`,
        color: meta.ink,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${meta.ink} 12%, transparent)`,
      }}
    >
      <span
        className={`pointer-events-none absolute inset-[3px] ${dims.ring}`}
        style={{
          background: `radial-gradient(120% 90% at 30% 18%, rgba(255,255,255,0.55), transparent 55%)`,
        }}
        aria-hidden="true"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={meta.id}
          className="relative inline-flex"
          initial={
            animated && !reduce ? { opacity: 0, scale: 0.86, y: 3 } : false
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            animated && !reduce
              ? { opacity: 0, scale: 0.9, y: -2 }
              : undefined
          }
          transition={{ duration: 0.22, ease: easeOut }}
        >
          <FolderIconMark
            icon={meta.id}
            className={mark}
            color={meta.ink}
            deep={meta.deep}
          />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
