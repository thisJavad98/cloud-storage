"use client";

import Link from "next/link";
import { useI18n } from "../lib/i18n/I18nProvider";

function SparkIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3.5v3.2M12 17.3v3.2M3.5 12h3.2M17.3 12h3.2M6.4 6.4l2.3 2.3M15.3 15.3l2.3 2.3M17.6 6.4l-2.3 2.3M8.7 15.3l-2.3 2.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function PlansBanner({
  className = "",
  variant = "dashboard",
  href,
  compact = false,
}) {
  const { t } = useI18n();
  const isLanding = variant === "landing";
  const targetHref = href || (isLanding ? "/plans?from=landing" : "/plans");

  if (isLanding && compact) {
    return (
      <section className={className}>
        <Link
          href={targetHref}
          className="group relative flex items-center gap-3 overflow-hidden rounded-[1.35rem] bg-white px-3.5 py-3 text-cs-ink shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition hover:bg-white/95 active:scale-[0.99]"
        >
          <span
            className="pointer-events-none absolute -end-4 -top-5 size-16 rounded-full bg-cs-blue/10"
            aria-hidden="true"
          />
          <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cs-blue text-white shadow-sm shadow-cs-blue/30 transition group-hover:scale-105">
            <SparkIcon className="size-5 plans-banner__spark" />
          </span>
          <div className="relative min-w-0 flex-1 text-start">
            <p className="text-sm font-extrabold leading-5 text-cs-ink">
              {t("plans.landingBannerTitle")}
            </p>
            <p className="mt-0.5 truncate text-[11px] leading-4 text-cs-muted">
              {t("plans.landingBannerSubtitle")}
            </p>
          </div>
        </Link>
      </section>
    );
  }

  if (isLanding) {
    return (
      <section className={className}>
        <Link
          href={targetHref}
          className="group relative block overflow-hidden rounded-[1.6rem] bg-white p-5 text-cs-ink shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:bg-white/95 active:scale-[0.99]"
        >
          <span
            className="pointer-events-none absolute -end-6 -top-8 size-28 rounded-full bg-cs-blue/10"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-10 -start-4 size-24 rounded-full bg-[#f6c344]/25"
            aria-hidden="true"
          />

          <div className="relative flex items-start gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cs-blue text-white shadow-md shadow-cs-blue/30">
              <SparkIcon className="size-6" />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-[11px] font-bold uppercase tracking-wide text-cs-blue">
                {t("plans.landingEyebrow")}
              </p>
              <h2 className="mt-1 text-base font-extrabold leading-7 text-cs-ink">
                {t("plans.landingBannerTitle")}
              </h2>
              <p className="mt-1.5 text-[12px] leading-6 text-cs-muted">
                {t("plans.landingBannerSubtitle")}
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-cs-blue-soft px-2.5 py-1 text-[10px] font-bold text-cs-blue">
              {t("plans.freeName")}
            </span>
            <span className="rounded-full bg-cs-blue-soft px-2.5 py-1 text-[10px] font-bold text-cs-blue">
              {t("plans.plusName")}
            </span>
            <span className="rounded-full bg-cs-blue-soft px-2.5 py-1 text-[10px] font-bold text-cs-blue">
              {t("plans.proName")}
            </span>
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className={className}>
      <Link
        href={targetHref}
        className="pressable flex items-center gap-3 rounded-[1.4rem] bg-cs-blue-soft/90 px-4 py-3.5 ring-1 ring-cs-blue/10 transition hover:ring-cs-blue/25"
      >
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cs-blue text-white shadow-sm shadow-cs-blue/25">
          <SparkIcon />
        </span>

        <div className="min-w-0 flex-1 text-start">
          <p className="text-sm font-extrabold leading-6 text-cs-ink">
            {t("plans.bannerTitle")}
          </p>
          <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
            {t("plans.bannerSubtitle")}
          </p>
        </div>

        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-cs-blue shadow-sm ring-1 ring-cs-line">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </section>
  );
}
