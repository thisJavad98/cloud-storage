"use client";

import { useId } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { FOLDER_ICONS, getFolderIcon, normalizeFolderIconId } from "../lib/folderIcons";
import { useI18n } from "../lib/i18n/I18nProvider";
import { easeOut } from "../lib/motion";
import FolderIcon from "./FolderIcon";
import FolderIconMark from "./FolderIconMark";

export default function FolderIconPicker({
  value = "default",
  onChange,
  disabled = false,
  className = "",
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const groupId = useId();
  const selected = normalizeFolderIconId(value);
  const active = getFolderIcon(selected);

  return (
    <fieldset className={`folder-icon-picker ${className}`} disabled={disabled}>
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <legend className="block text-sm font-bold text-cs-ink">
          {t("folders.iconLabel")}
        </legend>
        <p className="text-[11px] font-semibold leading-4 text-cs-muted">
          {t(active.labelKey)}
        </p>
      </div>

      <div
        className="mb-3 flex items-center gap-3 rounded-2xl px-3 py-2.5"
        style={{
          background: `linear-gradient(135deg, ${active.tile} 0%, color-mix(in srgb, ${active.tile} 55%, var(--cs-card)) 100%)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${active.ink} 14%, transparent)`,
        }}
      >
        <FolderIcon icon={selected} size="lg" />
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-sm font-extrabold text-cs-ink">
            {t(active.labelKey)}
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-cs-muted">
            {t("folders.iconHint")}
          </p>
        </div>
      </div>

      <LayoutGroup id={groupId}>
        <div
          className="folder-icon-picker__grid grid grid-cols-6 gap-2 rounded-2xl p-2 ring-1 ring-cs-line/80"
          role="listbox"
          aria-label={t("folders.iconLabel")}
        >
          {FOLDER_ICONS.map((item) => {
            const isActive = item.id === selected;
            return (
              <motion.button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={t(item.labelKey)}
                disabled={disabled}
                onClick={() => onChange?.(item.id)}
                className="relative inline-flex aspect-square items-center justify-center rounded-[0.85rem] outline-none focus-visible:ring-2 focus-visible:ring-cs-blue/40 disabled:opacity-55"
                style={{
                  background: `linear-gradient(165deg, ${item.tile} 0%, color-mix(in srgb, ${item.tile} 70%, white) 100%)`,
                  color: item.ink,
                  boxShadow: isActive
                    ? `0 0 0 2px var(--cs-card), 0 0 0 4px ${item.accent}`
                    : `inset 0 0 0 1px color-mix(in srgb, ${item.ink} 10%, transparent)`,
                }}
                whileHover={
                  reduce || disabled || isActive
                    ? undefined
                    : { y: -2, transition: { duration: 0.15, ease: easeOut } }
                }
                whileTap={
                  reduce || disabled
                    ? undefined
                    : { scale: 0.985, y: 1, transition: { duration: 0.09 } }
                }
                transition={{ duration: 0.15, ease: easeOut }}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`${groupId}-active`}
                    className="pointer-events-none absolute inset-0 rounded-[0.85rem]"
                    style={{
                      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${item.ink} 18%, transparent)`,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative inline-flex">
                  <FolderIconMark
                    icon={item.id}
                    className="size-[1.35rem]"
                    color={item.ink}
                    deep={item.deep}
                  />
                </span>
                {isActive ? (
                  <span
                    className="absolute end-1 top-1 size-1.5 rounded-full"
                    style={{ backgroundColor: item.accent }}
                    aria-hidden="true"
                  />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </fieldset>
  );
}
