"use client";

import { CloudArrowUp, FolderSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { EASE, Tilt3D, reveal, springSoft } from "./motion";

const ICONS = [CloudArrowUp, FolderSimple, MagnifyingGlass];
const TINTS = [
  "bg-[var(--landing-sky)] text-[var(--landing-accent)]",
  "bg-[var(--landing-peach)] text-[#d97706]",
  "bg-[var(--landing-lilac)] text-[#6b5cff]",
];

export default function LandingSteps() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const items = [
    { title: t("landing.step1Title"), body: t("landing.step1Body") },
    { title: t("landing.step2Title"), body: t("landing.step2Body") },
    { title: t("landing.step3Title"), body: t("landing.step3Body") },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.h2
          className="landing-display max-w-[16ch] text-3xl text-[var(--landing-ink)] sm:text-4xl lg:text-5xl"
          {...reveal(reduce)}
        >
          {t("landing.stepsTitle")}
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-3 md:gap-5 lg:mt-12 [perspective:1000px]">
          {items.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 32, rotateX: 14 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
              >
                <Tilt3D max={11} scale={1.03}>
                  <article className="rounded-[1.75rem] border border-[var(--landing-line)] bg-white p-7 shadow-[0_18px_40px_-30px_rgba(20,24,36,0.35)]">
                    <motion.span
                      className={`inline-flex size-12 items-center justify-center rounded-2xl ${TINTS[index]}`}
                      style={{ transform: "translateZ(26px)" }}
                      whileHover={reduce ? undefined : { scale: 1.1, rotate: -8 }}
                      transition={springSoft}
                    >
                      <Icon size={24} weight="duotone" aria-hidden />
                    </motion.span>
                    <h3
                      className="landing-display mt-6 text-2xl text-[var(--landing-ink)]"
                      style={{ transform: "translateZ(16px)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="landing-body mt-3 text-sm md:text-base">{item.body}</p>
                  </article>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
