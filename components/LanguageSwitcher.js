"use client";

import { useI18n } from "../lib/i18n/I18nProvider";

export default function LanguageSwitcher({
  tone = "light",
  className = "",
}) {
  const { locale, setLocale, t } = useI18n();

  const base =
    tone === "dark"
      ? "bg-white/10 text-white ring-white/20"
      : "bg-white text-cs-ink ring-cs-line";

  const active =
    tone === "dark"
      ? "bg-white text-cs-blue"
      : "bg-cs-blue text-white";

  const idle =
    tone === "dark"
      ? "text-white/75 hover:bg-white/15"
      : "text-cs-muted hover:bg-cs-blue-soft/60";

  return (
    <div
      className={`inline-flex items-center rounded-full p-1 ring-1 ${base} ${className}`}
      role="group"
      aria-label={t("common.language")}
    >
      <button
        type="button"
        onClick={() => setLocale("fa")}
        className={`h-8 min-w-10 rounded-full px-2.5 text-xs font-bold transition ${
          locale === "fa" ? active : idle
        }`}
        aria-pressed={locale === "fa"}
      >
        FA
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`h-8 min-w-10 rounded-full px-2.5 text-xs font-bold transition ${
          locale === "en" ? active : idle
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
