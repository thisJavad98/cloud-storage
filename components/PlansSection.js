"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { formatDigits } from "../lib/format";
import { useI18n } from "../lib/i18n/I18nProvider";
import { PLANS } from "../lib/plans";
import { notifyInfo } from "../lib/toast";

function CheckIcon({ className = "size-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatPrice(amount, locale) {
  try {
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
      amount
    );
  } catch {
    return formatDigits(amount, locale);
  }
}

function formatStorageLabel(gb, t, locale) {
  if (gb >= 1024) {
    const tb = gb / 1024;
    const value = Number.isInteger(tb) ? String(tb) : tb.toFixed(1);
    return t("plans.storage", {
      size: `${formatDigits(value, locale)}\u00A0${t("common.tb")}`,
    });
  }
  return t("plans.storage", {
    size: `${formatDigits(gb, locale)}\u00A0${t("common.gb")}`,
  });
}

function storageFillPercent(gb) {
  const max = 1024;
  return Math.max(12, Math.min(100, Math.round((gb / max) * 100)));
}

export default function PlansSection({
  variant = "dashboard",
  className = "",
  guestMode = false,
}) {
  const { t, locale } = useI18n();
  const isLanding = variant === "landing";
  const isPublic = variant === "public" || guestMode;

  const handleSelect = (planId) => {
    if (planId === "free") return;
    notifyInfo(t("plans.comingSoon"));
  };

  return (
    <section className={className}>
      <div className={`mb-5 ${isLanding ? "text-center" : ""}`}>
        <h2
          className={`text-base font-extrabold leading-7 ${
            isLanding ? "text-white" : "text-cs-ink"
          }`}
        >
          {t("plans.title")}
        </h2>
        <p
          className={`mt-1 text-xs leading-6 ${
            isLanding ? "text-white/70" : "text-cs-muted"
          }`}
        >
          {t("plans.subtitle")}
        </p>
      </div>

      <div className="space-y-3.5">
        {PLANS.map((plan, index) => {
          const name = t(`plans.${plan.id}Name`);
          const desc = t(`plans.${plan.id}Desc`);
          const features = [
            t(`plans.${plan.id}Feature1`),
            t(`plans.${plan.id}Feature2`),
            t(`plans.${plan.id}Feature3`),
          ];
          const isFree = plan.priceMonthly === 0;
          const storageLabel = formatStorageLabel(plan.storageGb, t, locale);
          const fill = storageFillPercent(plan.storageGb);

          const cardClass = isLanding
            ? plan.featured
              ? "plans-card plans-card--featured relative overflow-hidden rounded-[1.35rem] bg-white p-4 text-cs-ink shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
              : "plans-card relative overflow-hidden rounded-[1.35rem] bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur-[2px]"
            : plan.featured
              ? "plans-card plans-card--featured relative overflow-hidden rounded-[1.35rem] bg-cs-blue p-4 text-white shadow-[0_16px_40px_rgba(31,79,196,0.32)]"
              : "plans-card relative overflow-hidden rounded-[1.35rem] bg-white p-4 text-cs-ink shadow-sm ring-1 ring-cs-line";

          const mutedClass = isLanding
            ? plan.featured
              ? "text-cs-muted"
              : "text-white/65"
            : plan.featured
              ? "text-white/75"
              : "text-cs-muted";

          const featureIconClass = isLanding
            ? plan.featured
              ? "bg-cs-blue-soft text-cs-blue"
              : "bg-white/15 text-white"
            : plan.featured
              ? "bg-white/15 text-white"
              : "bg-cs-blue-soft text-cs-blue";

          const ctaClass = isLanding
            ? plan.featured
              ? "bg-cs-blue text-white hover:bg-cs-blue-deep"
              : "bg-white/15 text-white ring-1 ring-white/20 hover:bg-white/20"
            : plan.featured
              ? "bg-white text-cs-blue hover:bg-white/95"
              : "bg-cs-blue-soft text-cs-blue hover:bg-cs-blue-soft/80";

          const meterTrack = isLanding
            ? plan.featured
              ? "bg-cs-blue-soft"
              : "bg-white/20"
            : plan.featured
              ? "bg-white/20"
              : "bg-cs-blue-soft";

          const meterFill = isLanding
            ? plan.featured
              ? "bg-cs-blue"
              : "bg-white"
            : plan.featured
              ? "bg-white"
              : "bg-cs-blue";

          const priceNode = isFree ? (
            <span className="text-xl font-extrabold leading-none tracking-tight">
              {t("plans.free")}
            </span>
          ) : (
            <span className="inline-flex flex-col items-end gap-0.5">
              <span className="text-xl font-extrabold leading-none tracking-tight">
                {formatPrice(plan.priceMonthly, locale)}
              </span>
              <span className={`text-[10px] font-medium ${mutedClass}`}>
                {t("plans.currency")} / {t("plans.perMonth")}
              </span>
            </span>
          );

          const buttonLabel = isFree
            ? isLanding || isPublic
              ? t("landing.freeSignup")
              : t("plans.current")
            : isLanding || isPublic
              ? t("plans.choose")
              : t("plans.upgrade");

          const showSignupLink =
            (isLanding || isPublic) && (isFree || isPublic);

          return (
            <Reveal
              key={plan.id}
              as="article"
              delay={index * 90}
              className={cardClass}
            >
              {plan.featured ? (
                <span className="plans-card__shine pointer-events-none absolute inset-0" aria-hidden="true" />
              ) : null}

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold leading-6">{name}</h3>
                    {plan.featured ? (
                      <span
                        className={`plans-card__badge rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isLanding
                            ? "bg-cs-blue-soft text-cs-blue"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        {t("plans.popular")}
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-1 text-[11px] leading-5 ${mutedClass}`}>
                    {desc}
                  </p>
                </div>
                <div className="shrink-0">{priceNode}</div>
              </div>

              <div className="relative mt-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p
                    className={`text-xs font-bold leading-5 ${
                      (isLanding && !plan.featured) ||
                      (!isLanding && plan.featured)
                        ? "text-white"
                        : "text-cs-ink"
                    }`}
                  >
                    {storageLabel}
                  </p>
                  <span className={`text-[10px] font-bold ${mutedClass}`}>
                    {formatDigits(fill, locale)}%
                  </span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${meterTrack}`}>
                  <div
                    className={`plans-card__meter h-full rounded-full ${meterFill}`}
                    style={{
                      width: `${fill}%`,
                      animationDelay: `${180 + index * 120}ms`,
                    }}
                  />
                </div>
              </div>

              <ul className="relative mt-4 space-y-2">
                {features.map((feature, featureIndex) => (
                  <li
                    key={feature}
                    className="plans-card__feature flex items-start gap-2"
                    style={{ animationDelay: `${260 + index * 80 + featureIndex * 60}ms` }}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${featureIconClass}`}
                    >
                      <CheckIcon />
                    </span>
                    <span className={`text-[11px] leading-5 ${mutedClass}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {showSignupLink ? (
                <Link
                  href="/signup"
                  className={`pressable relative mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition ${ctaClass}`}
                >
                  {buttonLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={isFree && !isLanding && !isPublic}
                  onClick={() => handleSelect(plan.id)}
                  className={`pressable relative mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition disabled:cursor-default disabled:opacity-70 ${ctaClass}`}
                >
                  {buttonLabel}
                </button>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
