"use client";

import { useEffect, useRef } from "react";
import { subscribeLibrarySync } from "./sync";

/**
 * Re-run a page's refresh() whenever account data may have changed
 * on another device/tab (or after a local mutation broadcast).
 */
export function useLibrarySync(refresh) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (typeof refresh !== "function") return undefined;

    return subscribeLibrarySync(() => {
      refreshRef.current?.();
    });
  }, [refresh]);
}
