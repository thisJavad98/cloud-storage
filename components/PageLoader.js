"use client";

import AppBrand from "./AppBrand";
import { PageLoaderIllu } from "./PageLoaderIllu";
import { useI18n } from "../lib/i18n/I18nProvider";

export default function PageLoader({ label }) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t("common.loading");

  return (
    <main className="page-loader relative flex min-h-dvh flex-col items-center justify-center overflow-hidden dash-pattern px-6">
      <span
        className="page-loader__orb page-loader__orb--a pointer-events-none absolute -start-16 top-16 size-44 rounded-full bg-cs-blue/10"
        aria-hidden="true"
      />
      <span
        className="page-loader__orb page-loader__orb--b pointer-events-none absolute -end-12 bottom-24 size-36 rounded-full bg-[#f6c344]/20"
        aria-hidden="true"
      />

      <div className="phone-shell relative flex w-full flex-col items-center px-5">
        <div className="animate-fade-in mb-5">
          <AppBrand size="md" stacked className="justify-center" />
        </div>

        <div className="page-loader__card relative w-full overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 pt-5 text-center shadow-[0_18px_48px_rgba(31,79,196,0.12)] ring-1 ring-cs-line animate-fade-up">
          <span
            className="page-loader__shine pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-[220px]">
            <PageLoaderIllu />
          </div>

          <p className="relative mt-1 text-sm font-extrabold leading-6 text-cs-ink">
            {resolvedLabel}
          </p>
          <p className="relative mt-1 text-[11px] leading-5 text-cs-muted">
            {t("common.pleaseWait")}
          </p>

          <div className="relative mx-auto mt-4 h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-cs-blue-soft">
            <span className="page-loader__bar absolute inset-y-0 start-0 rounded-full bg-cs-blue" />
          </div>

          <div
            className="relative mt-3.5 flex items-center justify-center gap-1.5"
            aria-hidden="true"
          >
            <span className="loader-dot loader-dot--a" />
            <span className="loader-dot loader-dot--b" />
            <span className="loader-dot loader-dot--c" />
          </div>
        </div>
      </div>
    </main>
  );
}
