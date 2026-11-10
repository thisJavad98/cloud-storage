"use client";

import { useId } from "react";
import { getFolderIcon, normalizeFolderIconId } from "../lib/folderIcons";

function Glyph({ id }) {
  switch (id) {
    case "docs":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
          <path d="M9.4 13h5.2M9.4 14.85h3.4" opacity="0.95" />
          <path d="M14.6 10.7h1.55v5.1c0 .45-.35.8-.8.8H9.65c-.45 0-.8-.35-.8-.8v-5.1H10.4" />
          <path d="M9.4 10.7V9.55c0-.45.35-.8.8-.8h2c.45 0 .8.35.8.8V10.7" />
        </g>
      );
    case "photos":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8.55" y="11.35" width="6.9" height="5.1" rx="1" />
          <circle cx="10.55" cy="13.2" r="0.75" fill="currentColor" stroke="none" />
          <path d="M8.95 15.75l1.85-1.55 1.25 1 1.65-1.45 1.7 2" />
        </g>
      );
    case "music":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.15 11.35v4.95" />
          <circle cx="9.95" cy="16.3" r="1.05" fill="currentColor" stroke="none" />
          <path d="M11.15 11.35c1-.3 2.1-.5 3.15-.5v1.9c-1.05 0-2.1.2-3.15.5" />
        </g>
      );
    case "video":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8.4" y="11.5" width="5.1" height="4.55" rx="0.95" />
          <path d="M13.5 12.85l2.25-1.1v4.1l-2.25-1.1" />
        </g>
      );
    case "code":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.35 12.35 8.85 14l1.5 1.65M13.65 12.35l1.5 1.65-1.5 1.65M11.85 12.2l-.7 3.9" />
        </g>
      );
    case "work":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8.35" y="12.35" width="7.3" height="4.3" rx="1" />
          <path d="M10.25 12.35V11.2c0-.45.35-.8.8-.8h1.9c.45 0 .8.35.8.8v1.15" />
          <path d="M8.35 14.2h7.3" />
        </g>
      );
    case "personal":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
          <circle cx="12" cy="12.55" r="1.25" />
          <path d="M9.35 16.35c.45-1.4 1.5-2.05 2.65-2.05s2.2.65 2.65 2.05" />
        </g>
      );
    case "archive":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8.35" y="11" width="7.3" height="2" rx="0.65" />
          <path d="M8.9 13v3.15c0 .45.35.8.8.8h4.6c.45 0 .8-.35.8-.8V13" />
          <path d="M11.1 14.35h1.8" />
        </g>
      );
    case "star":
      return (
        <path
          d="M12 10.85l.78 1.55 1.72.25-1.25 1.22.3 1.72L12 14.75l-1.55.84.3-1.72-1.25-1.22 1.72-.25L12 10.85Z"
          fill="currentColor"
          stroke="none"
        />
      );
    case "cloud":
      return (
        <path
          d="M9.55 15.55h5.1c1 0 1.85-.78 1.85-1.75 0-.88-.65-1.6-1.5-1.74.04-.18.08-.36.08-.55 0-1.1-.92-2-2.05-2-.92 0-1.7.55-1.98 1.32-.28-.18-.6-.28-.96-.28-.96 0-1.74.74-1.74 1.65 0 .14.02.28.05.4-.78.24-1.35.92-1.35 1.75 0 1 .87 1.85 1.95 1.85h.6Z"
          fill="currentColor"
          stroke="none"
        />
      );
    case "lock":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9.35" y="13.15" width="5.3" height="3.45" rx="0.95" />
          <path d="M10.4 13.15v-1.15c0-.88.7-1.58 1.6-1.58s1.6.7 1.6 1.58v1.15" />
        </g>
      );
    default:
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.7">
          <path d="M9.2 13.7h5.6M9.2 15.45h3.5" />
        </g>
      );
  }
}

/** Colored folder silhouette with tab, depth, and thematic mark. */
export default function FolderIconMark({
  icon = "default",
  className = "size-7",
  color,
  deep,
}) {
  const uid = useId().replace(/:/g, "");
  const id = normalizeFolderIconId(icon);
  const meta = getFolderIcon(id);
  const ink = color || meta.ink;
  const shade = deep || meta.deep || meta.ink;
  const gradId = `fi-body-${uid}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ color: ink }}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="12"
          y1="6"
          x2="12"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={ink} />
          <stop offset="100%" stopColor={shade} />
        </linearGradient>
      </defs>

      <path
        d="M4.1 7.2c0-1 .8-1.8 1.8-1.8h3.2l1.35 1.35H9.2"
        fill={shade}
        opacity="0.88"
      />

      <path
        d="M3.15 8.35c0-1.15.93-2.08 2.08-2.08h3.45L10.3 8h8.45c1.15 0 2.08.93 2.08 2.08v7.2c0 1.15-.93 2.08-2.08 2.08H5.23c-1.15 0-2.08-.93-2.08-2.08V8.35Z"
        fill={`url(#${gradId})`}
      />

      <path
        d="M3.15 10.55h17.68"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      <path
        d="M5.1 11.2h13.8c.55 0 1 .4 1.05.9v.15c0 .1-.05.2-.1.25H5.15c-.15 0-.25-.1-.25-.25v-.15c0-.5.4-.9.9-.9Z"
        fill="rgba(255,255,255,0.16)"
      />

      <g style={{ color: "rgba(255,255,255,0.96)" }}>
        <Glyph id={id} />
      </g>
    </svg>
  );
}
