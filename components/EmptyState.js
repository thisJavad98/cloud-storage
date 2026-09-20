"use client";

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
    <div
      className={`animate-fade-up rounded-2xl bg-white text-center shadow-sm ring-1 ring-cs-line ${
        compact ? "px-4 py-6" : "px-5 py-10"
      } ${className}`}
    >
      <Illu className={`mx-auto h-auto ${compact ? "w-28" : "w-36"}`} />
      {title ? (
        <p
          className={`font-bold text-cs-ink ${
            compact ? "mt-3 text-sm leading-6" : "mt-4 text-sm leading-7"
          }`}
        >
          {title}
        </p>
      ) : null}
      {description ? (
        <p className="mx-auto mt-1 max-w-[240px] text-xs leading-6 text-cs-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
