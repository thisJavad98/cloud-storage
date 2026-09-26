"use client";

import { useEffect, useRef } from "react";
import { getMe } from "../services/auth";
import { hasSession, saveSession } from "../lib/session";
import {
  emitLibrarySync,
  getStoredDataRevision,
  setStoredDataRevision,
} from "../lib/sync";

const POLL_MS = 8000;
const MIN_GAP_MS = 2000;

/**
 * Keeps the whole account in sync across devices:
 * - avatar / profile via /auth/me
 * - files + folders via library-sync events when dataRevision changes
 * - also polls while the app is visible
 */
export default function AccountSync() {
  const inFlight = useRef(false);
  const lastSyncAt = useRef(0);

  useEffect(() => {
    async function syncAccount({ forceLibrary = false } = {}) {
      if (!hasSession() || inFlight.current) return;

      const now = Date.now();
      if (now - lastSyncAt.current < MIN_GAP_MS) return;

      inFlight.current = true;
      try {
        const me = await getMe();
        lastSyncAt.current = Date.now();
        saveSession({ user: me });

        const previous = getStoredDataRevision();
        const next = me?.dataRevision != null ? String(me.dataRevision) : null;

        if (forceLibrary || (next && next !== previous)) {
          if (next) setStoredDataRevision(next);
          emitLibrarySync(forceLibrary ? "focus" : "revision");
        } else if (!previous && next) {
          setStoredDataRevision(next);
        }
      } catch {
        // Pages handle hard auth failures on their own loads.
      } finally {
        inFlight.current = false;
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") {
        syncAccount({ forceLibrary: true });
      }
    }

    function onFocus() {
      syncAccount({ forceLibrary: true });
    }

    // First paint: pull latest account state.
    syncAccount({ forceLibrary: true });

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const pollId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        syncAccount({ forceLibrary: false });
      }
    }, POLL_MS);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(pollId);
    };
  }, []);

  return null;
}
