"use client";

import { useEffect, useRef } from "react";
import { getMe } from "../services/auth";
import { hasSession, saveSession } from "../lib/session";
import {
  emitLibrarySync,
  getStoredDataRevision,
  setStoredDataRevision,
} from "../lib/sync";
import { isUploadUiOpen } from "../lib/upload";

/** Poll profile quietly; library refetch only when dataRevision changes. */
const POLL_MS = 60_000;
const MIN_GAP_MS = 5_000;
const FOCUS_DEBOUNCE_MS = 800;

/**
 * Keeps account profile in sync across devices.
 * Library lists refresh only when the server dataRevision changes —
 * not on every focus/tab return.
 */
export default function AccountSync() {
  const inFlight = useRef(false);
  const lastSyncAt = useRef(0);
  const focusTimer = useRef(0);

  useEffect(() => {
    async function syncAccount() {
      if (!hasSession() || inFlight.current) return;
      // Don't poke /auth/me (or library sync) while the user is picking a file.
      if (isUploadUiOpen()) return;

      const now = Date.now();
      if (now - lastSyncAt.current < MIN_GAP_MS) return;

      inFlight.current = true;
      try {
        const me = await getMe();
        lastSyncAt.current = Date.now();
        saveSession({ user: me });

        const previous = getStoredDataRevision();
        const next = me?.dataRevision != null ? String(me.dataRevision) : null;

        if (next && next !== previous) {
          setStoredDataRevision(next);
          emitLibrarySync("revision");
        } else if (!previous && next) {
          setStoredDataRevision(next);
        }
      } catch {
        // Pages handle hard auth failures on their own loads.
      } finally {
        inFlight.current = false;
      }
    }

    function scheduleSync() {
      window.clearTimeout(focusTimer.current);
      focusTimer.current = window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          syncAccount();
        }
      }, FOCUS_DEBOUNCE_MS);
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        scheduleSync();
      }
    }

    // Soft first sync (no forced library refetch — page refresh owns that).
    syncAccount();

    window.addEventListener("focus", scheduleSync);
    document.addEventListener("visibilitychange", onVisibility);

    const pollId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        syncAccount();
      }
    }, POLL_MS);

    return () => {
      window.removeEventListener("focus", scheduleSync);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(pollId);
      window.clearTimeout(focusTimer.current);
    };
  }, []);

  return null;
}
