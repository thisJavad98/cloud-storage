"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "../../components/BottomNav";
import EmptyState from "../../components/EmptyState";
import AdvancedSearchModal from "../../components/AdvancedSearchModal";
import AppBrand from "../../components/AppBrand";
import {
  FileGlyph,
  IconClose,
  IconDots,
  IconFilters,
  IconFolder,
  IconMenu,
  IconSearch,
  StorageRing,
} from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import PlansBanner from "../../components/PlansBanner";
import Reveal from "../../components/Reveal";
import SectionMoreLink from "../../components/SectionMoreLink";
import UserAvatar from "../../components/UserAvatar";
import { formatBytes, formatDate, formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { getAccessToken, getStoredUser, saveSession } from "../../lib/session";
import { notifyError } from "../../lib/toast";
import { getMe } from "../../services/auth";
import { formatFileError, listFiles, listFolders } from "../../services/files";

function fileTone(mimeType = "") {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return "orange";
}

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale, brandName } = useI18n();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
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

  const filteredFolders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter((folder) => folder.name.toLowerCase().includes(q));
  }, [folders, query]);

  if (!user || loading) {
    return <PageLoader />;
  }

  const visibleFolders = filteredFolders.slice(0, 4);

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-32">
        <header className="relative flex items-center justify-center px-5 pt-6">
          <Link
            href="/profile"
            className="absolute left-5 top-6"
            aria-label={t("dashboard.menu")}
            title={user.fullName || user.email}
          >
            <UserAvatar user={user} />
          </Link>

          <div>
            <AppBrand size="sm" stacked />
          </div>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="absolute right-5 top-6 inline-flex size-10 items-center justify-center rounded-full bg-white text-cs-ink shadow-sm ring-1 ring-cs-line"
            aria-label={t("dashboard.menu")}
          >
            <IconMenu className="size-5" />
          </button>
        </header>

        <div className="px-5 pt-5">
          <p className="mb-3 text-sm leading-7 text-cs-muted">
            {t("dashboard.hello")}{" "}
            <span className="font-bold text-cs-ink">
              {user.fullName || user.email}
            </span>
          </p>
          {user.bio ? (
            <p className="mb-3 line-clamp-2 text-xs leading-6 text-cs-muted">
              {user.bio}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cs-blue text-white shadow-sm shadow-cs-blue/25 transition hover:bg-cs-blue-deep"
              aria-label={t("dashboard.advancedSearch")}
              title={t("dashboard.advancedSearch")}
            >
              <IconFilters className="size-5" />
            </button>

            <label className="search-shell relative block min-w-0 flex-1">
              <span className="sr-only">{t("common.search")}</span>
              <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-cs-muted">
                <IconSearch className="size-5" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchOpen(true);
                  }
                }}
                placeholder={t("dashboard.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border-0 bg-white py-3 pe-11 ps-11 text-sm text-cs-ink shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted transition focus:ring-2 focus:ring-cs-blue/25"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 end-2 my-auto inline-flex size-8 items-center justify-center rounded-full text-cs-muted hover:bg-cs-surface"
                  aria-label={t("dashboard.clearSearch")}
                >
                  <IconClose className="size-3.5" />
                </button>
              ) : null}
            </label>
          </div>
          {query.trim() ? (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="mt-2 text-[11px] font-bold text-cs-blue"
            >
              {t("dashboard.advancedSearch")}
            </button>
          ) : null}
        </div>

        <section className="animate-fade-up px-5 pt-5">
          <div className="rounded-[1.6rem] bg-cs-blue p-5 text-white shadow-[0_16px_40px_rgba(31,79,196,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 text-right">
                <h2 className="text-lg font-extrabold leading-8">
                  {t("dashboard.storageTitle", { name: brandName })}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-white/75">
                  {formatBytes(storage.used, t, locale)} {t("dashboard.of")}{" "}
                  {formatBytes(storage.quota, t, locale)}
                </p>
              </div>
              <StorageRing
                percent={storage.percent || 1}
                usedLabel={t("dashboard.used")}
                locale={locale}
              />
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${Math.max(storage.percent, 2)}%` }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-5 text-white/80">
                {formatBytes(storage.remaining, t, locale)}{" "}
                {t("dashboard.remaining")}
              </p>
            </div>
          </div>
        </section>

        <PlansBanner className="px-5 pt-4" />

        <section className="px-5 pt-7">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-7 text-cs-ink">
                {t("dashboard.myFolders")}
              </h3>
              {folders.length ? (
                <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                  {t("dashboard.folderCount", {
                    count: formatDigits(
                      query.trim() ? filteredFolders.length : folders.length,
                      locale
                    ),
                  })}
                </p>
              ) : null}
            </div>
            <SectionMoreLink
              href="/folders"
              count={folders.length > 4 ? folders.length : undefined}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(visibleFolders.length ? visibleFolders : []).map((folder, index) => (
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
                  {formatDigits(folder.fileCount ?? 0, locale)} {t("common.file")}
                </p>
              </Reveal>
            ))}
            {!folders.length ? (
              <div className="col-span-2">
                <EmptyState
                  variant="folders"
                  compact
                  title={t("dashboard.emptyFoldersTitle")}
                  description={t("dashboard.emptyFoldersDesc")}
                />
              </div>
            ) : !visibleFolders.length ? (
              <div className="col-span-2 rounded-2xl bg-white px-4 py-6 text-center text-sm text-cs-muted shadow-sm ring-1 ring-cs-line">
                {t("advancedSearch.empty")}
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-7 text-cs-ink">
                {t("dashboard.recentFiles")}
              </h3>
              {files.length ? (
                <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                  {t("dashboard.recentCount", {
                    count: formatDigits(
                      Math.min(filteredFiles.length, 8),
                      locale
                    ),
                  })}
                </p>
              ) : null}
            </div>
            <SectionMoreLink
              href="/files"
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
                      {formatDate(file.updatedAt || file.createdAt, locale)}
                      <span className="mx-2 text-cs-line">|</span>
                      {formatBytes(file.sizeBytes, t, locale)}
                    </p>
                  </div>
                  <Link
                    href="/files"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-cs-muted"
                    aria-label={t("common.options")}
                  >
                    <IconDots />
                  </Link>
                </Reveal>
              ))
            ) : (
              <EmptyState
                variant="files"
                compact
                title={t("dashboard.emptyFilesTitle")}
                description={t("dashboard.emptyFilesDesc")}
              />
            )}
          </div>
        </section>

        <BottomNav activeId="files" onUploadSuccess={refresh} />
        <AdvancedSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          initialQuery={query}
        />
      </div>
    </main>
  );
}
