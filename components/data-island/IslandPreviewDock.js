"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconClose, IconDownload, IconEye } from "../Icons";
import { formatBytes } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import {
  PREVIEW_KINDS,
  TEXT_PREVIEW_MAX_BYTES,
  canPreviewFile,
  getPreviewKind,
} from "../../lib/preview";
import { downloadFile, fetchFileBlob, formatFileError } from "../../services/files";
import { notifyError, notifySuccess } from "../../lib/toast";
import { easeOut } from "../../lib/motion";

export default function IslandPreviewDock({ open, file, onClose }) {
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [objectUrl, setObjectUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [blobMime, setBlobMime] = useState("");
  const [downloading, setDownloading] = useState(false);

  const previewable = file ? canPreviewFile(file) : false;

  const cleanup = useCallback((url) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    if (!open || !file) return undefined;

    let cancelled = false;
    let createdUrl = "";

    async function load() {
      setLoading(true);
      setError("");
      setTextContent("");
      setBlobMime("");
      setObjectUrl((prev) => {
        cleanup(prev);
        return "";
      });

      if (!canPreviewFile(file)) {
        setLoading(false);
        return;
      }

      try {
        const result = await fetchFileBlob(file.id);
        if (cancelled) {
          cleanup(result.url);
          return;
        }

        createdUrl = result.url;
        setBlobMime(result.mimeType || file.mimeType || "");
        setObjectUrl(result.url);

        const previewKind = getPreviewKind({
          ...file,
          mimeType: result.mimeType || file.mimeType,
        });

        if (previewKind === PREVIEW_KINDS.text) {
          if (result.size > TEXT_PREVIEW_MAX_BYTES) {
            setError(t("preview.tooLarge"));
          } else {
            const text = await result.blob.text();
            if (!cancelled) setTextContent(text);
          }
        }
      } catch (err) {
        if (!cancelled) setError(formatFileError(err) || t("preview.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      cleanup(createdUrl);
    };
  }, [open, file, cleanup, t]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleDownload() {
    if (!file || downloading) return;
    setDownloading(true);
    try {
      await downloadFile(file.id, file.name);
      notifySuccess(t("files.downloadStarted"));
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setDownloading(false);
    }
  }

  const effectiveKind = getPreviewKind({
    ...file,
    mimeType: blobMime || file?.mimeType,
  });

  return (
    <AnimatePresence>
      {open && file ? (
        <>
          <motion.button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 z-40 bg-[#042f3a]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={file.name}
            className="absolute inset-x-3 bottom-[5.75rem] z-50 mx-auto max-w-[390px] overflow-hidden rounded-[28px] border border-cyan-100/25 bg-gradient-to-b from-[#0ea5e9]/25 via-[#0c4a6e]/92 to-[#082f49] shadow-[0_24px_60px_rgba(8,47,73,0.55)] backdrop-blur-xl"
            initial={reduce ? false : { y: 80, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">
              <div className="min-w-0">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-cyan-300/15 px-2.5 py-1 text-[10px] font-semibold text-cyan-100 ring-1 ring-cyan-200/30">
                  <IconEye className="size-3.5" />
                  {t("dataIsland.previewBadge")}
                </div>
                <h2 className="truncate text-[15px] font-extrabold text-white">
                  {file.name}
                </h2>
                <p className="mt-0.5 text-[11px] text-cyan-100/75">
                  {formatBytes(file.sizeBytes || 0, t, locale)}
                  {file.mimeType ? ` · ${file.mimeType}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20"
                aria-label={t("common.close")}
              >
                <IconClose className="size-4" />
              </button>
            </div>

            <div className="mx-4 mb-3 min-h-[180px] overflow-hidden rounded-2xl bg-[#042f3a]/55 ring-1 ring-white/10">
              {loading ? (
                <div className="flex h-[180px] items-center justify-center text-sm text-cyan-100/80">
                  {t("common.pleaseWait")}
                </div>
              ) : error ? (
                <div className="flex h-[180px] items-center justify-center px-4 text-center text-sm text-rose-200">
                  {error}
                </div>
              ) : !previewable ? (
                <div className="flex h-[180px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-cyan-100/80">
                  <p>{t("preview.unavailable")}</p>
                </div>
              ) : effectiveKind === PREVIEW_KINDS.image && objectUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={objectUrl}
                  alt={file.name}
                  className="max-h-[240px] w-full object-contain"
                />
              ) : effectiveKind === PREVIEW_KINDS.pdf && objectUrl ? (
                <iframe
                  title={file.name}
                  src={objectUrl}
                  className="h-[240px] w-full bg-white"
                />
              ) : effectiveKind === PREVIEW_KINDS.video && objectUrl ? (
                <video
                  src={objectUrl}
                  controls
                  className="max-h-[240px] w-full"
                />
              ) : effectiveKind === PREVIEW_KINDS.audio && objectUrl ? (
                <div className="flex h-[180px] items-center justify-center px-4">
                  <audio src={objectUrl} controls className="w-full" />
                </div>
              ) : effectiveKind === PREVIEW_KINDS.text ? (
                <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap break-words p-3 text-[11px] leading-relaxed text-cyan-50">
                  {textContent}
                </pre>
              ) : (
                <div className="flex h-[180px] items-center justify-center text-sm text-cyan-100/80">
                  {t("preview.unavailable")}
                </div>
              )}
            </div>

            <div className="flex gap-2 px-4 pb-4">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-cyan-300 to-teal-500 px-3 py-2.5 text-sm font-bold text-[#042f3a] shadow-[0_10px_24px_rgba(34,211,238,0.35)] disabled:opacity-60"
              >
                <IconDownload className="size-4" />
                {t("files.download")}
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
