"use client";

import Link from "next/link";
import AppBrand from "../components/AppBrand";
import { IntroIllustration } from "../components/IntroIllustration";
import { IconArrow, IconFolder, IconUpload } from "../components/Icons";
import { useI18n } from "../lib/i18n/I18nProvider";

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
      <div className="phone-shell flex h-full min-h-0 flex-col overflow-hidden px-6 pb-7 pt-8 text-white">
        <header className="animate-fade-in flex items-center justify-center">
          <AppBrand tone="white" size="lg" />
        </header>

        <div className="animate-fade-in-delay flex min-h-0 flex-1 items-center justify-center overflow-hidden py-3">
          <IntroIllustration />
        </div>

        <section className="animate-fade-in-delay shrink-0 text-center">
          <h1 className="text-[1.85rem] font-extrabold leading-tight tracking-tight">
            {t("landing.welcome", { name: brandName })}
          </h1>
          <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-7 text-white/80">
            {t("landing.description")}
          </p>

          <ul className="mt-5 grid grid-cols-3 gap-2">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/15 backdrop-blur-[2px]"
                >
                  <span className="mx-auto mb-2 inline-flex size-8 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Icon className="size-4" />
                  </span>
                  <p className="text-[11px] font-bold leading-5">{item.title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-white/65">
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-6 shrink-0 space-y-3 animate-fade-in-delay">
          <Link
            href="/login"
            className="inline-flex h-14 w-full items-center justify-between gap-3 rounded-2xl bg-white px-5 text-cs-blue shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:bg-white/95 active:scale-[0.99]"
          >
            <span className="text-base font-bold leading-none">{t("landing.start")}</span>
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-cs-blue/10 text-cs-blue">
              <IconArrow className="size-5" />
            </span>
          </Link>
          <p className="text-center text-xs leading-6 text-white/70">
            {t("landing.noAccount")}{" "}
            <Link href="/signup" className="font-bold text-white underline-offset-4 hover:underline">
              {t("landing.freeSignup")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
