/** Curated folder icons for Nimbus — warm palette, no violet. */

export const DEFAULT_FOLDER_ICON = "default";

export const FOLDER_ICONS = [
  {
    id: "default",
    labelKey: "folders.icons.default",
    tile: "#fff6de",
    ink: "#e2a512",
    deep: "#c48a0a",
    accent: "#f0b429",
  },
  {
    id: "docs",
    labelKey: "folders.icons.docs",
    tile: "#e9f0fb",
    ink: "#3d6fbf",
    deep: "#2f5aa0",
    accent: "#4a7fd4",
  },
  {
    id: "photos",
    labelKey: "folders.icons.photos",
    tile: "#ffe9df",
    ink: "#e8782a",
    deep: "#c96118",
    accent: "#f08a3a",
  },
  {
    id: "music",
    labelKey: "folders.icons.music",
    tile: "#e5f6f1",
    ink: "#0f8f82",
    deep: "#0b7268",
    accent: "#14b8a6",
  },
  {
    id: "video",
    labelKey: "folders.icons.video",
    tile: "#ffe6ea",
    ink: "#d94864",
    deep: "#b8344e",
    accent: "#e85d76",
  },
  {
    id: "code",
    labelKey: "folders.icons.code",
    tile: "#eef1f5",
    ink: "#526176",
    deep: "#3e4d5f",
    accent: "#64748b",
  },
  {
    id: "work",
    labelKey: "folders.icons.work",
    tile: "#fff0e4",
    ink: "#c96118",
    deep: "#a34e12",
    accent: "#e8782a",
  },
  {
    id: "personal",
    labelKey: "folders.icons.personal",
    tile: "#fde9ef",
    ink: "#c93d72",
    deep: "#a82f5c",
    accent: "#db2777",
  },
  {
    id: "archive",
    labelKey: "folders.icons.archive",
    tile: "#f4ebe2",
    ink: "#8f5a2b",
    deep: "#73461f",
    accent: "#b45309",
  },
  {
    id: "star",
    labelKey: "folders.icons.star",
    tile: "#fff8dc",
    ink: "#d97706",
    deep: "#b45309",
    accent: "#f59e0b",
  },
  {
    id: "cloud",
    labelKey: "folders.icons.cloud",
    tile: "#e6f4fc",
    ink: "#1f87b8",
    deep: "#176d96",
    accent: "#0ea5e9",
  },
  {
    id: "lock",
    labelKey: "folders.icons.lock",
    tile: "#f0f1f4",
    ink: "#5b6472",
    deep: "#444c58",
    accent: "#6b7280",
  },
];

const FOLDER_ICON_MAP = Object.fromEntries(
  FOLDER_ICONS.map((item) => [item.id, item]),
);

export function getFolderIcon(iconId) {
  return FOLDER_ICON_MAP[iconId] || FOLDER_ICON_MAP[DEFAULT_FOLDER_ICON];
}

export function normalizeFolderIconId(iconId) {
  return FOLDER_ICON_MAP[iconId] ? iconId : DEFAULT_FOLDER_ICON;
}
