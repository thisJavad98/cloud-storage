"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppShell from "../../components/AppShell";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import AppBrand from "../../components/AppBrand";
import FolderIcon from "../../components/FolderIcon";
import FolderIconPicker from "../../components/FolderIconPicker";
import {
  IconArrow,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import { MotionBlock, MotionHeader } from "../../components/PageMotion";
import Reveal from "../../components/Reveal";
import { DEFAULT_FOLDER_ICON, normalizeFolderIconId } from "../../lib/folderIcons";
import { formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { finishPageLoad } from "../../lib/pageLoading";
import { getStoredUser, hasSession } from "../../lib/session";
import { useLiveUser } from "../../lib/useLiveUser";
import { useLibrarySync } from "../../lib/useLibrarySync";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../lib/toast";
import {
  createFolder,
  deleteFolder,
  formatFileError,
  listFolders,
  updateFolder,
} from "../../services/files";
import { AnimatePresence, motion } from "motion/react";

export default function FoldersManagePage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createIcon, setCreateIcon] = useState(DEFAULT_FOLDER_ICON);
  const [editId, setEditId] = useState("");
  useLiveUser(setUser);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState(DEFAULT_FOLDER_ICON);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const bootRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!hasSession()) {
      router.replace("/login");
      return;
    }

    const startedAt = Date.now();
    const isBoot = bootRef.current;

    try {
      const folderRows = await listFolders();
      const stored = getStoredUser();
      if (stored) setUser(stored);
      setFolders(folderRows || []);
    } catch (err) {
      notifyError(formatFileError(err));
      if (err?.status === 401) router.replace("/login");
    } finally {
      if (isBoot) {
        await finishPageLoad(startedAt);
        bootRef.current = false;
      }
      setLoading(false);
    }
  }, [router]);

  useLibrarySync(refresh);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
    refresh();
  }, [router, refresh]);

  const filteredFolders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter((folder) => folder.name.toLowerCase().includes(q));
  }, [folders, query]);

  async function handleCreate(event) {
    event.preventDefault();
    if (!createName.trim()) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }

    setBusyId("create");
    try {
      await createFolder({
        name: createName.trim(),
        icon: createIcon,
      });
      setCreateName("");
      setCreateIcon(DEFAULT_FOLDER_ICON);
      setShowCreate(false);
      notifySuccess(t("folders.created"));
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  async function handleEdit(event) {
    event.preventDefault();
    if (!editId) return;
    if (!editName.trim()) {
      notifyWarning(t("folders.namePlaceholder"));
      return;
    }

    setBusyId(editId);
    try {
      await updateFolder(editId, {
        name: editName.trim(),
        icon: editIcon,
      });
      setEditId("");
      setEditName("");
      setEditIcon(DEFAULT_FOLDER_ICON);
      notifySuccess(t("folders.renamed"));
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  function askDelete(folder) {
    setConfirmAction({
      folder,
      title: t("folders.deleteTitle"),
      message: t("folders.deleteMessage"),
      confirmLabel: t("folders.deleteConfirm"),
    });
  }

  async function runDelete() {
    if (!confirmAction?.folder) return;
    setConfirmLoading(true);
    setBusyId(confirmAction.folder.id);
    try {
      await deleteFolder(confirmAction.folder.id);
      notifySuccess(t("folders.deleted"));
      setConfirmAction(null);
      if (editId === confirmAction.folder.id) {
        setEditId("");
        setEditName("");
        setEditIcon(DEFAULT_FOLDER_ICON);
      }
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
      setConfirmLoading(false);
    }
  }

  if (!user || loading) {
    return <PageLoader />;
  }

  return (
    <AppShell activeId="folders" folders={folders}>
        <MotionHeader className="flex items-center justify-center px-5 pt-6 lg:justify-between lg:px-6">
          <motion.button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="absolute left-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cs-blue text-white shadow-sm lg:static lg:left-auto lg:top-auto"
            aria-label={t("folders.newFolder")}
            whileHover={{ scale: 1.06, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <IconPlus className="size-5" />
          </motion.button>
          <div className="min-w-0 px-12 text-center lg:px-0 lg:text-start">
            <div className="app-header-brand">
              <AppBrand size="sm" showLogo={false} className="justify-center lg:justify-start" />
            </div>
            <h1 className="mt-0.5 text-base font-extrabold leading-7 text-cs-ink lg:text-xl">
              {t("folders.title")}
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="absolute right-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-cs-ink shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line lg:static lg:right-auto lg:top-auto"
            aria-label={t("common.back")}
          >
            <IconArrow className="size-5 rotate-180" />
          </Link>
        </MotionHeader>

        <MotionBlock className="px-5 pt-5" delay={0.1}>
          <label className="relative block">
            <span className="sr-only">{t("common.search")}</span>
            <span className="search-field-icon pointer-events-none absolute inset-y-0 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("folders.searchPlaceholder")}
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </MotionBlock>

        <AnimatePresence initial={false}>
          {showCreate ? (
            <motion.section
              key="create-folder"
              className="px-5 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <form
                onSubmit={handleCreate}
                className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line"
              >
                <h2 className="mb-3 text-sm font-extrabold text-cs-ink">
                  {t("folders.createTitle")}
                </h2>
                <div className="flex items-center gap-2">
                  <FolderIcon icon={createIcon} size="sm" />
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder={t("folders.namePlaceholder")}
                    autoFocus
                    className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
                  />
                  <button
                    type="submit"
                    disabled={busyId === "create"}
                    className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white disabled:opacity-70"
                  >
                    {busyId === "create" ? t("folders.creating") : t("folders.create")}
                  </button>
                </div>
                <FolderIconPicker
                  className="mt-3"
                  value={createIcon}
                  onChange={setCreateIcon}
                  disabled={busyId === "create"}
                />
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <MotionBlock className="px-5 pt-6" delay={0.18} as="section">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("folders.allFolders")}
            </h2>
            <span className="text-xs leading-5 text-cs-muted">
              {formatDigits(filteredFolders.length, locale)} {t("common.items")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {filteredFolders.map((folder, index) => (
              <Reveal
                key={folder.id}
                as="article"
                delay={Math.min(index, 10) * 45}
                hover
                className="rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line transition hover:-translate-y-0.5 hover:ring-cs-blue/30"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`/folders/${folder.id}`}
                    aria-label={t("folders.open", { name: folder.name })}
                  >
                    <FolderIcon icon={folder.icon} />
                  </Link>

                  <Link
                    href={`/folders/${folder.id}`}
                    className="min-w-0 flex-1 text-right"
                  >
                    <h3 className="truncate text-sm font-bold leading-6 text-cs-ink">
                      {folder.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                      {formatDigits(folder.fileCount ?? 0, locale)}{" "}
                      {t("common.file")}
                    </p>
                  </Link>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      disabled={busyId === folder.id}
                      onClick={() => {
                        setEditId(folder.id);
                        setEditName(folder.name);
                        setEditIcon(normalizeFolderIconId(folder.icon));
                        setShowCreate(false);
                      }}
                      className="inline-flex size-9 items-center justify-center rounded-xl bg-[#f1f3f8] text-cs-ink disabled:opacity-60"
                      aria-label={t("folders.rename")}
                    >
                      {busyId === folder.id && editId === folder.id ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-cs-muted/30 border-t-cs-ink" />
                      ) : (
                        <IconEdit className="size-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === folder.id}
                      onClick={() => askDelete(folder)}
                      className="inline-flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-500 disabled:opacity-60"
                      aria-label={t("folders.delete")}
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </div>

                {editId === folder.id ? (
                  <form
                    onSubmit={handleEdit}
                    className="mt-3 space-y-3 border-t border-cs-line pt-3"
                  >
                    <div className="flex items-center gap-2">
                      <FolderIcon icon={editIcon} size="sm" />
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={busyId === folder.id}
                        className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30 disabled:opacity-70"
                        autoFocus
                      />
                    </div>
                    <FolderIconPicker
                      value={editIcon}
                      onChange={setEditIcon}
                      disabled={busyId === folder.id}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busyId === folder.id}
                        onClick={() => {
                          setEditId("");
                          setEditName("");
                          setEditIcon(DEFAULT_FOLDER_ICON);
                        }}
                        className="h-11 shrink-0 rounded-xl bg-[#f1f3f8] px-3 text-sm font-semibold text-cs-muted disabled:opacity-60"
                      >
                        {t("common.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={busyId === folder.id || !editName.trim()}
                        className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white disabled:opacity-70"
                      >
                        {busyId === folder.id ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>{t("common.saving")}</span>
                          </>
                        ) : (
                          t("common.save")
                        )}
                      </button>
                    </div>
                  </form>
                ) : null}
              </Reveal>
            ))}

            {!filteredFolders.length ? (
              <EmptyState
                variant="folders"
                title={t("folders.emptyTitle")}
                description={t("folders.emptyDesc")}
                action={
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="icon-label h-12 rounded-2xl bg-cs-blue px-5 font-bold text-white"
                  >
                    <IconPlus className="size-5 shrink-0" />
                    <span>{t("folders.createFirst")}</span>
                  </button>
                }
              />
            ) : null}
          </div>
        </MotionBlock>

        <ConfirmModal
          open={Boolean(confirmAction)}
          title={confirmAction?.title}
          message={confirmAction?.message}
          confirmLabel={confirmAction?.confirmLabel}
          tone="danger"
          loading={confirmLoading}
          onCancel={() => {
            if (!confirmLoading) setConfirmAction(null);
          }}
          onConfirm={runDelete}
        />
    </AppShell>
  );
}
