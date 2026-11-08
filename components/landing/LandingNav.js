"use client";

import { Translate } from "@phosphor-icons/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import AppBrand from "../AppBrand";
import { useI18n } from "../../lib/i18n/I18nProvider";
import MagneticLink from "./MagneticLink";

export default function LandingNav() {
  const { t, toggleLocale, locale } = useI18n();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 18;
    if (next !== solid) setSolid(next);
  });

  return (
    <motion.header
      className={`landing-nav fixed inset-x-0 top-0 z-30 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
        solid
          ? "border-b border-[var(--landing-line)] bg-white/85 shadow-[0_10px_30px_-24px_rgba(20,24,36,0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 md:h-[4.25rem] md:px-8">
        <AppBrand tone="ink" size="sm" animated={false} />

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {[
            { href: "#features", label: t("landing.navFeatures") },
            { href: "#scope", label: t("landing.navScope") },
            { href: "#plans", label: t("landing.navPlans") },
          ].map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="landing-ui whitespace-nowrap text-sm text-[var(--landing-muted)] transition hover:text-[var(--landing-ink)]"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            lang={locale === "fa" ? "en" : "fa"}
            className="landing-ui inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm text-[var(--landing-muted)] transition hover:bg-[var(--landing-sky)] hover:text-[var(--landing-ink)] sm:h-10 sm:px-3"
          >
            <Translate size={18} aria-hidden />
            <span className="hidden sm:inline">{t("landing.switchTo")}</span>
          </button>
          <Link
            href="/login"
            className="landing-ui hidden h-10 items-center rounded-full px-4 text-sm text-[var(--landing-ink)] transition hover:bg-[var(--landing-sky)] md:inline-flex"
          >
            {t("landing.login")}
          </Link>
          <MagneticLink
            href="/signup"
            strength={0.18}
            className="landing-cta inline-flex h-9 items-center whitespace-nowrap rounded-full bg-[var(--landing-ink)] px-3 text-sm text-white sm:h-10 sm:px-4"
          >
            {t("landing.getStarted")}
          </MagneticLink>
        </div>
      </nav>
    </motion.header>
  );
}
