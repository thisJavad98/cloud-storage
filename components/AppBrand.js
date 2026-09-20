"use client";

import { useI18n } from "../lib/i18n/I18nProvider";

export default function AppBrand({
  tone = "ink",
  size = "md",
  showLogo = true,
  stacked = false,
  className = "",
}) {
  const { brandName } = useI18n();

  const textClass =
    tone === "white"
      ? "text-white"
      : tone === "blue"
        ? "text-cs-blue"
        : "text-cs-ink";

  const logoClass =
    size === "lg" ? "size-11" : size === "sm" ? "size-8" : "size-9";

  const nameClass =
    size === "lg"
      ? "text-[1.65rem] leading-none"
      : size === "sm"
        ? "text-sm leading-none"
        : "text-base leading-none";

  return (
    <div
      className={`inline-flex ${
        stacked ? "flex-col gap-1" : "items-center gap-2"
      } ${className}`}
    >
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/icon.png"
          alt={brandName}
          width={size === "lg" ? 44 : size === "sm" ? 32 : 36}
          height={size === "lg" ? 44 : size === "sm" ? 32 : 36}
          className={`${logoClass} object-contain ${stacked ? "mx-auto" : ""}`}
        />
      ) : null}
      <span
        className={`font-brand ${nameClass} ${textClass} ${
          stacked ? "text-center" : ""
        }`}
      >
        {brandName}
      </span>
    </div>
  );
}
