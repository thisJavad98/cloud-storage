"use client";

import { useEffect, useRef } from "react";
import { getMe } from "../services/auth";
import { hasSession, saveSession } from "../lib/session";

/**
 * Re-fetches /auth/me when the app becomes visible again so profile
 * changes (avatar, name, …) made on another device show up here.
 */
export default function SessionSync() {
  const inFlight = useRef(false);
  const lastSyncAt = useRef(0);

  useEffect(() => {
    async function syncProfile() {
      if (!hasSession() || inFlight.current) return;

      const now = Date.now();
      if (now - lastSyncAt.current < 2500) return;

      inFlight.current = true;
      try {
        const me = await getMe();
        lastSyncAt.current = Date.now();
        // saveSession emits cs:user-updated for live listeners.
        saveSession({ user: me });
      } catch {
        // Pages handle hard auth failures on their own loads.
      } finally {
        inFlight.current = false;
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") syncProfile();
    }

    window.addEventListener("focus", syncProfile);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", syncProfile);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
