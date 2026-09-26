"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasSession } from "../lib/session";

/** Redirects authenticated users away from public landing / auth screens. */
export default function AuthRedirect({ to = "/dashboard" }) {
  const router = useRouter();

  useEffect(() => {
    if (hasSession()) {
      router.replace(to);
    }
  }, [router, to]);

  return null;
}
