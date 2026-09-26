"use client";

import { useEffect } from "react";
import { subscribeUser } from "./session";

/** Keep a page's user state in sync with profile refreshes / other tabs. */
export function useLiveUser(setUser) {
  useEffect(() => {
    if (typeof setUser !== "function") return undefined;
    return subscribeUser((user) => {
      if (user) setUser(user);
    });
  }, [setUser]);
}
