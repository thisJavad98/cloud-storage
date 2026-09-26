"use client";

import Link from "next/link";
import { motion } from "motion/react";
import AppBrand from "../components/AppBrand";
import { IntroIllustration } from "../components/IntroIllustration";
import PlansBanner from "../components/PlansBanner";
import { IconArrow, IconFolder, IconUpload } from "../components/Icons";
import { useI18n } from "../lib/i18n/I18nProvider";

const ease = [0.22, 1, 0.36, 1];

function ShieldIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3.5 5.5 6v5.2c0 4.2 2.8 7.9 6.5 9.3 3.7-1.4 6.5-5.1 6.5-9.3V6L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.2 11.4 13.6 14.4 10.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IntroPage() {
  const { t, brandName } = useI18n();

  const features = [
    {
      icon: IconUpload,
      title: t("landing.featureUpload"),
      text: t("landing.featureUploadDesc"),
    },
    {
      icon: IconFolder,
      title: t("landing.featureFolders"),
      text: t("landing.featureFoldersDesc"),
    },
    {
      icon: ShieldIcon,
      title: t("landing.featureSecure"),
      text: t("landing.featureSecureDesc"),
    },
  ];

  return (
    <main className="auth-screen hex-pattern">
      <div className="phone-shell flex h-full min-h-0 flex-col overflow-hidden px-6 pb-5 pt-6 text-white">
        <motion.header
          className="flex shrink-0 items-center justify-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <AppBrand tone="white" size="lg" />
        </motion.header>

        <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
          <IntroIllustration />
        </div>

        <motion.section
          className="relative z-10 shrink-0 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease }}
        >
          <h1 className="text-[1.65rem] font-extrabold leading-tight tracking-tight">
            {t("landing.welcome", { name: brandName })}
          </h1>
          <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-6 text-white/80">
            {t("landing.description")}
          </p>

          <ul className="mt-3.5 grid grid-cols-3 gap-2">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  className="rounded-2xl bg-white/10 px-2 py-2.5 ring-1 ring-white/15 backdrop-blur-[2px]"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28 + index * 0.08, ease }}
                  whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.16)" }}
                >
                  <span className="mx-auto mb-1.5 inline-flex size-7 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Icon className="size-3.5" />
                  </span>
                  <p className="text-[11px] font-bold leading-5">{item.title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-white/65">
                    {item.text}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </motion.section>

        <motion.div
          className="relative z-10 mt-4 shrink-0 space-y-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
        >
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-white px-5 text-cs-blue shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:bg-white/95 active:scale-[0.99]"
          >
            <span className="text-base font-bold leading-none">{t("landing.start")}</span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-cs-blue/10 text-cs-blue">
              <IconArrow className="size-4" />
            </span>
          </Link>
          <p className="text-center text-xs leading-5 text-white/70">
            {t("landing.noAccount")}{" "}
            <Link href="/signup" className="relative z-10 font-bold text-white underline-offset-4 hover:underline">
              {t("landing.freeSignup")}
            </Link>
          </p>
        </motion.div>

        <motion.div
          className="relative z-10 mt-3 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <PlansBanner variant="landing" compact />
        </motion.div>
      </div>
    </main>
  );
}
