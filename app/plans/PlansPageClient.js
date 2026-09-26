"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppBrand from "../../components/AppBrand";
import BottomNav from "../../components/BottomNav";
import { IconArrow } from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import { MotionBlock, MotionHeader } from "../../components/PageMotion";
import { PlansIllustration } from "../../components/PlansIllustration";
import PlansSection from "../../components/PlansSection";
import Reveal from "../../components/Reveal";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { finishPageLoad } from "../../lib/pageLoading";
import { getAccessToken, getStoredUser } from "../../lib/session";
import { motion } from "motion/react";

function readAuthed() {
  return Boolean(getAccessToken() && getStoredUser());
}

export default function PlansPageClient() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const fromLanding =
    searchParams.get("from") === "landing" ||
    searchParams.get("guest") === "1";

  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let cancelled = false;

    async function boot() {
      setAuthed(readAuthed());
      await finishPageLoad(startedAt);
      if (!cancelled) setReady(true);
    }

    boot();

    function syncAuth() {
      setAuthed(readAuthed());
    }

    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    document.addEventListener("visibilitychange", syncAuth);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
      document.removeEventListener("visibilitychange", syncAuth);
    };
  }, []);

  // Guest chrome when opened from landing, or when there is no session.
  const showAppChrome = authed && !fromLanding;

  if (!ready) {
    return <PageLoader />;
  }

  const backHref = showAppChrome ? "/dashboard" : "/";

  return (
    <main className={`min-h-dvh ${showAppChrome ? "dash-pattern" : "hex-pattern"}`}>
      <div
        className={`phone-shell flex min-h-dvh flex-col ${
          showAppChrome ? "pb-32" : "pb-10"
        }`}
      >
        <MotionHeader
          className={`relative flex items-center justify-center px-5 pt-6 ${
            showAppChrome ? "" : "text-white"
          }`}
        >
          <div className="min-w-0 px-12 text-center">
            <AppBrand
              size="sm"
              showLogo={false}
              tone={showAppChrome ? "ink" : "white"}
              className="justify-center"
            />
            <h1
              className={`mt-0.5 text-base font-extrabold leading-7 ${
                showAppChrome ? "text-cs-ink" : "text-white"
              }`}
            >
              {t("plans.pageTitle")}
            </h1>
          </div>
          <Link
            href={backHref}
            className={`absolute right-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 transition hover:scale-105 ${
              showAppChrome
                ? "bg-white text-cs-ink ring-cs-line"
                : "bg-white/15 text-white ring-white/20 backdrop-blur-[2px]"
            }`}
            aria-label={t("common.back")}
          >
            <IconArrow className="size-5 rotate-180" />
          </Link>
        </MotionHeader>

        <Reveal className="px-5 pt-4" delay={40}>
          <motion.div
            className={`relative overflow-hidden rounded-[1.6rem] px-4 pb-2 pt-3 ${
              showAppChrome
                ? "bg-cs-blue text-white shadow-[0_16px_40px_rgba(31,79,196,0.28)]"
                : "bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-[2px]"
            }`}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="pointer-events-none absolute -end-8 -top-6 size-28 rounded-full bg-white/10"
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1], x: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="pointer-events-none absolute -bottom-10 -start-6 size-24 rounded-full bg-[#f6c344]/20"
              aria-hidden="true"
              animate={{ scale: [1, 1.15, 1], y: [0, -8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative mx-auto max-w-[260px]">
              <PlansIllustration />
            </div>
            <div className="relative pb-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">
                {t("plans.landingEyebrow")}
              </p>
              <p className="mt-1 text-sm font-extrabold leading-6">
                {t("plans.heroTitle")}
              </p>
              <p className="mx-auto mt-1 max-w-[280px] text-[11px] leading-5 text-white/75">
                {t("plans.heroSubtitle")}
              </p>
            </div>
          </motion.div>
        </Reveal>

        <MotionBlock
          delay={0.2}
          className={
            showAppChrome
              ? "px-5 pt-5"
              : "mx-5 mt-5 rounded-[1.6rem] bg-white px-4 pb-5 pt-5 shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
          }
        >
          <PlansSection
            variant={showAppChrome ? "dashboard" : "public"}
            guestMode={!showAppChrome}
          />
        </MotionBlock>

        {showAppChrome ? <BottomNav activeId="files" /> : null}
      </div>
    </main>
  );
}
