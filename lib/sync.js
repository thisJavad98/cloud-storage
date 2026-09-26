/** Cross-device / cross-tab library sync signals */

export const LIBRARY_SYNC_EVENT = "cs:library-sync";
export const DATA_REVISION_KEY = "cs_data_revision";

export function emitLibrarySync(reason = "manual") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LIBRARY_SYNC_EVENT, {
      detail: { reason, at: Date.now() },
    })
  );
  try {
    // Wake other tabs in the same browser.
    localStorage.setItem("cs_library_sync_ping", String(Date.now()));
  } catch {
    // ignore quota / private mode
  }
}

export function subscribeLibrarySync(handler) {
  if (typeof window === "undefined") return () => {};

  function onCustom(event) {
    handler(event.detail || { reason: "event" });
  }

  function onStorage(event) {
    if (event.key === "cs_library_sync_ping" && event.newValue) {
      handler({ reason: "storage", at: Number(event.newValue) || Date.now() });
    }
  }

  window.addEventListener(LIBRARY_SYNC_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LIBRARY_SYNC_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function getStoredDataRevision() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DATA_REVISION_KEY);
}

export function setStoredDataRevision(revision) {
  if (typeof window === "undefined" || revision == null) return;
  localStorage.setItem(DATA_REVISION_KEY, String(revision));
}
