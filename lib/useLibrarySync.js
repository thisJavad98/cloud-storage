"use client";

import { useEffect, useRef } from "react";
import { subscribeLibrarySync } from "./sync";
import { isUploadUiOpen } from "./upload";

const DEBOUNCE_MS = 350;

/**
 * Re-run a page's library refresh when files/folders change
 * (local mutation or cross-device dataRevision bump).
 * Debounced so mutation + onSuccess + upload events collapse to one fetch.
 * Skipped while the upload modal is open so /auth/me + list refresh can't wipe it.
 */
export function useLibrarySync(refresh, { ignoreReasons = [] } = {}) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const ignoreRef = useRef(ignoreReasons);
  ignoreRef.current = ignoreReasons;
  const timerRef = useRef(0);

  useEffect(() => {
    if (typeof refresh !== "function") return undefined;

    return subscribeLibrarySync((detail) => {
      const reason = detail?.reason;
      if (reason && ignoreRef.current.includes(reason)) return;
      if (isUploadUiOpen()) return;

      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (isUploadUiOpen()) return;
        refreshRef.current?.();
      }, DEBOUNCE_MS);
    });
  }, [refresh]);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
}
