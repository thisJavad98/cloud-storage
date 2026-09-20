"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "../../components/BottomNav";
import {
  FileGlyph,
  IconDots,
  IconFolder,
  IconMenu,
  IconPlus,
  IconSearch,
  StorageRing,
} from "../../components/Icons";
import { getAccessToken, getStoredUser, saveSession } from "../../lib/session";
import { notifyError, notifySuccess } from "../../lib/toast";
import { getMe } from "../../services/auth";
import {
  formatFileError,
  listFiles,
  listFolders,
  uploadFile,
} from "../../services/files";

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

function fileTone(mimeType = "") {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return "orange";
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
        listFiles({ limit: 20 }),
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

  const storage = useMemo(() => {
    const used = Number(user?.storageUsedBytes ?? 0);
    const quota = Number(user?.storageQuotaBytes ?? 5 * 1024 * 1024 * 1024);
    const percent = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
    const remaining = Math.max(quota - used, 0);
    return { used, quota, percent, remaining };
  }, [user]);

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
      await uploadFile(selected);
      notifySuccess("فایل با موفقیت آپلود شد");
      await refresh();
    } catch (err) {
      notifyError(formatFileError(err));
    } finally {
      setUploading(false);
    }
  }

  if (!user || loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center dash-pattern text-sm text-cs-muted">
        در حال بارگذاری...
      </main>
    );
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-28">
        <header className="relative grid grid-cols-3 items-center px-5 pt-6">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center justify-self-start rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label="منو"
          >
            <IconMenu className="size-5" />
          </button>

          <div className="justify-self-center">
            <img
              src="/icon.png"
              alt="فضای ابری"
              width={36}
              height={36}
              className="size-9 rounded-xl shadow-sm"
            />
          </div>

          <div
            className="size-10 justify-self-end overflow-hidden rounded-full bg-gradient-to-br from-[#f7c59f] to-[#d9895b] shadow-sm ring-2 ring-white"
            title={user.fullName || user.email}
          >
            <div className="flex h-full items-end justify-center">
              <div className="mb-0.5 size-6 rounded-full bg-[#5b3a2a]/30" />
            </div>
          </div>
        </header>

        <div className="px-5 pt-5">
          <p className="mb-3 text-sm leading-7 text-cs-muted">
            سلام،{" "}
            <span className="font-bold text-cs-ink">
              {user.fullName || user.email}
            </span>
          </p>
          <label className="relative block">
            <span className="sr-only">جستجو</span>
            <span className="search-field-icon pointer-events-none absolute inset-y-0 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="search-field h-12 w-full rounded-2xl border-0 bg-white py-3 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </div>

        <section className="px-5 pt-5">
          <div className="rounded-[1.6rem] bg-cs-blue p-5 text-white shadow-[0_16px_40px_rgba(31,79,196,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 text-right">
                <h2 className="text-lg font-extrabold leading-8">فضای ابری شما</h2>
                <p className="mt-1.5 text-sm leading-6 text-white/75">
                  {formatBytes(storage.used)} از {formatBytes(storage.quota)}
                </p>
              </div>
              <StorageRing percent={storage.percent || 1} />
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${Math.max(storage.percent, 2)}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-5 text-white/80">
                {formatBytes(storage.remaining)} در دسترس باقی مانده
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold leading-7 text-cs-ink">
              پوشه‌های من
            </h3>
            <Link
              href="/files"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold leading-5 text-cs-blue"
            >
              <span>بیشتر</span>
              <span aria-hidden="true">‹</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(folders.length ? folders.slice(0, 4) : []).map((folder) => (
              <article
                key={folder.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4d4] text-cs-folder-dark">
                  <IconFolder className="size-7 text-cs-folder" />
                </div>
                <h4 className="mt-3 truncate text-sm font-bold leading-6 text-cs-ink">
                  {folder.name}
                </h4>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {toPersianDigits(folder.fileCount ?? 0)} فایل
                </p>
              </article>
            ))}
            {!folders.length ? (
              <article className="col-span-2 rounded-2xl bg-white p-4 text-center text-sm leading-7 text-cs-muted shadow-sm ring-1 ring-cs-line">
                هنوز پوشه‌ای ندارید
              </article>
            ) : null}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold leading-7 text-cs-ink">
              آخرین فایل‌ها
            </h3>
            <Link
              href="/files"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold leading-5 text-cs-blue"
            >
              <span>بیشتر</span>
              <span aria-hidden="true">‹</span>
            </Link>
          </div>

          <div className="space-y-3">
            {filteredFiles.length ? (
              filteredFiles.slice(0, 8).map((file) => (
                <article
                  key={file.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-cs-line"
                >
                  <div className="shrink-0">
                    <FileGlyph tone={fileTone(file.mimeType)} />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <h4 className="truncate text-sm font-bold leading-6 text-cs-ink">
                      {file.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                      {formatDate(file.updatedAt || file.createdAt)}
                      <span className="mx-2 text-cs-line">|</span>
                      {formatBytes(file.sizeBytes)}
                    </p>
                  </div>
                  <Link
                    href="/files"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-cs-muted"
                    aria-label="گزینه‌ها"
                  >
                    <IconDots />
                  </Link>
                </article>
              ))
            ) : (
              <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm leading-7 text-cs-muted shadow-sm ring-1 ring-cs-line">
                فایلی پیدا نشد. با دکمه + یک فایل آپلود کنید.
              </div>
            )}
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
          <IconPlus className="size-5 shrink-0" />
          <span>{uploading ? "در حال آپلود..." : "آپلود فایل"}</span>
        </button>

        <BottomNav activeId="files" />
      </div>
    </main>
  );
}
