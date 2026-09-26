/** Build href to the page that owns a file, with optional focus query. */
export function getFileDetailHref(file, { focus = true } = {}) {
  if (!file?.id) return "/files";
  const query = focus ? `?file=${encodeURIComponent(file.id)}` : "";
  if (file.folderId) {
    return `/folders/${encodeURIComponent(file.folderId)}${query}`;
  }
  return `/files${query}`;
}

export function readFocusFileIdFromLocation() {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get("file") || "";
  } catch {
    return "";
  }
}
