"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import AppBrand from "../../components/AppBrand";
import {
  IconArrow,
  IconEdit,
  IconFolder,
  IconPlus,
  IconSearch,
  IconTrash,
} from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import Reveal from "../../components/Reveal";
import { formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { getAccessToken, getStoredUser, saveSession } from "../../lib/session";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../lib/toast";
import { getMe } from "../../services/auth";
import {
  createFolder,
  deleteFolder,
  formatFileError,
  listFolders,
  updateFolder,
} from "../../services/files";

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
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const [me, folderRows] = await Promise.all([getMe(), listFolders()]);
      saveSession({ user: me });
      setUser(me);
      setFolders(folderRows || []);
    } catch (err) {
      notifyError(formatFileError(err));
      if (err?.status === 401) router.replace("/login");
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
      await createFolder({ name: createName.trim() });
      setCreateName("");
      setShowCreate(false);
      notifySuccess(t("folders.created"));
      await refresh();
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
      await updateFolder(editId, { name: editName.trim() });
      setEditId("");
      setEditName("");
      notifySuccess(t("folders.renamed"));
      await refresh();
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
      }
      await refresh();
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
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-28">
        <header className="relative flex items-center justify-center px-5 pt-6">
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="absolute left-5 top-6 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cs-blue text-white shadow-sm"
            aria-label={t("folders.newFolder")}
          >
            <IconPlus className="size-5" />
          </button>
          <div className="min-w-0 px-12 text-center">
            <AppBrand size="sm" showLogo={false} className="justify-center" />
            <h1 className="mt-0.5 text-base font-extrabold leading-7 text-cs-ink">
              {t("folders.title")}
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
              placeholder={t("folders.searchPlaceholder")}
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </div>

        {showCreate ? (
          <section className="px-5 pt-4">
            <form
              onSubmit={handleCreate}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line"
            >
              <h2 className="mb-3 text-sm font-extrabold text-cs-ink">
                {t("folders.createTitle")}
              </h2>
              <div className="flex items-center gap-2">
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
            </form>
          </section>
        ) : null}

        <section className="px-5 pt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              {t("folders.allFolders")}
            </h2>
            <span className="text-xs leading-5 text-cs-muted">
              {formatDigits(filteredFolders.length, locale)} {t("common.items")}
            </span>
          </div>

          <div className="space-y-3">
            {filteredFolders.map((folder, index) => (
              <Reveal
                key={folder.id}
                as="article"
                delay={Math.min(index, 10) * 45}
                className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-cs-line"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`/folders/${folder.id}`}
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fff4d4]"
                    aria-label={t("folders.open", { name: folder.name })}
                  >
                    <IconFolder className="size-7 text-cs-folder" />
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
                      onClick={() => {
                        setEditId(folder.id);
                        setEditName(folder.name);
                        setShowCreate(false);
                      }}
                      className="inline-flex size-9 items-center justify-center rounded-xl bg-[#f1f3f8] text-cs-ink"
                      aria-label={t("folders.rename")}
                    >
                      <IconEdit className="size-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === folder.id}
                      onClick={() => askDelete(folder)}
                      className="inline-flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-500"
                      aria-label={t("folders.delete")}
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </div>

                {editId === folder.id ? (
                  <form
                    onSubmit={handleEdit}
                    className="mt-3 flex items-center gap-2 border-t border-cs-line pt-3"
                  >
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditId("");
                        setEditName("");
                      }}
                      className="h-11 shrink-0 rounded-xl bg-[#f1f3f8] px-3 text-sm font-semibold text-cs-muted"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={busyId === folder.id}
                      className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white disabled:opacity-70"
                    >
                      {t("common.save")}
                    </button>
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
        </section>

        <BottomNav activeId="folders" />

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
      </div>
    </main>
  );
}
