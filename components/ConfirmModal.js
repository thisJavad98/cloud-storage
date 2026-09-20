"use client";

import { useEffect } from "react";
import { useI18n } from "../lib/i18n/I18nProvider";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !loading) {
        onCancel?.();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmClass =
    tone === "warning"
      ? "bg-[#e5a820] hover:bg-[#d49712]"
      : tone === "primary"
        ? "bg-cs-blue hover:bg-cs-blue-deep"
        : "bg-red-500 hover:bg-red-600";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-4 pb-8 pt-10 sm:items-center"
      role="presentation"
      onClick={() => {
        if (!loading) onCancel?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-[360px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 pb-5 pt-6 text-center">
          <div
            className={`mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl ${
              tone === "warning"
                ? "bg-[#fff4d4] text-[#9a6b00]"
                : tone === "primary"
                  ? "bg-cs-blue-soft text-cs-blue"
                  : "bg-red-50 text-red-500"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-7"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 8v5M12 16.2h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10.2 4.8h3.6L20 18.5H4L10.2 4.8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            id="confirm-modal-title"
            className="text-lg font-extrabold leading-8 text-cs-ink"
          >
            {title}
          </h2>
          <p
            id="confirm-modal-message"
            className="mt-2 text-sm leading-7 text-cs-muted"
          >
            {message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-cs-line px-5 py-4">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-12 rounded-2xl bg-[#f1f3f8] text-sm font-bold text-cs-ink transition disabled:opacity-60"
          >
            {cancelLabel || t("common.cancel")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`h-12 rounded-2xl text-sm font-bold text-white transition disabled:opacity-70 ${confirmClass}`}
          >
            {loading
              ? t("common.pleaseWait")
              : confirmLabel || t("common.yes")}
          </button>
        </div>
      </div>
    </div>
  );
}
