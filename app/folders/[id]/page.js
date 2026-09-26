"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "../../../components/BottomNav";
import ConfirmModal from "../../../components/ConfirmModal";
import EmptyState from "../../../components/EmptyState";
import AppBrand from "../../../components/AppBrand";
import {
  FileGlyph,
  IconArrow,
  IconDownload,
  IconEdit,
  IconFolder,
  IconPlus,
  IconSearch,
  IconTrash,
} from "../../../components/Icons";
import PageLoader from "../../../components/PageLoader";
import { MotionBlock, MotionHeader } from "../../../components/PageMotion";
import Reveal from "../../../components/Reveal";
import { formatBytes, formatDate, formatDigits } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n/I18nProvider";
import { finishPageLoad } from "../../../lib/pageLoading";
import { getAccessToken, getStoredUser, saveSession } from "../../../lib/session";
import { openUploadModal } from "../../../lib/upload";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "../../../lib/toast";
import { getMe } from "../../../services/auth";
import {
  createFolder,
  deleteFile,
  deleteFolder,
  downloadFile,
  formatFileError,
  getFolder,
  listFiles,
  listFolders,
  trashFile,
  updateFile,
  updateFolder,
} from "../../../services/files";

function fileTone(mimeType = "", index = 0) {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return index % 2 === 0 ? "orange" : "blue";
}

