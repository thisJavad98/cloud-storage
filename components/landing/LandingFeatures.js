"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { Float3D, HoverLift, reveal, springSnappy } from "./motion";

const FEATURES = [
  {
    key: "secure",
    titleKey: "landing.featureCard1Title",
    bodyKey: "landing.featureCard1Body",
    image: "/landing/feature-secure.jpg",
    svg: "/landing/deco-shield.svg",
    surface: "bg-[var(--landing-sky)]",
  },
  {
    key: "upload",
    titleKey: "landing.featureCard2Title",
    bodyKey: "landing.featureCard2Body",
    image: "/landing/feature-upload.jpg",
    svg: "/landing/deco-upload.svg",
    surface: "bg-[var(--landing-peach)]",
  },
  {
    key: "devices",
    titleKey: "landing.featureCard3Title",
    bodyKey: "landing.featureCard3Body",
    image: "/landing/feature-devices.jpg",
    svg: "/landing/deco-devices.svg",
    surface: "bg-[var(--landing-lilac)]",
  },
];

function FeatureMedia({
  image,
  svg,
  priority = false,
  className = "",
  badge = true,
  sizes = "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw",
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={image}
        alt=""
        fill
        sizes={sizes}
        className="landing-media-zoom object-cover object-center"
        priority={priority}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-transparent" />
      {badge ? (
        <Float3D
          className="absolute end-3 top-3 z-[1] sm:end-4 sm:top-4"
          amplitude={reduce ? 0 : 5}
          duration={4.6}
          rotate={2}
        >
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.08, rotate: -4 }}
            transition={springSnappy}
          >
            <Image
              src={svg}
              alt=""
              width={88}
              height={88}
              className="size-12 drop-shadow-md sm:size-14 lg:size-[4.25rem]"
            />
          </motion.div>
        </Float3D>
      ) : null}
    </div>
  );
}

export default function LandingFeatures() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [featured, upload, devices] = FEATURES;

  return (
    <section id="features" className="scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          {...reveal(reduce)}
        >
          <div className="min-w-0 max-w-3xl">
            <h2 className="landing-display text-3xl text-[var(--landing-ink)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] xl:text-5xl">
              {t("landing.featuresTitle")}
            </h2>
            <p className="landing-body mt-3 max-w-[52ch] text-sm sm:mt-4 sm:text-base lg:text-lg">
              {t("landing.featuresBody")}
            </p>
          </div>
          <motion.a
            href="#scope"
            className="landing-ui shrink-0 self-start text-sm font-bold text-[var(--landing-accent)] underline-offset-4 hover:underline lg:self-auto lg:pb-1"
            whileHover={reduce ? undefined : { x: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            {t("landing.featuresMore")}
          </motion.a>
        </motion.div>

        {/* Mobile / tablet stack */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-5 lg:hidden">
          {[featured, upload, devices].map((feature, index) => (
            <HoverLift
              key={feature.key}
              delay={index * 0.06}
              y={-5}
              className={`overflow-hidden rounded-[1.5rem] shadow-[var(--landing-shadow-soft)] ${feature.surface} sm:rounded-[1.75rem]`}
            >
              <FeatureMedia
                image={feature.image}
                svg={feature.svg}
                priority={index === 0}
                className={index === 0 ? "aspect-[16/11]" : "aspect-[16/10]"}
              />
              <div className="flex flex-col gap-2 p-5 sm:gap-3 sm:p-6">
                <h3 className="landing-display text-xl text-[var(--landing-ink)] sm:text-2xl">
                  {t(feature.titleKey)}
                </h3>
                <p className="landing-body max-w-[36ch] text-sm sm:text-base">
                  {t(feature.bodyKey)}
                </p>
              </div>
            </HoverLift>
          ))}
        </div>

        {/* Desktop bento */}
        <div className="mt-12 hidden grid-cols-12 gap-6 lg:grid lg:min-h-[36rem] xl:min-h-[40rem]">
          <HoverLift
            delay={0}
            y={-8}
            scale={1.008}
            className={`col-span-7 flex h-full flex-col overflow-hidden rounded-[2rem] shadow-[var(--landing-shadow-soft)] ${featured.surface}`}
          >
            <FeatureMedia
              image={featured.image}
              svg={featured.svg}
              priority
              badge={false}
              sizes="(min-width: 1280px) 640px, 55vw"
              className="min-h-0 flex-[1.2]"
            />
            <div className="flex shrink-0 flex-col gap-3 p-8 xl:gap-4 xl:p-10">
              <Float3D amplitude={reduce ? 0 : 4} duration={5} rotate={1.5}>
                <Image
                  src={featured.svg}
                  alt=""
                  width={80}
                  height={80}
                  className="size-16 xl:size-[4.5rem]"
                />
              </Float3D>
              <h3 className="landing-display max-w-[12ch] text-[2.15rem] leading-tight text-[var(--landing-ink)] xl:text-4xl">
                {t(featured.titleKey)}
              </h3>
              <p className="landing-body max-w-[38ch] text-base xl:text-lg">
                {t(featured.bodyKey)}
              </p>
            </div>
          </HoverLift>

          <div className="col-span-5 flex h-full flex-col gap-6">
            {[upload, devices].map((feature, index) => (
              <HoverLift
                key={feature.key}
                delay={0.08 + index * 0.08}
                y={-6}
                className={`flex min-h-0 flex-1 overflow-hidden rounded-[1.75rem] shadow-[var(--landing-shadow-soft)] ${feature.surface}`}
              >
                <div className="grid h-full w-full grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <FeatureMedia
                    image={feature.image}
                    svg={feature.svg}
                    sizes="(min-width: 1280px) 240px, 22vw"
                    className="h-full min-h-[11rem]"
                  />
                  <div className="flex flex-col justify-center gap-2 p-5 xl:gap-2.5 xl:p-6">
                    <h3 className="landing-display text-xl leading-snug text-[var(--landing-ink)] xl:text-2xl">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="landing-body text-sm xl:text-[0.95rem] xl:leading-relaxed">
                      {t(feature.bodyKey)}
                    </p>
                  </div>
                </div>
              </HoverLift>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
