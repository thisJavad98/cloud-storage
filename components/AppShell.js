"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import AppBrand from "./AppBrand";
import BottomNav from "./BottomNav";
import UploadModal from "./UploadModal";
import {
  IconFolder,
  IconFolders,
  IconIsland,
  IconPlus,
  IconUser,
} from "./Icons";
import { useI18n } from "../lib/i18n/I18nProvider";
import { easeOut } from "../lib/motion";

const NAV_ITEMS = [
  { id: "files", href: "/dashboard", icon: IconFolder, labelKey: "nav.home" },
  {
    id: "manage",
    href: "/data-island",
    icon: IconIsland,
    labelKey: "nav.dataIsland",
  },
  {
    id: "folders",
    href: "/folders",
    icon: IconFolders,
    labelKey: "nav.folders",
  },
  {
    id: "profile",
    href: "/profile",
    icon: IconUser,
    labelKey: "nav.profile",
  },
];

function isNavActive(item, activeId, pathname) {
  if (activeId === item.id) return true;

  if (item.id === "folders") {
    if (activeId && activeId !== "folders") return false;
    return pathname === "/folders" || pathname.startsWith("/folders/");
  }
  if (item.id === "manage") {
    if (activeId && activeId !== "manage") return false;
    return (
      pathname.startsWith("/data-island") || pathname.startsWith("/files")
    );
  }
  if (item.id === "files") {
    if (activeId && activeId !== "files") return false;
    return pathname === "/dashboard";
  }
  if (item.id === "profile") {
    if (activeId && activeId !== "profile") return false;
    return pathname === "/profile" || pathname.startsWith("/profile/");
  }
  return false;
}

/**
 * Product chrome: bottom nav on phone/tablet, quiet sidebar on desktop.
 * Design read: calm Leafnik-light SaaS shell — variance 5 / motion 5 / density 5.
 */
export default function AppShell({
  children,
  activeId,
  folders,
  defaultFolderId = null,
  onUploadSuccess,
  showUpload = true,
  pattern = "dash",
  contentClassName = "",
  immersive = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [uploadOpen, setUploadOpen] = useState(false);

  const closeUpload = useCallback(() => setUploadOpen(false), []);
  const handleUploadSuccess = useCallback(() => {
    onUploadSuccess?.();
  }, [onUploadSuccess]);

  useEffect(() => {
    function openUpload() {
      setUploadOpen(true);
    }
    window.addEventListener("cs:open-upload", openUpload);
    return () => window.removeEventListener("cs:open-upload", openUpload);
  }, []);

  const patternClass =
    pattern === "hex"
      ? "hex-pattern"
      : pattern === "none"
        ? ""
        : "dash-pattern";

  return (
    <div
      className={`app-desktop min-h-dvh ${patternClass} ${
        immersive ? "app-desktop--immersive" : ""
      }`}
    >
      <aside className="app-sidebar hidden lg:flex" aria-label={t("nav.home")}>
        <div className="flex h-full flex-col gap-6 p-5">
          <Link href="/dashboard" className="shrink-0 px-1 pt-1">
            <AppBrand size="sm" />
          </Link>

          {showUpload ? (
            <motion.button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#f5a85a] to-cs-file-orange px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(242,154,74,0.35)]"
              whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.25, ease: easeOut }}
            >
              <IconPlus className="size-5" />
              {t("nav.upload")}
            </motion.button>
          ) : null}

          <nav className="flex flex-1 flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item, activeId, pathname);
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition-colors ${
                    active
                      ? "bg-cs-blue text-white shadow-[0_10px_24px_rgba(232,120,42,0.28)]"
                      : "text-cs-muted hover:bg-white hover:text-cs-blue"
                  }`}
                  aria-current={active ? "page" : undefined}
                  whileHover={
                    reduce || active ? undefined : { x: -2, scale: 1.01 }
                  }
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="truncate">{t(item.labelKey)}</span>
                </motion.button>
              );
            })}
          </nav>

          <Link
            href="/plans"
            className="rounded-2xl bg-cs-blue-soft/70 px-3.5 py-3 text-[11px] font-bold leading-5 text-cs-blue transition hover:bg-cs-blue-soft"
          >
            {t("plans.pageTitle")}
          </Link>
        </div>
      </aside>

      <div
        className={`app-main flex min-h-dvh min-w-0 flex-col ${
          immersive ? "" : "pb-32 lg:pb-8"
        }`}
      >
        <div
          className={`app-content flex min-h-dvh w-full flex-col ${contentClassName}`}
        >
          {children}
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav
          activeId={activeId}
          defaultFolderId={defaultFolderId}
          onUploadSuccess={onUploadSuccess}
          showUpload={showUpload}
          folders={folders}
          onUploadClick={showUpload ? () => setUploadOpen(true) : null}
        />
      </div>

      {showUpload ? (
        <UploadModal
          open={uploadOpen}
          onClose={closeUpload}
          defaultFolderId={defaultFolderId}
          folders={folders}
          onSuccess={handleUploadSuccess}
        />
      ) : null}
    </div>
  );
}
