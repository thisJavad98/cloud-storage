"use client";

import { CheckCircle, FolderSimple } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { EASE, Float3D, Tilt3D, reveal, springSoft } from "./motion";

export default function LandingHighlight() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const points = [
    t("landing.highlightPoint1"),
    t("landing.highlightPoint2"),
    t("landing.highlightPoint3"),
  ];

  return (
    <section id="plans" className="scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 [perspective:1100px]">
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, x: -28, rotateY: 12 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Float3D className="landing-blob -start-8 top-0 size-40 bg-[var(--landing-lilac)] opacity-80" amplitude={12} duration={6} />
          <Tilt3D max={9} scale={1.02}>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#5b7cff] to-[#1e55d6] p-7 text-white shadow-[var(--landing-shadow)] md:p-9">
              <p className="text-sm font-semibold text-white/80">{t("landing.highlightCardEyebrow")}</p>
              <h3 className="landing-display mt-2 text-3xl" style={{ transform: "translateZ(24px)" }}>
                {t("landing.highlightCardTitle")}
              </h3>
              <p className="mt-2 text-sm text-white/80">{t("landing.highlightCardMeta")}</p>

              <div className="mt-8" style={{ transform: "translateZ(18px)" }}>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                  <span>{t("landing.highlightUsed")}</span>
                  <span>{t("landing.highlightQuota")}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-[#ffd166]"
                    initial={reduce ? false : { width: "18%" }}
                    whileInView={{ width: "62%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.25, ease: EASE }}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3" style={{ transform: "translateZ(32px)" }}>
                <motion.span
                  className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#ffd166] text-[#8a5a00]"
                  whileHover={reduce ? undefined : { y: -6, rotate: -8 }}
                  transition={springSoft}
                >
                  <FolderSimple size={22} weight="fill" aria-hidden />
                </motion.span>
                <motion.span
                  className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/20 text-white"
                  whileHover={reduce ? undefined : { y: -6, rotate: 8 }}
                  transition={springSoft}
                >
                  <FolderSimple size={22} weight="fill" aria-hidden />
                </motion.span>
              </div>
            </div>
          </Tilt3D>
        </motion.div>

        <motion.div {...reveal(reduce, 0.08, 24)}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--landing-accent)]">
            {t("landing.highlightEyebrow")}
          </p>
          <h2 className="landing-display mt-3 max-w-[16ch] text-3xl text-[var(--landing-ink)] md:text-5xl">
            {t("landing.highlightTitle")}
          </h2>
          <p className="landing-body mt-4 max-w-[42ch] text-base md:text-lg">
            {t("landing.highlightBody")}
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((point, index) => (
              <motion.li
                key={point}
                className="flex items-start gap-3"
                initial={reduce ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.08, ease: EASE }}
              >
                <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-[var(--landing-accent)]" aria-hidden />
                <span className="landing-ui text-[var(--landing-ink)]">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
