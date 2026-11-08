"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import AppBrand from "../AppBrand";
import { useI18n } from "../../lib/i18n/I18nProvider";
import MagneticLink from "./MagneticLink";
import { EASE } from "./motion";

export default function LandingFinalCta() {
  const { t, toggleLocale, locale } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);

  return (
    <section ref={ref} className="px-4 pb-8 sm:px-6 md:px-8 md:pb-10">
      <motion.div
        className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[1.5rem] bg-[var(--landing-accent)] px-5 py-12 text-white sm:rounded-[2rem] sm:px-8 sm:py-14 md:px-14 md:py-20"
        style={reduce ? undefined : { scale, rotateX, transformPerspective: 1200 }}
        initial={reduce ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          animate={
            reduce
              ? undefined
              : {
                  background: [
                    "radial-gradient(circle at 12% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,209,102,0.28), transparent 42%)",
                    "radial-gradient(circle at 28% 30%, rgba(255,255,255,0.4), transparent 42%), radial-gradient(circle at 78% 70%, rgba(255,209,102,0.34), transparent 46%)",
                    "radial-gradient(circle at 12% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,209,102,0.28), transparent 42%)",
                  ],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="landing-display-lg max-w-[14ch] text-4xl md:text-6xl">
              {t("landing.finalTitle")}
            </h2>
            <p className="mt-4 max-w-[36ch] text-base text-white/85 md:text-lg">
              {t("landing.finalBody")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticLink
              href="/signup"
              className="landing-cta inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-white px-7 text-base text-[var(--landing-accent)] md:h-14"
            >
              {t("landing.getStarted")}
              <ArrowUpRight size={18} weight="bold" className="rtl:-scale-x-100" aria-hidden />
            </MagneticLink>
            <Link
              href="/login"
              className="landing-ui inline-flex h-12 items-center rounded-full px-5 text-base text-white/90 transition hover:bg-white/10 md:h-14"
            >
              {t("landing.login")}
            </Link>
          </div>
        </div>
      </motion.div>

      <footer className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-1 pt-8 pb-16 text-sm text-[var(--landing-muted)] md:flex-row md:items-center">
        <AppBrand tone="ink" size="sm" animated={false} />
        <span>{t("landing.footerNote")}</span>
        <button
          type="button"
          onClick={toggleLocale}
          lang={locale === "fa" ? "en" : "fa"}
          className="font-semibold text-[var(--landing-ink)] underline-offset-4 hover:underline"
        >
          {t("landing.switchTo")}
        </button>
      </footer>
    </section>
  );
}
