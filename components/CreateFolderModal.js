"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconClose, IconFolder, IconPlus } from "./Icons";
import { useI18n } from "../lib/i18n/I18nProvider";
import { notifyError, notifySuccess, notifyWarning } from "../lib/toast";
import { createFolder, formatFileError } from "../services/files";

export default function CreateFolderModal({
  open,
  onClose,
  parentId = null,
  onCreated,
}) {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    setName("");
    setBusy(false);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    function onKeyDown(event) {
      if (event.key === "Escape" && !busy) onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, busy]);

  if (!open || !mounted) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }

    setBusy(true);
    try {
      const folder = await createFolder({
        name: trimmed,
        parentId: parentId || null,
      });
      notifySuccess(t("folders.created"));
      onClose?.();
      await onCreated?.(folder);
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusy(false);
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 sm:items-center"
      role="presentation"
      onClick={() => {
        if (!busy) onClose?.();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-folder-title"
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 px-5 pb-3 pt-5">
          <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4d4] text-cs-folder">
            <IconFolder className="size-6" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <h2
              id="create-folder-title"
              className="text-lg font-extrabold leading-8 text-cs-ink"
            >
              {t("folders.createTitle")}
            </h2>
            <p className="text-xs leading-5 text-cs-muted">
              {t("folders.emptyDesc")}
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1f3f8] text-cs-ink disabled:opacity-60"
            aria-label={t("common.close")}
          >
            <IconClose className="size-4" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-cs-ink">
              {t("folders.namePlaceholder")}
            </span>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("folders.namePlaceholder")}
              disabled={busy}
              className="h-12 w-full rounded-2xl bg-[#f1f3f8] px-4 text-sm outline-none ring-1 ring-transparent focus:ring-cs-blue/30 disabled:opacity-70"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-cs-line px-5 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-12 rounded-2xl bg-[#f1f3f8] text-sm font-bold text-cs-ink disabled:opacity-60"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cs-blue text-sm font-bold text-white transition hover:bg-cs-blue-deep disabled:opacity-60"
          >
            <IconPlus className="size-4" />
            {busy ? t("folders.creating") : t("folders.create")}
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(modal, document.body);
}
