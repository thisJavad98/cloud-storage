export function openUploadModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cs:open-upload"));
  }
}
