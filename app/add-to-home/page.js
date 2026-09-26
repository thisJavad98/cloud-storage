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
  shouldPromptAddToHome,
} from "../../lib/ios";

const ease = [0.22, 1, 0.36, 1];

function StepIconShare({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="7" y="10" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
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
    <main className="auth-screen hex-pattern auth-stage">
      <AuthAurora />
      <div className="phone-shell auth-shell relative z-[1] flex h-full min-h-0 flex-col overflow-hidden px-5 pb-5 pt-5 text-white">
        <motion.header
          className="flex shrink-0 items-center justify-between gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <AppBrand tone="white" size="sm" />
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/20 backdrop-blur-sm"
          >
            {t("a2hs.skip")}
          </button>
        </motion.header>

        <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div className="flex shrink-0 items-center justify-center py-2">
            <AddToHomeIllustration />
          </div>

          <motion.section
            className="relative z-10 shrink-0 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f6c344]">
              {t("a2hs.eyebrow")}
            </p>
            <h1 className="mt-1.5 text-[1.55rem] font-extrabold leading-tight tracking-tight">
              {t("a2hs.title", { name: brandName })}
            </h1>
            <p className="mx-auto mt-2 max-w-[320px] text-[12.5px] leading-6 text-white/82">
              {t("a2hs.subtitle")}
            </p>
            {!shouldPromptAddToHome() ? null : (
              <p className="mx-auto mt-2 max-w-[300px] rounded-xl bg-white/10 px-3 py-2 text-[11px] leading-5 text-white/75 ring-1 ring-white/15">
                {t("a2hs.safariOnly")}
              </p>
            )}
          </motion.section>

          <ol className="relative z-10 mt-4 space-y-2.5 pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  className="flex gap-3 rounded-2xl bg-white/12 p-3 ring-1 ring-white/18 shadow-[0_8px_24px_rgba(8,30,90,0.16)] backdrop-blur-[6px]"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.22 + index * 0.1, ease }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                >
                  <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/18 text-white">
                    <Icon className="size-5" />
                    <span className="absolute -start-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full bg-[#f6c344] text-[10px] font-extrabold text-[#1a2a55]">
                      {index + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1 text-start">
                    <p className="text-[13px] font-bold leading-5">{step.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-white/78">{step.text}</p>
                    <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#f6c344]/95">
                      {step.tip}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.div
          className="relative z-10 mt-3 shrink-0 space-y-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
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
            <Link href="/login" className="font-bold text-white underline-offset-4 hover:underline">
              {t("a2hs.openWeb")}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
