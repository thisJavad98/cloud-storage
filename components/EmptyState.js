"use client";

import { motion } from "motion/react";
import { EmptyFilesIllu, EmptyFoldersIllu } from "./MotionIllustrations";

const ILLU = {
  files: EmptyFilesIllu,
  folders: EmptyFoldersIllu,
};

export default function EmptyState({
  variant = "files",
  title,
  description,
  action = null,
  compact = false,
  className = "",
}) {
  const Illu = ILLU[variant] || EmptyFilesIllu;

  return (
    <motion.div
      className={`rounded-2xl bg-white text-center shadow-sm ring-1 ring-cs-line ${
        compact ? "px-4 py-6" : "px-5 py-10"
      } ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Illu className={`mx-auto h-auto ${compact ? "w-28" : "w-36"}`} />
      {title ? (
        <motion.p
          className={`font-bold text-cs-ink ${
            compact ? "mt-3 text-sm leading-6" : "mt-4 text-sm leading-7"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {title}
        </motion.p>
      ) : null}
      {description ? (
        <motion.p
          className="mx-auto mt-1 max-w-[240px] text-xs leading-6 text-cs-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          {description}
        </motion.p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </motion.div>
  );
}
