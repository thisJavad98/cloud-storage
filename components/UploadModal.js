"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconFolder, IconPlus, IconUpload } from "./Icons";
import { notifyError, notifySuccess, notifyWarning } from "../lib/toast";
import {
  formatFileError,
  listFolders,
  uploadFile,
} from "../services/files";

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "۰ بایت";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${toPersianDigits(rounded)}\u00A0${units[unit]}`;
}

export default function UploadModal({
  open,
  onClose,
  defaultFolderId = null,
  onSuccess,
}) {
  const fileInputRef = useRef(null);
  const uploadingRef = useRef(false);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [folderId, setFolderId] = useState(defaultFolderId || "root");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  uploadingRef.current = uploading;

  useEffect(() => {
    if (!open) return undefined;

    setFolderId(defaultFolderId || "root");
    setSelectedFile(null);
    setUploading(false);

    let cancelled = false;
    async function loadFolders() {
      setLoadingFolders(true);
      try {
        const rows = await listFolders();
        if (!cancelled) setFolders(rows || []);
      } catch (err) {
        if (!cancelled) notifyError(formatFileError(err));
      } finally {
        if (!cancelled) setLoadingFolders(false);
      }
    }

    loadFolders();

    function onKeyDown(event) {
      if (event.key === "Escape" && !uploadingRef.current) onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, defaultFolderId, onClose]);

  if (!open) return null;

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      notifyWarning("ابتدا یک فایل انتخاب کنید");
      return;
    }

    setUploading(true);
    try {
      const targetFolderId = folderId === "root" ? null : folderId;
      await uploadFile(selectedFile, { folderId: targetFolderId || undefined });
      notifySuccess(
        targetFolderId
          ? "فایل داخل پوشه انتخاب‌شده آپلود شد"
          : "فایل با موفقیت آپلود شد"
      );
      onClose?.();
      await onSuccess?.();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setUploading(false);
    }
  }

  const selectedFolderName =
    folderId === "root"
      ? "فایل‌های ریشه"
      : folders.find((item) => item.id === folderId)?.name || "پوشه";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-4 pb-6 pt-10 sm:items-center"
      role="presentation"
      onClick={() => {
        if (!uploading) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="w-full max-w-[360px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 pb-4 pt-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cs-blue-soft text-cs-blue">
              <IconUpload className="size-6" />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <h2
                id="upload-modal-title"
                className="text-lg font-extrabold leading-8 text-cs-ink"
              >
                آپلود فایل
              </h2>
              <p className="text-xs leading-5 text-cs-muted">
                پوشه مقصد را انتخاب کنید، سپس فایل را بفرستید
              </p>
            </div>
          </div>

          <p className="mb-2 text-sm font-bold text-cs-ink">مقصد آپلود</p>
          <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl bg-[#f7f8fc] p-2">
            <button
              type="button"
              onClick={() => setFolderId("root")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition ${
                folderId === "root"
                  ? "bg-white ring-2 ring-cs-blue/30"
                  : "hover:bg-white/80"
              }`}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-cs-blue-soft text-cs-blue">
                <IconUpload className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-cs-ink">
                  فایل‌های ریشه
                </span>
                <span className="block text-[11px] text-cs-muted">
                  بدون پوشه
                </span>
              </span>
              <span
                className={`size-4 shrink-0 rounded-full border-2 ${
                  folderId === "root"
                    ? "border-cs-blue bg-cs-blue"
                    : "border-cs-line"
                }`}
              />
            </button>

            {loadingFolders ? (
              <p className="px-3 py-4 text-center text-xs text-cs-muted">
                در حال بارگذاری پوشه‌ها...
              </p>
            ) : null}

            {!loadingFolders &&
              folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setFolderId(folder.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition ${
                    folderId === folder.id
                      ? "bg-white ring-2 ring-cs-blue/30"
                      : "hover:bg-white/80"
                  }`}
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4d4]">
                    <IconFolder className="size-5 text-cs-folder" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-cs-ink">
                      {folder.name}
                    </span>
                    <span className="block text-[11px] text-cs-muted">
                      {toPersianDigits(folder.fileCount ?? 0)} فایل
                    </span>
                  </span>
                  <span
                    className={`size-4 shrink-0 rounded-full border-2 ${
                      folderId === folder.id
                        ? "border-cs-blue bg-cs-blue"
                        : "border-cs-line"
                    }`}
                  />
                </button>
              ))}

            {!loadingFolders && !folders.length ? (
              <div className="rounded-xl px-3 py-4 text-center">
                <p className="text-xs leading-6 text-cs-muted">
                  هنوز پوشه‌ای ندارید
                </p>
                <Link
                  href="/folders"
                  onClick={onClose}
                  className="mt-2 inline-flex text-xs font-bold text-cs-blue"
                >
                  ساخت پوشه جدید
                </Link>
              </div>
            ) : null}
          </div>

          <p className="mb-2 mt-4 text-sm font-bold text-cs-ink">فایل</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-cs-line bg-[#f7f8fc] px-4 py-3.5 text-right transition hover:border-cs-blue/40 hover:bg-cs-blue-soft/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-cs-blue shadow-sm">
              <IconPlus className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              {selectedFile ? (
                <>
                  <span className="block truncate text-sm font-bold text-cs-ink">
                    {selectedFile.name}
                  </span>
                  <span className="block text-[11px] text-cs-muted">
                    {formatBytes(selectedFile.size)}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-sm font-bold text-cs-ink">
                    انتخاب فایل
                  </span>
                  <span className="block text-[11px] text-cs-muted">
                    برای آپلود در «{selectedFolderName}»
                  </span>
                </>
              )}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-cs-line px-5 py-4">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="h-12 rounded-2xl bg-[#f1f3f8] text-sm font-bold text-cs-ink disabled:opacity-60"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={uploading || !selectedFile}
            onClick={handleUpload}
            className="h-12 rounded-2xl bg-cs-blue text-sm font-bold text-white transition hover:bg-cs-blue-deep disabled:opacity-60"
          >
            {uploading ? "در حال آپلود..." : "آپلود"}
          </button>
        </div>
      </div>
    </div>
  );
}
