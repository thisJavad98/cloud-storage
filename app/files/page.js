"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import AppBrand from "../../components/AppBrand";
import {
  FileGlyph,
  IconArrow,
  IconDownload,
  IconEdit,
  IconFolder,
  IconPlus,
  IconSearch,
  IconTrash,
} from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import Reveal from "../../components/Reveal";
import { formatBytes, formatDate, formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { getAccessToken, getStoredUser, saveSession } from "../../lib/session";
import { openUploadModal } from "../../lib/upload";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "../../lib/toast";
import { getMe } from "../../services/auth";
import {
  deleteFile,
  downloadFile,
  formatFileError,
  listFiles,
  listFolders,
  trashFile,
  updateFile,
} from "../../services/files";

function fileTone(mimeType = "", index = 0) {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return index % 2 === 0 ? "orange" : "blue";
}

export default function FilesPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const [me, folderRows, fileResult] = await Promise.all([
        getMe(),
        listFolders(),
        listFiles({ folderId: null, limit: 100 }),
      ]);
      saveSession({ user: me });
      setUser(me);
      setFolders(folderRows || []);
      setFiles(fileResult?.files || []);
    } catch (err) {
      notifyError(formatFileError(err));
      if (err?.status === 401) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
    refresh();
  }, [router, refresh]);

  const filteredFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((file) => file.name.toLowerCase().includes(q));
  }, [files, query]);

  async function handleRename(file) {
    if (!renameValue.trim()) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }
    setBusyId(file.id);
    try {
      await updateFile(file.id, { name: renameValue.trim() });
      setRenameId("");
      setMenuId("");
      notifySuccess(t("files.renamed"));
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  function askTrash(file) {
    setConfirmAction({
      type: "trash",
      file,
      title: t("files.trashTitle"),
      message: t("files.trashMessage"),
      confirmLabel: t("files.trashConfirm"),
      tone: "warning",
    });
  }

  function askDelete(file) {
    setConfirmAction({
      type: "delete",
      file,
      title: t("files.deleteTitle"),
      message: t("files.deleteMessage"),
      confirmLabel: t("files.deleteConfirm"),
      tone: "danger",
    });
  }

  async function runConfirmedAction() {
    if (!confirmAction?.file) return;

    const { type, file } = confirmAction;
    setConfirmLoading(true);
    setBusyId(file.id);

    try {
      if (type === "trash") {
        await trashFile(file.id);
        notifyInfo(t("files.trashed"));
      } else if (type === "delete") {
        await deleteFile(file.id);
        notifySuccess(t("files.deleted"));
      }
      setMenuId("");
      setConfirmAction(null);
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
      setConfirmLoading(false);
    }
  }

  async function handleDownload(file) {
    setBusyId(file.id);
    try {
      await downloadFile(file.id, file.name);
      setMenuId("");
      notifySuccess(t("files.downloadStarted"));
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  if (!user || loading) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-32">
        <header className="relative flex items-center justify-center px-5 pt-6">
          <div className="min-w-0 px-12 text-center">
            <AppBrand size="sm" showLogo={false} className="justify-center" />
            <h1 className="mt-0.5 text-base font-extrabold leading-7 text-cs-ink">
              {t("files.title")}
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="absolute right-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label={t("common.back")}
          >
            <IconArrow className="size-5 rotate-180" />
          </Link>
        </header>

        <div className="px-5 pt-5">
          <label className="relative block">
            <span className="sr-only">{t("common.search")}</span>
            <span className="search-field-icon pointer-events-none absolute inset-y-0 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("files.searchPlaceholder")}
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </div>

        <section className="px-5 pt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("files.foldersSection")}
            </h2>
            <Link
              href="/folders"
              className="icon-label text-xs font-semibold text-cs-blue"
            >
              <IconPlus className="size-4 shrink-0" />
              <span>{t("files.manageFolders")}</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {folders.map((folder, index) => (
              <Reveal
                key={folder.id}
                as={Link}
                href={`/folders/${folder.id}`}
                delay={index * 55}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line transition hover:ring-cs-blue/30"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4d4]">
                  <IconFolder className="size-7 text-cs-folder" />
                </div>
                <h3 className="mt-3 truncate text-sm font-bold leading-6 text-cs-ink">
                  {folder.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {formatDigits(folder.fileCount ?? 0, locale)} {t("common.file")}
                </p>
              </Reveal>
            ))}
            {!folders.length ? (
              <div className="col-span-2">
                <EmptyState
                  variant="folders"
                  compact
                  title={t("files.emptyFoldersTitle")}
                  description={t("files.emptyFoldersDesc")}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("files.rootFiles")}
            </h2>
            <span className="shrink-0 text-xs leading-5 text-cs-muted">
              {formatDigits(filteredFiles.length, locale)} {t("common.items")}
            </span>
          </div>

          <div className="space-y-3">
            {filteredFiles.map((file, index) => (
              <Reveal
                key={file.id}
                as="article"
                delay={Math.min(index, 10) * 45}
                className="relative rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-cs-line"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <FileGlyph tone={fileTone(file.mimeType, index)} />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="truncate text-sm font-bold leading-6 text-cs-ink">
                      {file.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                      {formatDate(file.updatedAt || file.createdAt, locale)}
                      <span className="mx-2 text-cs-line">|</span>
                      {formatBytes(file.sizeBytes, t, locale)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMenuId((current) => (current === file.id ? "" : file.id))
                    }
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-cs-muted"
                    aria-label={t("common.options")}
                  >
                    ⋮
                  </button>
                </div>

                {menuId === file.id ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-cs-line pt-3">
                    <button
                      type="button"
                      disabled={busyId === file.id}
                      onClick={() => handleDownload(file)}
                      className="icon-label justify-center rounded-xl bg-cs-blue-soft px-3 py-2.5 text-xs font-semibold text-cs-blue"
                    >
                      <IconDownload className="size-4 shrink-0" />
                      <span>{t("files.download")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenameId(file.id);
                        setRenameValue(file.name);
                      }}
                      className="icon-label justify-center rounded-xl bg-[#f1f3f8] px-3 py-2.5 text-xs font-semibold text-cs-ink"
                    >
                      <IconEdit className="size-4 shrink-0" />
                      <span>{t("files.rename")}</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId === file.id}
                      onClick={() => askTrash(file)}
                      className="icon-label justify-center rounded-xl bg-[#fff4d4] px-3 py-2.5 text-xs font-semibold text-[#9a6b00]"
                    >
                      <IconTrash className="size-4 shrink-0" />
                      <span>{t("files.trash")}</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId === file.id}
                      onClick={() => askDelete(file)}
                      className="icon-label justify-center rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
                    >
                      <IconTrash className="size-4 shrink-0" />
                      <span>{t("files.deleteForever")}</span>
                    </button>
                  </div>
                ) : null}

                {renameId === file.id ? (
                  <form
                    className="mt-3 flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleRename(file);
                    }}
                  >
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none ring-1 ring-transparent focus:ring-cs-blue/30"
                    />
                    <button
                      type="submit"
                      disabled={busyId === file.id}
                      className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white"
                    >
                      {t("common.save")}
                    </button>
                  </form>
                ) : null}
              </Reveal>
            ))}

            {!filteredFiles.length ? (
              <EmptyState
                variant="files"
                title={t("files.emptyFilesTitle")}
                description={t("files.emptyFilesDesc")}
                action={
                  <button
                    type="button"
                    onClick={() => openUploadModal()}
                    className="icon-label h-12 rounded-2xl bg-cs-blue px-5 font-bold text-white"
                  >
                    <IconPlus className="size-5 shrink-0" />
                    <span>{t("files.uploadFirst")}</span>
                  </button>
                }
              />
            ) : null}
          </div>
        </section>

        <BottomNav activeId="manage" onUploadSuccess={refresh} />

        <ConfirmModal
          open={Boolean(confirmAction)}
          title={confirmAction?.title}
          message={confirmAction?.message}
          confirmLabel={confirmAction?.confirmLabel}
          tone={confirmAction?.tone || "danger"}
          loading={confirmLoading}
          onCancel={() => {
            if (!confirmLoading) setConfirmAction(null);
          }}
          onConfirm={runConfirmedAction}
        />
      </div>
    </main>
  );
}
