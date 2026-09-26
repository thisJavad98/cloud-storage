"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  isAddToHomeDismissed,
  isIOSDevice,
  isStandaloneDisplay,
} from "../lib/ios";

/**
 * Soft-redirects first-time iOS Safari visitors to the Add to Home Screen guide.
 * Skips if already installed, dismissed, or not iOS.
 */
export default function IosAddToHomeGate({ enabled = true }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!isIOSDevice()) return;
    if (isStandaloneDisplay()) return;
    if (isAddToHomeDismissed()) return;

    // Avoid interrupting deep links / return visits in the same session
    try {
      if (sessionStorage.getItem("nimbus_a2hs_session") === "1") return;
      sessionStorage.setItem("nimbus_a2hs_session", "1");
    } catch {
      /* ignore */
    }

    router.replace("/add-to-home");
  }, [enabled, router]);

  return null;
}
