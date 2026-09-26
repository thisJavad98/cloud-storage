/** Detect which files can be previewed in-browser */

export const PREVIEW_KINDS = {
  image: "image",
  pdf: "pdf",
  video: "video",
  audio: "audio",
  text: "text",
  none: "none",
};

const TEXT_EXT = new Set([
  "txt",
  "md",
  "markdown",
  "json",
  "csv",
  "log",
  "xml",
  "html",
  "htm",
  "css",
  "js",
  "ts",
  "tsx",
  "jsx",
  "yml",
  "yaml",
  "svg",
]);

const IMAGE_EXT = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "heic",
  "heif",
]);

const VIDEO_EXT = new Set(["mp4", "webm", "ogg", "mov", "m4v"]);
const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "m4a", "aac", "flac"]);
const PDF_EXT = new Set(["pdf"]);

function extensionOf(name = "") {
  const parts = String(name).toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
}

export function getPreviewKind(file = {}) {
  const mime = String(file.mimeType || file.type || "").toLowerCase();
  const ext = extensionOf(file.name || file.originalName || "");

  if (mime.startsWith("image/") || IMAGE_EXT.has(ext)) return PREVIEW_KINDS.image;
  if (mime === "application/pdf" || mime.includes("pdf") || PDF_EXT.has(ext)) {
    return PREVIEW_KINDS.pdf;
  }
  if (mime.startsWith("video/") || VIDEO_EXT.has(ext)) return PREVIEW_KINDS.video;
  if (mime.startsWith("audio/") || AUDIO_EXT.has(ext)) return PREVIEW_KINDS.audio;
  if (
    mime.startsWith("text/") ||
    mime === "application/json" ||
    mime === "application/xml" ||
    mime === "application/javascript" ||
    TEXT_EXT.has(ext)
  ) {
    return PREVIEW_KINDS.text;
  }
  return PREVIEW_KINDS.none;
}

export function canPreviewFile(file) {
  return getPreviewKind(file) !== PREVIEW_KINDS.none;
}

/** Soft limit for loading text into memory for preview */
export const TEXT_PREVIEW_MAX_BYTES = 1.5 * 1024 * 1024;
