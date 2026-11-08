"use client";

import { FileText, FolderSimple, Image as ImageIcon, LinkSimple, UploadSimple } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { EASE, Float3D, Tilt3D, springSoft } from "./motion";

export default function HeroShowcase() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [8, -4]);

  return (
    <div
      ref={ref}
      className="relative z-[1] isolate mx-auto w-full max-w-[420px] overflow-visible pt-4 pb-6 sm:max-w-[480px] sm:pt-6 sm:pb-8 lg:max-w-[520px] [perspective:1200px]"
    >
      {/* Background depth only */}
      <Float3D
        className="landing-blob pointer-events-none absolute -end-6 -top-8 z-0 size-40 bg-[var(--landing-sky)] opacity-90 md:size-56"
        amplitude={14}
        duration={6}
      />
      <Float3D
        className="landing-blob pointer-events-none absolute -start-10 bottom-8 z-0 size-32 bg-[var(--landing-lilac)] opacity-80 md:size-44"
        amplitude={10}
        duration={5.2}
        delay={0.4}
        rotate={-2}
      />
      <Float3D
        className="landing-blob pointer-events-none absolute end-10 top-24 z-0 size-24 bg-[var(--landing-peach)] opacity-70"
        amplitude={8}
        duration={4.6}
        delay={0.8}
      />

      {/* Main card stage */}
      <motion.div
        style={reduce ? undefined : { y: stageY, rotateX: stageRotate }}
        className="relative z-[1] [transform-style:preserve-3d]"
      >
        <Tilt3D className="group relative z-[1]" max={12} perspective={1100} scale={1.015}>
          <motion.div
            className="landing-dot-grid relative z-[1] overflow-hidden rounded-[1.75rem] border border-[var(--landing-line)] bg-white/85 p-4 shadow-[var(--landing-shadow)] backdrop-blur-sm md:p-5"
            initial={reduce ? false : { opacity: 0, y: 48, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ ...springSoft, delay: 0.12 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
              <span className="size-2.5 rounded-full bg-[#ffd166]" />
              <span className="size-2.5 rounded-full bg-[#6bcB77]" />
            </div>

            <div className="grid grid-cols-3 gap-3" style={{ transform: "translateZ(28px)" }}>
              {[
                {
                  bg: "bg-[var(--landing-sky)]",
                  icon: FolderSimple,
                  color: "text-[var(--landing-accent)]",
                  title: t("landing.heroCardDirectory"),
                  meta: t("landing.heroCardDirectoryMeta"),
                  delay: 0.25,
                },
                {
                  bg: "bg-[var(--landing-lilac)]",
                  icon: ImageIcon,
                  color: "text-[#7b61ff]",
                  title: t("landing.heroCardPhotos"),
                  meta: t("landing.heroCardPhotosMeta"),
                  delay: 0.33,
                },
                {
                  bg: "bg-[var(--landing-peach)]",
                  icon: FileText,
                  color: "text-[#f08a3a]",
                  title: t("landing.heroCardNew"),
                  meta: t("landing.heroCardNewMeta"),
                  delay: 0.41,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className={`relative z-[2] rounded-2xl ${item.bg} p-3 shadow-[0_10px_24px_-16px_rgba(20,24,36,0.45)]`}
                    initial={reduce ? false : { opacity: 0, y: 24, rotateY: -12 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 0.65, delay: item.delay, ease: EASE }}
                    whileHover={reduce ? undefined : { y: -6, rotateY: 6, scale: 1.03 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span className={`inline-flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ${item.color}`}>
                      <Icon size={18} weight="fill" aria-hidden />
                    </span>
                    <p className="mt-3 text-xs font-bold text-[var(--landing-ink)]">{item.title}</p>
                    <p className="mt-1 text-[10px] text-[var(--landing-muted)]">{item.meta}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="relative z-[2] mt-3 flex items-center gap-3 rounded-2xl border border-[var(--landing-line)] bg-white px-3 py-2.5"
              style={{ transform: "translateZ(40px)" }}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            >
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[var(--landing-sky)] text-[var(--landing-accent)]">
                <FileText size={16} weight="bold" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{t("landing.heroFileName")}</p>
                <p className="text-[10px] text-[var(--landing-muted)]">{t("landing.heroFileMeta")}</p>
              </div>
            </motion.div>

            <motion.div
              className="relative z-[2] mt-3 flex items-center gap-2"
              style={{ transform: "translateZ(48px)" }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62 }}
            >
              {[LinkSimple, FileText, UploadSimple].map((Icon, index) => (
                <motion.span
                  key={Icon.displayName || index}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--landing-line)] bg-white text-[var(--landing-accent)] shadow-sm"
                  whileHover={reduce ? undefined : { y: -4, scale: 1.08 }}
                  transition={springSoft}
                >
                  <Icon size={15} weight="bold" aria-hidden />
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </Tilt3D>
      </motion.div>

      {/* Floating chips above the 3D stage (own stacking context) */}
      <Float3D
        className="pointer-events-auto absolute start-0 top-12 z-20 sm:-start-2 sm:top-16 lg:-start-4"
        amplitude={9}
        duration={4.8}
        delay={0.2}
      >
        <motion.div
          className="relative z-20 rounded-2xl border border-[var(--landing-line)] bg-white px-3 py-2 shadow-[var(--landing-shadow-soft)]"
          initial={reduce ? false : { opacity: 0, y: 18, x: 12 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.75, delay: 0.45, ease: EASE }}
          whileHover={reduce ? undefined : { scale: 1.05 }}
        >
          <p className="text-xs font-bold text-[var(--landing-ink)]">{t("landing.heroFloatPhoto")}</p>
          <p className="text-[10px] text-[var(--landing-muted)]">{t("landing.heroFloatPhotoMeta")}</p>
        </motion.div>
      </Float3D>

      <Float3D
        className="pointer-events-auto absolute end-0 bottom-8 z-20 sm:-end-1 sm:bottom-10 lg:-end-4"
        amplitude={11}
        duration={5.1}
        delay={0.55}
        rotate={-2}
      >
        <motion.div
          className="relative z-20 rounded-2xl bg-[var(--landing-accent)] px-3 py-2 text-white shadow-[var(--landing-shadow-soft)]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.6, ease: EASE }}
          whileHover={reduce ? undefined : { scale: 1.05 }}
        >
          <p className="text-xs font-bold">{t("landing.heroFloatUpload")}</p>
          <p className="text-[10px] text-white/80">{t("landing.heroFloatUploadMeta")}</p>
        </motion.div>
      </Float3D>
    </div>
  );
}
