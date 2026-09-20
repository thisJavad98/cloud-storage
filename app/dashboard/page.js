"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import EmptyState from "../../components/EmptyState";
import {
  FileGlyph,
  IconDots,
  IconFolder,
  IconMenu,
  IconSearch,
  StorageRing,
} from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import Reveal from "../../components/Reveal";
import SectionMoreLink from "../../components/SectionMoreLink";
import UserAvatar from "../../components/UserAvatar";
import { getAccessToken, getStoredUser, saveSession } from "../../lib/session";
import { notifyError } from "../../lib/toast";
import { getMe } from "../../services/auth";
import { formatFileError, listFiles, listFolders } from "../../services/files";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "۰ بایت";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت", "ترابایت"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded =
    value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1);
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
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const percent =
      quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
    const remaining = Math.max(quota - used, 0);
    return { used, quota, percent, remaining };
  }, [user]);

  const filteredFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((file) => file.name.toLowerCase().includes(q));
  }, [files, query]);

  if (!user || loading) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-32">
        <header className="relative grid grid-cols-3 items-center px-5 pt-6">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="inline-flex size-10 items-center justify-center justify-self-start rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label="پروفایل"
          >
            <IconMenu className="size-5" />
          </button>

          <div className="justify-self-center">
            <img src="/icon.png" alt="فضای ابری" width={44} height={44} />
          </div>

          <Link
            href="/profile"
            className="justify-self-end"
            aria-label="پروفایل"
            title={user.fullName || user.email}
          >
            <UserAvatar user={user} />
          </Link>
        </header>

        <div className="px-5 pt-5">
          <p className="mb-3 text-sm leading-7 text-cs-muted">
            سلام،{" "}
            <span className="font-bold text-cs-ink">
              {user.fullName || user.email}
            </span>
          </p>
          {user.bio ? (
            <p className="mb-3 line-clamp-2 text-xs leading-6 text-cs-muted">
              {user.bio}
            </p>
          ) : null}
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

        <section className="animate-fade-up px-5 pt-5">
          <div className="rounded-[1.6rem] bg-cs-blue p-5 text-white shadow-[0_16px_40px_rgba(31,79,196,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 text-right">
                <h2 className="text-lg font-extrabold leading-8">
                  فضای ابری شما
                </h2>
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
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-7 text-cs-ink">
                پوشه‌های من
              </h3>
              {folders.length ? (
                <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                  {toPersianDigits(folders.length)} پوشه
                </p>
              ) : null}
            </div>
            <SectionMoreLink
              href="/folders"
              label="مشاهده همه"
              count={folders.length > 4 ? folders.length : undefined}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(folders.length ? folders.slice(0, 4) : []).map((folder, index) => (
              <Reveal
                key={folder.id}
                as={Link}
                href={`/folders/${folder.id}`}
                delay={index * 60}
                className="pressable rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line transition hover:ring-cs-blue/30"
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
              </Reveal>
            ))}
            {!folders.length ? (
              <div className="col-span-2">
                <EmptyState
                  variant="folders"
                  compact
                  title="هنوز پوشه‌ای ندارید"
                  description="از بخش پوشه‌ها یک پوشه جدید بسازید"
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-7 text-cs-ink">
                آخرین فایل‌ها
              </h3>
              {files.length ? (
                <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                  {toPersianDigits(Math.min(filteredFiles.length, 8))} مورد اخیر
                </p>
              ) : null}
            </div>
            <SectionMoreLink
              href="/files"
              label="مشاهده همه"
              count={files.length > 8 ? files.length : undefined}
            />
          </div>

          <div className="space-y-3">
            {filteredFiles.length ? (
              filteredFiles.slice(0, 8).map((file, index) => (
                <Reveal
                  key={file.id}
                  as="article"
                  delay={index * 55}
                  className="pressable flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-cs-line"
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
                </Reveal>
              ))
            ) : (
              <EmptyState
                variant="files"
                compact
                title="فایلی پیدا نشد"
                description="از دکمه آپلود پایین صفحه استفاده کنید"
              />
            )}
          </div>
        </section>

        <BottomNav activeId="files" onUploadSuccess={refresh} />
      </div>
    </main>
  );
}
