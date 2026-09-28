"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EmptyFoldersIllu, LoadingCloudIllu } from "./MotionIllustrations";
import { IconFolder, IconPlus, IconUpload } from "./Icons";
import { formatBytes, formatDigits } from "../lib/format";
import { useI18n } from "../lib/i18n/I18nProvider";
import { notifyError, notifySuccess, notifyWarning } from "../lib/toast";
import {
  createFolder,
  formatFileError,
  listFolders,
  uploadFile,
} from "../services/files";

export default function UploadModal({
  open,
  onClose,
  defaultFolderId = null,
  onSuccess,
}) {
  const { t, locale } = useI18n();
  const fileInputRef = useRef(null);
  const createInputRef = useRef(null);
  const uploadingRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [folderId, setFolderId] = useState(defaultFolderId || "root");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  uploadingRef.current = uploading || creatingFolder;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    setFolderId(defaultFolderId || "root");
    setSelectedFile(null);
    setUploading(false);
    setShowCreateFolder(false);
    setNewFolderName("");
    setCreatingFolder(false);

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

  useEffect(() => {
    if (!open) return;
    setFolderId(defaultFolderId || "root");
  }, [open, defaultFolderId]);

  useEffect(() => {
    if (showCreateFolder) {
      const timer = window.setTimeout(() => createInputRef.current?.focus(), 40);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [showCreateFolder]);

  if (!open || !mounted) return null;

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    setSelectedFile(file);
  }

  async function refreshFolders() {
    setLoadingFolders(true);
    try {
      const rows = await listFolders();
      setFolders(rows || []);
      return rows || [];
    } catch (err) {
      notifyError(formatFileError(err));
      return folders;
    } finally {
      setLoadingFolders(false);
    }
  }

  async function handleCreateFolder(event) {
    event.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }

    setCreatingFolder(true);
    try {
      const folder = await createFolder({ name: trimmed });
      notifySuccess(t("folders.created"));
      setNewFolderName("");
      setShowCreateFolder(false);
      const rows = await refreshFolders();
      const created =
        rows.find((item) => item.id === folder?.id) || folder || null;
      if (created?.id) setFolderId(created.id);
      await onSuccess?.();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setCreatingFolder(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      notifyWarning(t("upload.pickRequired"));
      return;
    }

    setUploading(true);
    try {
      const targetFolderId = folderId === "root" ? null : folderId;
      await uploadFile(selectedFile, { folderId: targetFolderId || undefined });
      notifySuccess(t("upload.success"));
      onClose?.();
      await onSuccess?.();
      try {
        const { emitLibrarySync } = await import("../lib/sync");
        emitLibrarySync("upload");
      } catch {
        // ignore
      }
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setUploading(false);
    }
  }

  const selectedFolderName =
    folderId === "root"
      ? t("upload.root")
      : folders.find((item) => item.id === folderId)?.name || t("common.folder");

  const busy = uploading || creatingFolder;

  const modal = (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 sm:items-center"
      role="presentation"
      onClick={() => {
        if (!busy) onClose?.();
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
                {t("upload.title")}
              </h2>
              <p className="text-xs leading-5 text-cs-muted">
                {t("upload.folder")}
              </p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-cs-ink">{t("upload.folder")}</p>
            <button
              type="button"
              disabled={busy}
              onClick={() => setShowCreateFolder((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full bg-cs-blue-soft px-2.5 py-1 text-[11px] font-bold text-cs-blue disabled:opacity-60"
            >
              <IconPlus className="size-3.5" />
              {t("upload.createFolder")}
            </button>
          </div>

          {showCreateFolder ? (
            <form
              onSubmit={handleCreateFolder}
              className="mb-2 rounded-2xl bg-[#f7f8fc] p-3 ring-1 ring-cs-line"
            >
              <p className="mb-2 text-xs font-bold text-cs-ink">
                {t("folders.createTitle")}
              </p>
              <div className="flex items-center gap-2">
                <input
                  ref={createInputRef}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={t("folders.namePlaceholder")}
                  disabled={creatingFolder}
                  className="h-10 min-w-0 flex-1 rounded-xl bg-white px-3 text-sm outline-none ring-1 ring-cs-line focus:ring-cs-blue/30 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  className="h-10 shrink-0 rounded-xl bg-cs-blue px-3 text-xs font-bold text-white disabled:opacity-60"
                >
                  {creatingFolder ? t("folders.creating") : t("folders.create")}
                </button>
              </div>
            </form>
          ) : null}

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
                  {t("files.rootFiles")}
                </span>
                <span className="block text-[11px] text-cs-muted">
                  {t("upload.root")}
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
              <div className="flex flex-col items-center gap-2 px-3 py-5">
                <LoadingCloudIllu className="h-auto w-20" />
                <p className="text-xs text-cs-muted">
                  {t("upload.loadingFolders")}
                </p>
                <div className="flex gap-1" aria-hidden="true">
                  <span className="loader-dot loader-dot--a" />
                  <span className="loader-dot loader-dot--b" />
                  <span className="loader-dot loader-dot--c" />
                </div>
              </div>
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
                      {formatDigits(folder.fileCount ?? 0, locale)}{" "}
                      {t("common.file")}
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
                <EmptyFoldersIllu className="mx-auto h-auto w-24" />
                <p className="mt-2 text-xs leading-6 text-cs-muted">
                  {t("upload.noFolders")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateFolder(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-cs-blue"
                >
                  <IconPlus className="size-3.5" />
                  {t("upload.createFolder")}
                </button>
              </div>
            ) : null}
          </div>

          <p className="mb-2 mt-4 text-sm font-bold text-cs-ink">
            {t("upload.file")}
          </p>
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
            <span
              className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-cs-blue shadow-sm ${
                selectedFile ? "" : "animate-soft-float"
              }`}
            >
              <IconPlus className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              {selectedFile ? (
                <>
                  <span className="block truncate text-sm font-bold text-cs-ink">
                    {selectedFile.name}
                  </span>
                  <span className="block text-[11px] text-cs-muted">
                    {formatBytes(selectedFile.size, t, locale)}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-sm font-bold text-cs-ink">
                    {t("upload.pickFile")}
                  </span>
                  <span className="block text-[11px] text-cs-muted">
                    {t("upload.uploadTo", { name: selectedFolderName })}
                  </span>
                </>
              )}
            </span>
          </button>
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
            type="button"
            disabled={busy || !selectedFile}
            onClick={handleUpload}
            className="h-12 rounded-2xl bg-cs-blue text-sm font-bold text-white transition hover:bg-cs-blue-deep disabled:opacity-60"
          >
            {uploading ? t("upload.uploading") : t("upload.upload")}
          </button>
        </div>
        {uploading ? (
          <div className="px-5 pb-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-cs-line">
              <div className="shimmer h-full w-full rounded-full bg-cs-blue/40" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
