"use client";

import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import {
  DashboardPreview,
  FoldersPreview,
  IslandPreview,
} from "./AppPreviews";
import PhoneFrame from "./PhoneFrame";

const EASE = [0.16, 1, 0.3, 1];

function reveal(reduce, delay = 0) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.75, delay, ease: EASE },
  };
}

export default function LandingBento() {
  const { t, brandName, locale } = useI18n();
  const reduce = useReducedMotion();

  const previewLabels = {
    greeting: t("landing.previewGreeting"),
    brand: brandName,
    used: t("landing.previewUsed"),
    search: t("landing.previewSearch"),
    folders: t("landing.previewFolders"),
    more: t("landing.previewMore"),
    items: t("common.items"),
    recent: t("landing.previewRecent"),
    foldersTitle: t("landing.previewFoldersTitle"),
    foldersBody: t("landing.previewFoldersBody"),
    islandTitle: t("landing.previewIslandTitle"),
    islandBody: t("landing.previewIslandBody"),
    islandHint: t("landing.previewIslandHint"),
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <motion.h2
        {...reveal(reduce)}
        className="landing-display max-w-[20ch] text-3xl text-cs-ink md:text-5xl"
      >
        {t("landing.bentoTitle")}
      </motion.h2>

      <div className="mt-12 grid grid-cols-1 gap-4 md:auto-rows-[15rem] md:grid-cols-6">
        <motion.article
          {...reveal(reduce)}
          className="group relative flex min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] bg-[#e8eefc] md:col-span-4 md:row-span-2 md:min-h-0"
        >
          <div className="relative z-10 flex flex-col gap-2 p-7 md:max-w-[52%]">
            <h3 className="landing-display text-2xl text-cs-ink">
              {t("landing.bentoHomeTitle")}
            </h3>
            <p className="landing-body text-cs-muted">{t("landing.bentoHomeBody")}</p>
          </div>
          <motion.div
            className="mx-auto mt-auto w-[58%] translate-y-8 md:absolute md:end-8 md:top-8 md:mt-0 md:w-[36%] md:translate-y-0"
            initial={reduce ? false : { y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          >
            <PhoneFrame className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
              <DashboardPreview locale={locale} labels={previewLabels} />
            </PhoneFrame>
          </motion.div>
        </motion.article>

        <motion.article
          {...reveal(reduce, 0.08)}
          className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] bg-cs-blue text-white md:col-span-2 md:row-span-2 md:min-h-0"
        >
          <div className="flex flex-col gap-2 p-7">
            <h3 className="landing-display text-2xl">
              {t("landing.bentoIslandTitle")}
            </h3>
            <p className="landing-body text-white/85">
              {t("landing.bentoIslandBody")}
            </p>
          </div>
          <motion.div
            className="absolute inset-x-7 -bottom-20"
            initial={reduce ? false : { rotate: locale === "fa" ? -10 : 10, y: 70 }}
            whileInView={{ rotate: locale === "fa" ? -5 : 5, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.12 }}
          >
            <PhoneFrame>
              <IslandPreview labels={previewLabels} />
            </PhoneFrame>
          </motion.div>
        </motion.article>

        <motion.article
          {...reveal(reduce, 0.05)}
          className="flex flex-col justify-between gap-5 rounded-[1.75rem] border border-cs-line bg-white p-7 md:col-span-2"
        >
          <p className="landing-display-lg text-5xl text-cs-blue tabular-nums md:text-6xl">
            {t("landing.bentoPrivacyValue")}
          </p>
          <div>
            <h3 className="landing-display text-lg text-cs-ink">{t("landing.bentoPrivacyTitle")}</h3>
            <p className="landing-body mt-1 text-sm text-cs-muted">
              {t("landing.bentoPrivacyBody")}
            </p>
          </div>
        </motion.article>

        <motion.article
          {...reveal(reduce, 0.1)}
          className="relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-cs-line bg-white md:col-span-2 md:min-h-0"
        >
          <div className="p-6 pb-3">
            <h3 className="landing-display text-lg text-cs-ink">{t("landing.bentoFoldersTitle")}</h3>
            <p className="landing-body mt-1 text-sm text-cs-muted">{t("landing.bentoFoldersBody")}</p>
          </div>
          <div className="mx-auto w-[70%] translate-y-4 md:w-[78%]">
            <PhoneFrame>
              <FoldersPreview locale={locale} labels={previewLabels} />
            </PhoneFrame>
          </div>
        </motion.article>

        <motion.article
          {...reveal(reduce, 0.14)}
          className="flex flex-col justify-between gap-5 overflow-hidden rounded-[1.75rem] bg-[repeating-linear-gradient(135deg,#eef2fb_0_12px,#f7f9fd_12px_24px)] p-7 md:col-span-2"
        >
          <p className="landing-display-lg text-4xl text-cs-ink md:text-5xl">
            {t("landing.bentoPlansValue")}{" "}
            <span className="text-cs-blue">{t("landing.bentoPlansAccent")}</span>
          </p>
          <div>
            <h3 className="landing-display text-lg text-cs-ink">{t("landing.bentoPlansTitle")}</h3>
            <p className="landing-body mt-1 text-sm text-cs-muted">
              {t("landing.bentoPlansBody")}
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
