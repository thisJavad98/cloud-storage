"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "../../../components/BottomNav";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  FileGlyph,
  IconArrow,
  IconDownload,
  IconEdit,
  IconFolder,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUpload,
} from "../../../components/Icons";
import { getAccessToken, getStoredUser, saveSession } from "../../../lib/session";
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
  uploadFile,
} from "../../../services/files";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "۰ بایت";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت", "ترابایت"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${toPersianDigits(rounded)}\u00A0${units[unit]}`;
}

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function fileTone(mimeType = "", index = 0) {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return index % 2 === 0 ? "orange" : "blue";
}

export default function FolderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params?.id;
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [folder, setFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!folderId) return;

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

  async function handleUpload(event) {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    setUploading(true);
    try {
      await uploadFile(selected, { folderId });
      notifySuccess("فایل داخل پوشه آپلود شد");
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateSubfolder(event) {
    event.preventDefault();
    if (!folderName.trim()) {
      notifyWarning("نام پوشه را وارد کنید");
      return;
    }
    setBusyId("folder");
    try {
      await createFolder({ name: folderName.trim(), parentId: folderId });
      setFolderName("");
      setShowFolderForm(false);
      notifySuccess("زیرپوشه ساخته شد");
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
      notifyWarning("نام پوشه را وارد کنید");
      return;
    }
    setBusyId("rename-folder");
    try {
      await updateFolder(folderId, { name: folderRenameValue.trim() });
      setRenameFolderOpen(false);
      notifySuccess("نام پوشه تغییر کرد");
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setBusyId("");
    }
  }

  async function handleRenameFile(file) {
    if (!renameValue.trim()) {
      notifyWarning("نام جدید فایل را وارد کنید");
      return;
    }
    setBusyId(file.id);
    try {
      await updateFile(file.id, { name: renameValue.trim() });
      setRenameId("");
      setMenuId("");
      notifySuccess("نام فایل تغییر کرد");
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
      notifySuccess("دانلود آغاز شد");
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
      title: "انتقال به سطل زباله",
      message: `فایل «${file.name}» به سطل زباله منتقل شود؟`,
      confirmLabel: "بله، منتقل کن",
      tone: "warning",
    });
  }

  function askDeleteFile(file) {
    setConfirmAction({
      type: "delete-file",
      file,
      title: "حذف دائمی فایل",
      message: `فایل «${file.name}» برای همیشه حذف شود؟`,
      confirmLabel: "بله، حذف کن",
      tone: "danger",
    });
  }

  function askDeleteFolder() {
    setConfirmAction({
      type: "delete-folder",
      title: "حذف پوشه",
      message: `پوشه «${folder?.name}» و فایل‌های داخل آن به سطل زباله منتقل شوند؟`,
      confirmLabel: "بله، حذف کن",
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
        notifyInfo("فایل به سطل زباله منتقل شد");
      } else if (confirmAction.type === "delete-file") {
        setBusyId(confirmAction.file.id);
        await deleteFile(confirmAction.file.id);
        notifySuccess("فایل برای همیشه حذف شد");
      } else if (confirmAction.type === "delete-folder") {
        await deleteFolder(folderId);
        notifySuccess("پوشه حذف شد");
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
    return (
      <main className="flex min-h-dvh items-center justify-center dash-pattern text-sm text-cs-muted">
        در حال بارگذاری...
      </main>
    );
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-28">
        <header className="flex items-center justify-between gap-3 px-5 pt-6">
          <Link
            href="/folders"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label="بازگشت"
          >
            <IconArrow className="size-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-base font-extrabold leading-7 text-cs-ink">
              {folder.name}
            </h1>
            <p className="text-[11px] leading-5 text-cs-muted">
              {toPersianDigits(folder.fileCount ?? files.length)} فایل
            </p>
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cs-blue text-white shadow-sm disabled:opacity-70"
            aria-label="آپلود در پوشه"
          >
            <IconUpload className="size-5" />
          </button>
        </header>

        <section className="px-5 pt-5">
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
                  آپلود فایل‌ها داخل این پوشه
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
                <span>تغییر نام</span>
              </button>
              <button
                type="button"
                onClick={askDeleteFolder}
                className="icon-label justify-center rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                <IconTrash className="size-4 shrink-0" />
                <span>حذف پوشه</span>
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
                  ذخیره
                </button>
              </form>
            ) : null}
          </div>
        </section>

        <div className="px-5 pt-4">
          <label className="relative block">
            <span className="sr-only">جستجو</span>
            <span className="search-field-icon pointer-events-none absolute inset-y-0 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در این پوشه..."
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </div>

        <section className="px-5 pt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              زیرپوشه‌ها
            </h2>
            <button
              type="button"
              onClick={() => setShowFolderForm((v) => !v)}
              className="icon-label text-xs font-semibold text-cs-blue"
            >
              <IconPlus className="size-4 shrink-0" />
              <span>زیرپوشه</span>
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
                placeholder="نام زیرپوشه"
                className="h-11 min-w-0 flex-1 rounded-xl bg-[#f1f3f8] px-3 text-sm outline-none focus:ring-1 focus:ring-cs-blue/30"
              />
              <button
                type="submit"
                disabled={busyId === "folder"}
                className="h-11 shrink-0 rounded-xl bg-cs-blue px-4 text-sm font-bold text-white"
              >
                ساخت
              </button>
            </form>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            {subfolders.map((item) => (
              <Link
                key={item.id}
                href={`/folders/${item.id}`}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line transition hover:ring-cs-blue/30"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4d4]">
                  <IconFolder className="size-7 text-cs-folder" />
                </div>
                <h3 className="mt-3 truncate text-sm font-bold leading-6 text-cs-ink">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {toPersianDigits(item.fileCount ?? 0)} فایل
                </p>
              </Link>
            ))}
            {!subfolders.length ? (
              <div className="col-span-2 rounded-2xl bg-white px-4 py-5 text-center text-sm leading-7 text-cs-muted shadow-sm ring-1 ring-cs-line">
                زیرپوشه‌ای وجود ندارد
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold leading-7 text-cs-ink">
              فایل‌های پوشه
            </h2>
            <span className="text-xs leading-5 text-cs-muted">
              {toPersianDigits(filteredFiles.length)} مورد
            </span>
          </div>

          <div className="space-y-3">
            {filteredFiles.map((file, index) => (
              <article
                key={file.id}
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
                      {formatDate(file.updatedAt || file.createdAt)}
                      <span className="mx-2 text-cs-line">|</span>
                      {formatBytes(file.sizeBytes)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMenuId((current) => (current === file.id ? "" : file.id))
                    }
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-cs-muted"
                    aria-label="گزینه‌ها"
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
                      <span>دانلود</span>
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
                      <span>تغییر نام</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId === file.id}
                      onClick={() => askTrash(file)}
                      className="icon-label justify-center rounded-xl bg-[#fff4d4] px-3 py-2.5 text-xs font-semibold text-[#9a6b00]"
                    >
                      <IconTrash className="size-4 shrink-0" />
                      <span>سطل زباله</span>
                    </button>
                    <button
                      type="button"
                      disabled={busyId === file.id}
                      onClick={() => askDeleteFile(file)}
                      className="icon-label justify-center rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600"
                    >
                      <IconTrash className="size-4 shrink-0" />
                      <span>حذف دائم</span>
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
                      ذخیره
                    </button>
                  </form>
                ) : null}
              </article>
            ))}

            {!filteredFiles.length ? (
              <div className="rounded-2xl bg-white px-4 py-10 text-center shadow-sm ring-1 ring-cs-line">
                <p className="text-sm leading-7 text-cs-muted">
                  این پوشه خالی است
                </p>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="icon-label mx-auto mt-4 h-12 rounded-2xl bg-cs-blue px-5 font-bold text-white"
                >
                  <IconPlus className="size-5 shrink-0" />
                  <span>{uploading ? "در حال آپلود..." : "آپلود در پوشه"}</span>
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="icon-label fixed bottom-24 left-1/2 z-30 h-14 -translate-x-1/2 rounded-2xl bg-cs-blue px-5 font-bold text-white shadow-lg shadow-cs-blue/35 disabled:opacity-70"
        >
          <IconUpload className="size-5 shrink-0" />
          <span>{uploading ? "در حال آپلود..." : "آپلود در این پوشه"}</span>
        </button>

        <BottomNav activeId="manage" />

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
