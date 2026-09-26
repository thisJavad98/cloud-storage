"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconClose, IconDownload, IconEye } from "./Icons";
import { formatBytes } from "../lib/format";
import { useI18n } from "../lib/i18n/I18nProvider";
import {
  PREVIEW_KINDS,
  TEXT_PREVIEW_MAX_BYTES,
  canPreviewFile,
  getPreviewKind,
} from "../lib/preview";
import { downloadFile, fetchFileBlob, formatFileError } from "../services/files";
import { notifyError, notifySuccess } from "../lib/toast";
import { easeOut } from "../lib/motion";

export default function FilePreviewModal({ open, file, onClose }) {
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [objectUrl, setObjectUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [blobMime, setBlobMime] = useState("");
  const [downloading, setDownloading] = useState(false);

  const kind = file ? getPreviewKind(file) : PREVIEW_KINDS.none;
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

    function onKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setObjectUrl((prev) => {
        cleanup(prev);
        return "";
      });
      setTextContent("");
      setError("");
      setLoading(false);
    }
  }, [open, cleanup]);

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

  return (
    <AnimatePresence>
      {open && file ? (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/55 px-3 pb-4 pt-8 backdrop-blur-[6px] sm:items-center sm:pb-8"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={() => onClose?.()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="file-preview-title"
            className="flex max-h-[min(92dvh,820px)] w-full max-w-[520px] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.32, ease: easeOut }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex shrink-0 items-start gap-3 border-b border-cs-line px-4 py-3.5">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-cs-blue-soft text-cs-blue">
                <IconEye open className="size-5" />
              </span>
              <div className="min-w-0 flex-1 text-start">
                <h2
                  id="file-preview-title"
                  className="truncate text-sm font-extrabold text-cs-ink"
                  title={file.name}
                >
                  {file.name}
                </h2>
                <p className="mt-0.5 text-[11px] text-cs-muted">
                  {formatBytes(file.sizeBytes, t, locale)}
                  {blobMime || file.mimeType ? (
                    <>
                      <span className="mx-1.5 text-cs-line">·</span>
                      <span dir="ltr" className="truncate">
                        {blobMime || file.mimeType}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onClose?.()}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1f3f8] text-cs-muted"
                aria-label={t("common.close")}
              >
                <IconClose className="size-4" />
              </button>
            </header>

            <div className="relative min-h-[220px] flex-1 overflow-auto bg-[#f6f8fc]">
              {loading ? (
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="size-9 animate-spin rounded-full border-2 border-cs-blue/25 border-t-cs-blue" />
                  <p className="text-sm font-semibold text-cs-ink">{t("preview.loading")}</p>
                </div>
              ) : null}

              {!loading && error ? (
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-sm font-bold text-cs-ink">{t("preview.unavailable")}</p>
                  <p className="text-xs leading-5 text-cs-muted">{error}</p>
                </div>
              ) : null}

              {!loading && !error && !previewable ? (
                <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-sm font-bold text-cs-ink">{t("preview.unsupportedTitle")}</p>
                  <p className="max-w-[280px] text-xs leading-5 text-cs-muted">
                    {t("preview.unsupportedDesc")}
                  </p>
                </div>
              ) : null}

              {!loading && !error && previewable && objectUrl ? (
                <PreviewBody
                  kind={kind}
                  url={objectUrl}
                  name={file.name}
                  textContent={textContent}
                  t={t}
                />
              ) : null}
            </div>

            <footer className="flex shrink-0 items-center gap-2 border-t border-cs-line bg-white px-4 py-3">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownload}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-cs-blue text-sm font-bold text-white disabled:opacity-60"
              >
                <IconDownload className="size-4" />
                {t("files.download")}
              </button>
              <button
                type="button"
                onClick={() => onClose?.()}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#f1f3f8] px-4 text-sm font-semibold text-cs-ink"
              >
                {t("common.close")}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PreviewBody({ kind, url, name, textContent, t }) {
  if (kind === PREVIEW_KINDS.image) {
    return (
      <div className="flex min-h-[240px] items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={name}
          className="max-h-[min(58dvh,560px)] max-w-full rounded-xl object-contain shadow-[0_12px_32px_rgba(21,32,56,0.12)]"
        />
      </div>
    );
  }

  if (kind === PREVIEW_KINDS.pdf) {
    return (
      <iframe
        title={name}
        src={`${url}#toolbar=1&navpanes=0`}
        className="h-[min(58dvh,560px)] w-full border-0 bg-white"
      />
    );
  }

  if (kind === PREVIEW_KINDS.video) {
    return (
      <div className="flex min-h-[240px] items-center justify-center p-3">
        <video
          src={url}
          controls
          playsInline
          className="max-h-[min(58dvh,560px)] w-full rounded-xl bg-black"
        >
          {t("preview.videoFallback")}
        </video>
      </div>
    );
  }

  if (kind === PREVIEW_KINDS.audio) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 px-6">
        <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-cs-blue-soft text-cs-blue">
          <IconEye open className="size-7" />
        </div>
        <p className="max-w-full truncate text-sm font-bold text-cs-ink">{name}</p>
        <audio src={url} controls className="w-full max-w-sm" />
      </div>
    );
  }

  if (kind === PREVIEW_KINDS.text) {
    return (
      <pre
        dir="auto"
        className="m-0 min-h-[240px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[11.5px] leading-5 text-cs-ink"
      >
        {textContent || t("preview.emptyText")}
      </pre>
    );
  }

  return null;
}
