"use client";

import { LoadingCloudIllu } from "./MotionIllustrations";

export default function PageLoader({ label = "در حال بارگذاری..." }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 dash-pattern px-6">
      <LoadingCloudIllu className="h-auto w-32" />
      <p className="animate-pulse-soft text-sm font-semibold text-cs-muted">
        {label}
      </p>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="loader-dot loader-dot--a" />
        <span className="loader-dot loader-dot--b" />
        <span className="loader-dot loader-dot--c" />
      </div>
    </main>
  );
}
