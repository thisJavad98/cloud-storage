"use client";

import { LoadingCloudIllu } from "./MotionIllustrations";
import { useI18n } from "../lib/i18n/I18nProvider";

export default function PageLoader({ label }) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("common.loading");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 dash-pattern px-6">
      <LoadingCloudIllu className="h-auto w-32" />
      <p className="animate-pulse-soft text-sm font-semibold text-cs-muted">
        {resolvedLabel}
      </p>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="loader-dot loader-dot--a" />
        <span className="loader-dot loader-dot--b" />
        <span className="loader-dot loader-dot--c" />
      </div>
    </main>
  );
}
