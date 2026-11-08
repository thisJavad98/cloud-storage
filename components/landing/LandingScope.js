"use client";

import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import {
  DashboardPreview,
  FoldersPreview,
  IslandPreview,
} from "./AppPreviews";
import PhoneFrame from "./PhoneFrame";
import { EASE, Float3D, Tilt3D, reveal } from "./motion";

export default function LandingScope() {
  const { t, brandName, locale } = useI18n();
  const reduce = useReducedMotion();

  const labels = {
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

  const shots = [
    {
      title: t("landing.scopeShotHome"),
      body: t("landing.scopeShotHomeBody"),
      node: <DashboardPreview locale={locale} labels={labels} />,
      tint: "bg-[var(--landing-sky)]",
      rotate: -6,
    },
    {
      title: t("landing.scopeShotFolders"),
      body: t("landing.scopeShotFoldersBody"),
      node: <FoldersPreview locale={locale} labels={labels} />,
      tint: "bg-[var(--landing-peach)]",
      rotate: 5,
    },
    {
      title: t("landing.scopeShotIsland"),
      body: t("landing.scopeShotIslandBody"),
      node: <IslandPreview labels={labels} />,
      tint: "bg-[var(--landing-lilac)]",
      rotate: -4,
    },
  ];

  return (
    <section id="scope" className="scroll-mt-24 bg-[#f7f9fd] px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div {...reveal(reduce)}>
          <h2 className="landing-display max-w-[18ch] text-3xl text-[var(--landing-ink)] sm:text-4xl lg:text-5xl">
            {t("landing.scopeTitle")}
          </h2>
          <p className="landing-body mt-3 max-w-[50ch] text-sm sm:mt-4 sm:text-base lg:text-lg">
            {t("landing.scopeBody")}
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-2 md:gap-5 lg:mt-12 lg:grid-cols-3">
          {shots.map((shot, index) => (
            <motion.article
              key={shot.title}
              className={`overflow-hidden rounded-[1.5rem] shadow-[var(--landing-shadow-soft)] ${shot.tint} p-4 sm:rounded-[1.75rem] sm:p-5 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              initial={reduce ? false : { opacity: 0, y: 40, rotateY: shot.rotate }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: index * 0.1, ease: EASE }}
              whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
              whileTap={reduce ? undefined : { scale: 0.99 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <h3 className="landing-display text-lg text-[var(--landing-ink)] sm:text-xl">{shot.title}</h3>
              <p className="landing-body mt-2 text-sm">{shot.body}</p>
              <Float3D
                className="mx-auto mt-5 w-[68%] max-w-[220px] sm:mt-6 sm:w-[72%] sm:max-w-[240px]"
                amplitude={8 + index * 2}
                duration={4.8 + index * 0.4}
                delay={index * 0.2}
                rotate={index % 2 === 0 ? 2 : -2}
              >
                <Tilt3D max={10} scale={1.02} glare={false}>
                  <motion.div
                    whileHover={reduce ? undefined : { z: 40 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <PhoneFrame>{shot.node}</PhoneFrame>
                  </motion.div>
                </Tilt3D>
              </Float3D>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