export default function FolderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params?.id;
  const { t, locale } = useI18n();

  const [user, setUser] = useState(null);
  const [folder, setFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [folderRenameValue, setFolderRenameValue] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const bootRef = useRef(true);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!folderId) return;

    const startedAt = Date.now();
    const isBoot = bootRef.current;

    try {
      const [me, folderData, childFolders, fileResult] = await Promise.all([
        getMe(),
        getFolder(folderId),
        listFolders({ parentId: folderId }),
        listFiles({ folderId, limit: 100 }),
      ]);
      saveSession({ user: me });
      setUser(me);
      setFolder(folderData);
      setSubfolders(childFolders || []);
      setFiles(fileResult?.files || []);
      setFolderRenameValue(folderData?.name || "");
    } catch (err) {
      notifyError(formatFileError(err));
      if (err?.status === 401) router.replace("/login");
      if (err?.status === 404) router.replace("/files");
    } finally {
      if (isBoot) {
        await finishPageLoad(startedAt);
        bootRef.current = false;
      }
      setLoading(false);
    }
  }, [folderId, router]);

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

  async function handleCreateSubfolder(event) {
    event.preventDefault();
    if (!folderName.trim()) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }
    setBusyId("folder");
    try {
      await createFolder({ name: folderName.trim(), parentId: folderId });
      setFolderName("");
      setShowFolderForm(false);
      notifySuccess(t("folderDetail.subfolderCreated"));
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  async function handleRenameFolder(event) {
    event.preventDefault();
    if (!folderRenameValue.trim()) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }
    setBusyId("rename-folder");
    try {
      await updateFolder(folderId, { name: folderRenameValue.trim() });
      setRenameFolderOpen(false);
      notifySuccess(t("folders.renamed"));
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  async function handleRenameFile(file) {
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

  function askTrash(file) {
    setConfirmAction({
      type: "trash-file",
      file,
      title: t("files.trashTitle"),
      message: t("files.trashMessage"),
      confirmLabel: t("files.trashConfirm"),
      tone: "warning",
    });
  }

  function askDeleteFile(file) {
    setConfirmAction({
      type: "delete-file",
      file,
      title: t("files.deleteTitle"),
      message: t("files.deleteMessage"),
      confirmLabel: t("files.deleteConfirm"),
      tone: "danger",
    });
  }

  function askDeleteFolder() {
    setConfirmAction({
      type: "delete-folder",
      title: t("folders.deleteTitle"),
      message: t("folders.deleteMessage"),
      confirmLabel: t("folders.deleteConfirm"),
      tone: "danger",
    });
  }

  async function runConfirmedAction() {
    if (!confirmAction) return;
    setConfirmLoading(true);

    try {
      if (confirmAction.type === "trash-file") {
        setBusyId(confirmAction.file.id);
        await trashFile(confirmAction.file.id);
        notifyInfo(t("files.trashed"));
      } else if (confirmAction.type === "delete-file") {
        setBusyId(confirmAction.file.id);
        await deleteFile(confirmAction.file.id);
        notifySuccess(t("files.deleted"));
      } else if (confirmAction.type === "delete-folder") {
        await deleteFolder(folderId);
        notifySuccess(t("folders.deleted"));
        setConfirmAction(null);
        router.replace("/files");
        return;
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

  if (!user || loading || !folder) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-32">
        <MotionHeader className="flex items-center justify-center px-5 pt-6">
          <div className="min-w-0 px-12 text-center">
            <AppBrand size="sm" showLogo={false} className="justify-center" />
            <h1 className="mt-0.5 truncate text-base font-extrabold leading-7 text-cs-ink">
              {folder.name}
            </h1>
            <p className="text-[11px] leading-5 text-cs-muted">
              {formatDigits(folder.fileCount ?? files.length, locale)}{" "}
              {t("common.file")}
            </p>
          </div>
          <Link
            href="/folders"
            className="absolute right-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label={t("common.back")}
          >
            <IconArrow className="size-5 rotate-180" />
          </Link>
        </MotionHeader>

        <MotionBlock className="px-5 pt-5" delay={0.1} as="section" variant="scale">
          <div className="rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-cs-line">
            <div className="flex items-center gap-3">
              <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fff4d4]">
                <IconFolder className="size-7 text-cs-folder" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="truncate text-sm font-bold leading-6 text-cs-ink">
                  {folder.name}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-cs-muted">
                  {t("folderDetail.uploadHere")}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFolderRenameValue(folder.name);
                  setRenameFolderOpen((v) => !v);
                }}
                className="icon-label justify-center rounded-xl bg-[#f1f3f8] px-3 py-2.5 text-xs font-semibold text-cs-ink"
              >
                <IconEdit className="size-4 shrink-0" />
                <span>{t("folders.rename")}</span>
              </button>
              <button
                type="button"
                onClick={askDeleteFolder}
                className="icon-label justify-center rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                <IconTrash className="size-4 shrink-0" />
                <span>{t("folders.delete")}</span>
              </button>
            </div>

            {renameFolderOpen ? (
              <form onSubmit={handleRenameFolder} className="mt-3 flex gap-2">
                <input
                  value={folderRenameValue}
                  onChange={(e) => setFolderRenameValue(e.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
                />
                <button
                  type="submit"
                  disabled={busyId === "rename-folder"}
                  className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white"
                >
                  {t("common.save")}
                </button>
              </form>
            ) : null}
          </div>
        </MotionBlock>

        <MotionBlock className="px-5 pt-4" delay={0.16}>
          <label className="relative block">
            <span className="sr-only">{t("common.search")}</span>
            <span className="search-field-icon pointer-events-none absolute inset-y-0 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("folderDetail.searchPlaceholder")}
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </MotionBlock>

        <MotionBlock className="px-5 pt-6" delay={0.22} as="section">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("folderDetail.subfolders")}
            </h2>
            <button
              type="button"
              onClick={() => setShowFolderForm((v) => !v)}
              className="icon-label text-xs font-semibold text-cs-blue"
            >
              <IconPlus className="size-4 shrink-0" />
              <span>{t("folderDetail.subfolder")}</span>
            </button>
          </div>

          {showFolderForm ? (
            <form
              onSubmit={handleCreateSubfolder}
              className="mb-3 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-cs-line"
            >
              <input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder={t("folderDetail.subfolderName")}
                className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
              />
              <button
                type="submit"
                disabled={busyId === "folder"}
                className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white"
              >
                {t("folderDetail.create")}
              </button>
            </form>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            {subfolders.map((item, index) => (
              <Reveal
                key={item.id}
                as={Link}
                href={`/folders/${item.id}`}
                delay={index * 55}
                hover
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line transition hover:ring-cs-blue/30"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4d4]">
                  <IconFolder className="size-7 text-cs-folder" />
                </div>
                <h3 className="mt-3 truncate text-sm font-bold leading-6 text-cs-ink">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {formatDigits(item.fileCount ?? 0, locale)} {t("common.file")}
                </p>
              </Reveal>
            ))}
            {!subfolders.length ? (
              <div className="col-span-2">
                <EmptyState
                  variant="folders"
                  compact
                  title={t("folderDetail.emptySubfoldersTitle")}
                  description={t("folderDetail.emptySubfoldersDesc")}
                />
              </div>
            ) : null}
          </div>
        </MotionBlock>

        <MotionBlock className="px-5 pt-7" delay={0.28} as="section">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("folderDetail.filesInFolder")}
            </h2>
            <span className="text-xs leading-5 text-cs-muted">
              {formatDigits(filteredFiles.length, locale)} {t("common.items")}
            </span>
          </div>

          <div className="space-y-3">
            {filteredFiles.map((file, index) => (
              <Reveal
                key={file.id}
                as="article"
                delay={Math.min(index, 10) * 45}
                hover
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
                      onClick={() => askDeleteFile(file)}
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
                      handleRenameFile(file);
                    }}
                  >
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
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
                title={t("folderDetail.emptyFilesTitle")}
                description={t("folderDetail.emptyFilesDesc")}
                action={
                  <button
                    type="button"
                    onClick={() => openUploadModal()}
                    className="icon-label h-12 rounded-2xl bg-cs-blue px-5 font-bold text-white"
                  >
                    <IconPlus className="size-5 shrink-0" />
                    <span>{t("folderDetail.uploadHere")}</span>
                  </button>
                }
              />
            ) : null}
          </div>
        </MotionBlock>

        <BottomNav
          activeId="folders"
          defaultFolderId={folderId}
          onUploadSuccess={refresh}
        />

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
