/** Global upload UI gate — pause account/library sync while the modal is open. */

let uploadUiOpen = false;

export function openUploadModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cs:open-upload"));
  }
}

export function setUploadUiOpen(open) {
  uploadUiOpen = Boolean(open);
}

export function isUploadUiOpen() {
  return uploadUiOpen;
}
