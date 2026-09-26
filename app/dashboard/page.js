"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import BottomNav from "../../components/BottomNav";
import EmptyState from "../../components/EmptyState";
import AdvancedSearchModal from "../../components/AdvancedSearchModal";
import AppBrand from "../../components/AppBrand";
import FilePreviewModal from "../../components/FilePreviewModal";
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
import { MotionBlock } from "../../components/PageMotion";
import PlansBanner from "../../components/PlansBanner";
import Reveal from "../../components/Reveal";
import SectionMoreLink from "../../components/SectionMoreLink";
import UserAvatar from "../../components/UserAvatar";
import { formatBytes, formatDate, formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { easeOut } from "../../lib/motion";
import { finishPageLoad } from "../../lib/pageLoading";
import { canPreviewFile } from "../../lib/preview";
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
  const [previewFile, setPreviewFile] = useState(null);
  const bootRef = useRef(true);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const startedAt = Date.now();
    const isBoot = bootRef.current;

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
      if (isBoot) {
        await finishPageLoad(startedAt);
        bootRef.current = false;
      }
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
        <header className="sticky top-0 z-30 flex items-center justify-center bg-[color-mix(in_srgb,var(--cs-surface)_90%,transparent)] px-5 pb-3 pt-6 backdrop-blur-md">
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

        <MotionBlock className="px-5 pt-5" delay={0.12}>
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
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cs-blue text-white shadow-sm shadow-cs-blue/25 transition hover:bg-cs-blue-deep"
              aria-label={t("dashboard.advancedSearch")}
              title={t("dashboard.advancedSearch")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
            >
              <IconFilters className="size-5" />
            </motion.button>

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
        </MotionBlock>

        <MotionBlock className="px-5 pt-5" delay={0.2} variant="scale" as="section">
          <motion.div
            className="storage-card rounded-[1.7rem] p-5 text-white"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
          >
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
              <motion.div
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.35 }}
              >
                <StorageRing
                  percent={storage.percent || 1}
                  usedLabel={t("dashboard.used")}
                  locale={locale}
                />
              </motion.div>
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(storage.percent, 2)}%` }}
                  transition={{ duration: 1.1, ease: easeOut, delay: 0.4 }}
                />
              </div>
              <p className="mt-2.5 text-xs leading-5 text-white/80">
                {formatBytes(storage.remaining, t, locale)}{" "}
                {t("dashboard.remaining")}
              </p>
            </div>
          </motion.div>
        </MotionBlock>

        <MotionBlock delay={0.28}>
          <PlansBanner className="px-5 pt-4" />
        </MotionBlock>

        <MotionBlock className="px-5 pt-7" delay={0.32} as="section">
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
                hover
                className="pressable rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line transition hover:ring-cs-blue/35"
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
        </MotionBlock>

        <MotionBlock className="px-5 pt-7" delay={0.4} as="section">
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
                  hover
                  className="pressable flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-right"
                  >
                    <div className="shrink-0">
                      <FileGlyph tone={fileTone(file.mimeType)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold leading-6 text-cs-ink">
                        {file.name}
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-5 text-cs-muted">
                        {formatDate(file.updatedAt || file.createdAt, locale)}
                        <span className="mx-2 text-cs-line">|</span>
                        {formatBytes(file.sizeBytes, t, locale)}
                        {canPreviewFile(file) ? (
                          <>
                            <span className="mx-2 text-cs-line">|</span>
                            <span className="text-cs-blue">{t("files.preview")}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </button>
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
        </MotionBlock>

        <BottomNav activeId="files" onUploadSuccess={refresh} />
        <AdvancedSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          initialQuery={query}
        />
        <FilePreviewModal
          open={Boolean(previewFile)}
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      </div>
    </main>
  );
}
