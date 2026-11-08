"use client";

import { ArrowDown, Play } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import HeroShowcase from "./HeroShowcase";
import MagneticLink from "./MagneticLink";
import { EASE } from "./motion";

export default function LandingHero() {
  const { t, brandName } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const title = t("landing.heroTitle", { name: brandName });
  const words = title.split(" ");

  return (
    <section ref={ref} className="relative z-0 overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <motion.div
          className="absolute -start-24 top-24 -z-10 size-56 rounded-full bg-[var(--landing-sky)] opacity-50 blur-3xl md:size-72"
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -end-16 top-40 -z-10 size-64 rounded-full bg-[var(--landing-lilac)] opacity-40 blur-3xl md:size-80"
          animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 28, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 pt-24 sm:px-6 sm:pt-28 md:gap-12 md:px-8 md:pb-16 lg:grid-cols-2 lg:gap-12 lg:pt-32 xl:gap-16">
        <motion.div
          className="relative z-20 flex min-w-0 flex-col items-start gap-5 sm:gap-6"
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <h1 className="landing-display-lg max-w-[15ch] text-[2.15rem] text-[var(--landing-ink)] sm:text-[2.5rem] md:text-5xl lg:text-[3.4rem] xl:text-[3.85rem]">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%", rotateX: 40 }}
                  animate={{ y: 0, rotateX: 0 }}
                  transition={{ duration: 0.85, delay: 0.06 + i * 0.05, ease: EASE }}
                  style={{ transformOrigin: "bottom" }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 ? "\u00a0" : null}
              </span>
            ))}
          </h1>

          <motion.p
            className="landing-body max-w-[42ch] text-sm sm:text-base md:text-lg"
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.4, ease: EASE }}
          >
            {t("landing.heroBody")}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-2.5 sm:gap-3"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
          >
            <MagneticLink
              href="/signup"
              className="landing-cta inline-flex h-11 items-center whitespace-nowrap rounded-full bg-[var(--landing-ink)] px-5 text-sm text-white sm:h-12 sm:px-6 md:h-14 md:px-7 md:text-base"
            >
              {t("landing.getStarted")}
            </MagneticLink>
            <motion.a
              href="#features"
              className="landing-ui inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm text-[var(--landing-ink)] transition hover:bg-[var(--landing-sky)] sm:h-12 sm:px-4 md:h-14 md:text-base"
              whileHover={reduce ? undefined : { x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--landing-sky)] text-[var(--landing-accent)]"
                animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Play size={14} weight="fill" aria-hidden />
              </motion.span>
              {t("landing.howItWorks")}
              <ArrowDown size={16} aria-hidden />
            </motion.a>
          </motion.div>
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-[460px] px-2 sm:px-4 lg:mx-0 lg:max-w-none lg:px-0">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
