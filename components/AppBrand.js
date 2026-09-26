"use client";

import { useI18n } from "../lib/i18n/I18nProvider";
import LogoMark from "./LogoMark";

export default function AppBrand({
  tone = "ink",
  size = "md",
  showLogo = true,
  stacked = false,
  className = "",
  animated = true,
}) {
  const { brandName } = useI18n();

  const textClass =
    tone === "white"
      ? "text-white"
      : tone === "blue"
        ? "text-cs-blue"
        : "text-cs-ink";

  const markClass = tone === "white" ? "text-white" : "text-cs-blue";

  const logoClass =
    size === "lg" ? "size-12" : size === "sm" ? "size-9" : "size-10";

  const nameClass =
    size === "lg"
      ? "text-[1.65rem] leading-none"
      : size === "sm"
        ? "text-sm leading-none"
        : "text-base leading-none";

  return (
    <div
      className={`inline-flex ${
        stacked ? "flex-col gap-1.5" : "items-center gap-2.5"
      } ${className}`}
    >
      {showLogo ? (
        <LogoMark
          title={brandName}
          tone={tone === "white" ? "white" : "blue"}
          animated={animated}
          className={`${logoClass} ${markClass} shrink-0 ${
            stacked ? "mx-auto" : ""
          }`}
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
