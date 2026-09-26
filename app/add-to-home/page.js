"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AddToHomeIllustration from "../../components/AddToHomeIllustration";
import AppBrand from "../../components/AppBrand";
import AuthAurora from "../../components/AuthAurora";
import PageLoader from "../../components/PageLoader";
import { useI18n } from "../../lib/i18n/I18nProvider";
import {
  dismissAddToHome,
  isIOSDevice,
  isStandaloneDisplay,
} from "../../lib/ios";

const ease = [0.22, 1, 0.36, 1];

function StepIconShare({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="7" y="10" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 4v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M8.5 7.5 12 4l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepIconMenu({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function StepIconHome({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AddToHomePage() {
  const router = useRouter();
  const { t, brandName } = useI18n();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isStandaloneDisplay()) {
      router.replace("/dashboard");
      return;
    }
    if (!isIOSDevice()) {
      router.replace("/");
      return;
    }
    setAllowed(true);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 2800);
    return () => window.clearInterval(id);
  }, [ready]);

  function handleContinue() {
    dismissAddToHome();
    router.push("/login");
  }

  function handleSkip() {
    dismissAddToHome();
    router.push("/");
  }

  if (!ready || !allowed) {
    return <PageLoader label={t("a2hs.checking")} />;
  }

  const steps = [
    {
      icon: StepIconShare,
      title: t("a2hs.step1Title"),
      text: t("a2hs.step1Text"),
      tip: t("a2hs.step1Tip"),
    },
    {
      icon: StepIconMenu,
      title: t("a2hs.step2Title"),
      text: t("a2hs.step2Text"),
      tip: t("a2hs.step2Tip"),
    },
    {
      icon: StepIconHome,
      title: t("a2hs.step3Title"),
      text: t("a2hs.step3Text"),
      tip: t("a2hs.step3Tip"),
    },
  ];

  return (
    <main className="auth-screen hex-pattern auth-stage a2hs-page">
      <AuthAurora />
      <div className="a2hs-blur" aria-hidden="true" />

      <div className="phone-shell auth-shell a2hs-shell relative z-[1] flex h-full min-h-0 flex-col overflow-hidden text-white">
        <motion.header
          className="a2hs-header flex shrink-0 items-center justify-between gap-3 px-5 pt-5 pb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <AppBrand tone="white" size="sm" />
          <button
            type="button"
            onClick={handleSkip}
            className="a2hs-chip rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white/90"
          >
            {t("a2hs.skip")}
          </button>
        </motion.header>

        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-5">
          <motion.div
            className="a2hs-hero shrink-0 overflow-hidden rounded-[1.75rem] px-2 pt-1 pb-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease }}
          >
            <AddToHomeIllustration />
          </motion.div>

          <motion.section
            className="relative z-10 shrink-0 px-1 pt-3 text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <span className="a2hs-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6c344]">
              <span className="size-1.5 rounded-full bg-[#f6c344]" aria-hidden="true" />
              {t("a2hs.eyebrow")}
            </span>
            <h1 className="mt-2.5 text-[1.5rem] font-extrabold leading-tight tracking-tight drop-shadow-sm">
              {t("a2hs.title", { name: brandName })}
            </h1>
            <p className="mx-auto mt-2 max-w-[310px] text-[12.5px] leading-6 text-white/80">
              {t("a2hs.subtitle")}
            </p>
          </motion.section>

          <motion.div
            className="a2hs-panel relative z-10 mt-4 mb-3 flex-1 rounded-[1.75rem] p-3.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease }}
          >
            <p className="mb-3 rounded-xl bg-white/10 px-3 py-2 text-center text-[11px] leading-5 text-white/78 ring-1 ring-white/12">
              {t("a2hs.safariOnly")}
            </p>

            <div
              className="mb-3 flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              {steps.map((_, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 rounded-full bg-white/30"
                  animate={{
                    width: activeStep === i ? 22 : 8,
                    backgroundColor:
                      activeStep === i
                        ? "rgba(246,195,68,1)"
                        : "rgba(255,255,255,0.28)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              ))}
            </div>

            <ol className="relative space-y-2.5">
              <span
                className="pointer-events-none absolute start-[1.55rem] top-5 bottom-5 w-px bg-gradient-to-b from-white/35 via-white/15 to-transparent"
                aria-hidden="true"
              />
              {steps.map((step, index) => {
                const Icon = step.icon;
                const active = activeStep === index;
                return (
                  <motion.li
                    key={step.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveStep(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveStep(index);
                    }}
                    className={`relative flex cursor-pointer gap-3 rounded-2xl p-3 transition ${
                      active
                        ? "a2hs-step-active ring-1 ring-white/28"
                        : "bg-white/6 ring-1 ring-white/10"
                    }`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: active ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.4, delay: 0.22 + index * 0.08, ease }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`relative z-[1] inline-flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                        active
                          ? "bg-white text-cs-blue shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                          : "bg-white/14 text-white"
                      }`}
                    >
                      <Icon className="size-5" />
                      <span
                        className={`absolute -start-1 -top-1 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                          active
                            ? "bg-[#f6c344] text-[#1a2a55]"
                            : "bg-white/25 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1 text-start">
                      <p className="text-[13px] font-bold leading-5">{step.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-white/78">
                        {step.text}
                      </p>
                      {active ? (
                        <motion.p
                          className="mt-1.5 inline-flex max-w-full items-start gap-1 rounded-lg bg-[#f6c344]/18 px-2 py-1 text-[10.5px] font-semibold leading-4 text-[#ffe9a8]"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {step.tip}
                        </motion.p>
                      ) : null}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        </div>

        <motion.div
          className="a2hs-footer relative z-10 shrink-0 space-y-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
        >
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-5 text-base font-bold text-cs-blue shadow-[0_14px_36px_rgba(0,0,0,0.22)] transition hover:bg-white/95 active:scale-[0.99]"
          >
            {t("a2hs.done")}
          </button>
          <p className="text-center text-[11px] leading-5 text-white/70">
            {t("a2hs.footerHint")}{" "}
            <Link
              href="/login"
              onClick={() => dismissAddToHome()}
              className="font-bold text-white underline-offset-4 hover:underline"
            >
              {t("a2hs.openWeb")}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
