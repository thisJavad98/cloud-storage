"use client";

import Link from "next/link";
import { cloneElement, isValidElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import AppBrand from "./AppBrand";
import AuthAurora from "./AuthAurora";
import LanguageSwitcher from "./LanguageSwitcher";
import { IconArrow } from "./Icons";
import { useI18n } from "../lib/i18n/I18nProvider";

const ease = [0.22, 1, 0.36, 1];

/**
 * Auth chrome: stacked phone sheet on small screens, split brand + form on desktop.
 * Design read: Leafnik-light product auth — dials 5 / 5 / 4.
 */
export default function AuthShell({
  mode = "login",
  title,
  backHref = "/",
  illustration,
  children,
  footer,
  redirect = null,
}) {
  const { t, brandName } = useI18n();
  const reduce = useReducedMotion();

  const points =
    mode === "signup"
      ? [
          t("auth.desktopPoint1"),
          t("auth.desktopPoint2"),
          t("auth.desktopPoint3"),
        ]
      : [
          t("auth.desktopPoint1"),
          t("auth.desktopPoint2"),
          t("auth.desktopPointLogin"),
        ];

  // Clone so mobile + desktop each get a real instance (unique SVG def ids).
  const mobileIllustration = isValidElement(illustration)
    ? cloneElement(illustration, { key: "auth-illu-mobile" })
    : illustration;
  const desktopIllustration = isValidElement(illustration)
    ? cloneElement(illustration, { key: "auth-illu-desktop" })
    : illustration;

  return (
    <main className="auth-screen hex-pattern auth-stage auth-desktop">
      {redirect}
      <AuthAurora />

      {/* Mobile / tablet — existing phone shell */}
      <div className="phone-shell auth-shell relative z-[1] flex h-full min-h-0 flex-col overflow-hidden lg:hidden">
        <div className="relative z-0 flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 pb-1 pt-6">
          {mobileIllustration}
        </div>

        <motion.section
          className="auth-sheet relative z-10 shrink-0 px-6 pb-8 pt-3"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease }}
        >
          <div className="mb-5 flex justify-center">
            <AppBrand size="sm" tone="blue" />
          </div>
          <div className="mb-6 flex items-center gap-3 sm:mb-7">
            <h1 className="text-2xl font-extrabold leading-none text-cs-ink">
              {title}
            </h1>
            <Link
              href={backHref}
              className="icon-label relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-cs-blue"
              aria-label={t("common.back")}
            >
              <IconArrow className="size-5" />
            </Link>
          </div>
          {children}
          {footer}
        </motion.section>
      </div>

      {/* Desktop — split brand stage + form panel */}
      <div className="relative z-[1] mx-auto hidden h-full min-h-0 w-full max-w-[1200px] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] overflow-hidden lg:grid lg:rounded-[2rem] lg:shadow-[0_32px_90px_rgba(4,18,60,0.4)]">
        <aside className="auth-desktop-panel relative flex min-h-0 flex-col overflow-hidden p-8 xl:p-10">
          <div className="pointer-events-none absolute inset-0 auth-desktop-panel__glow" aria-hidden />
          <div className="relative z-[1] flex shrink-0 items-start justify-between gap-4">
            <Link href="/" className="inline-flex">
              <AppBrand tone="white" size="sm" animated={false} />
            </Link>
            <LanguageSwitcher tone="dark" />
          </div>

          <motion.div
            className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center gap-6 py-6"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="auth-desktop-illu flex w-full shrink-0 items-center justify-center">
              {desktopIllustration}
            </div>
            <div className="mx-auto max-w-[34ch] shrink-0 text-center">
              <p className="font-brand text-3xl leading-none text-white xl:text-4xl">
                {t("auth.welcome", { name: brandName })}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75 xl:text-base">
                {t("auth.desktopBody")}
              </p>
            </div>
          </motion.div>

          <ul className="relative z-[1] shrink-0 space-y-2.5 pt-1">
            {points.map((point, index) => (
              <motion.li
                key={point}
                className="flex items-start gap-2.5 text-sm font-semibold text-white/90"
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.08, ease }}
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ffd166]" />
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </aside>

        <motion.section
          className="relative flex flex-col justify-center bg-[var(--cs-card)] px-10 py-12 xl:px-14"
          initial={reduce ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cs-blue">
                {mode === "signup" ? t("auth.signup") : t("auth.login")}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-cs-ink xl:text-4xl">
                {title}
              </h1>
            </div>
            <Link
              href={backHref}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cs-surface text-cs-blue ring-1 ring-cs-line transition hover:bg-cs-blue-soft hover:ring-cs-blue/25"
              aria-label={t("common.back")}
            >
              <IconArrow className="size-5" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[420px]">{children}</div>
          <div className="mx-auto mt-2 w-full max-w-[420px]">{footer}</div>
        </motion.section>
      </div>
    </main>
  );
}
