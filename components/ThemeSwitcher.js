"use client";

import { useTheme } from "../lib/theme/ThemeProvider";
import { useI18n } from "../lib/i18n/I18nProvider";

function IconSun({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M19 13.5A7.5 7.5 0 1 1 10.5 5 6 6 0 0 0 19 13.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeSwitcher({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-cs-surface p-1 ring-1 ring-cs-line ${className}`}
      role="group"
      aria-label={t("common.theme")}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition ${
          theme === "light"
            ? "bg-cs-blue text-white"
            : "text-cs-muted hover:bg-cs-blue-soft/60 hover:text-cs-blue"
        }`}
        aria-pressed={theme === "light"}
        title={t("common.light")}
      >
        <IconSun className="size-3.5" />
        <span>{t("common.light")}</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition ${
          theme === "dark"
            ? "bg-cs-blue text-white"
            : "text-cs-muted hover:bg-cs-blue-soft/60 hover:text-cs-blue"
        }`}
        aria-pressed={theme === "dark"}
        title={t("common.dark")}
      >
        <IconMoon className="size-3.5" />
        <span>{t("common.dark")}</span>
      </button>
    </div>
  );
}
