"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import UploadModal from "./UploadModal";
import {
  IconFolder,
  IconFolders,
  IconPlus,
  IconUpload,
  IconUser,
} from "./Icons";
import { useI18n } from "../lib/i18n/I18nProvider";
import { easeOut } from "../lib/motion";

const leftItems = [
  { id: "files", href: "/dashboard", icon: IconFolder, labelKey: "nav.home" },
  { id: "manage", href: "/files", icon: IconUpload, labelKey: "nav.manage" },
];

const rightItems = [
  { id: "folders", href: "/folders", icon: IconFolders, labelKey: "nav.folders" },
  { id: "profile", href: "/profile", icon: IconUser, labelKey: "nav.profile" },
];

export default function BottomNav({
  activeId,
  defaultFolderId = null,
  onUploadSuccess,
  showUpload = true,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    function openUpload() {
      setUploadOpen(true);
    }
    window.addEventListener("cs:open-upload", openUpload);
    return () => window.removeEventListener("cs:open-upload", openUpload);
  }, []);

  function isActive(item) {
    if (activeId === item.id) return true;

    if (item.id === "folders") {
      if (activeId && activeId !== "folders") return false;
      return pathname === "/folders" || pathname.startsWith("/folders/");
    }
    if (item.id === "manage") {
      if (activeId && activeId !== "manage") return false;
      return pathname.startsWith("/files");
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

  function renderItem(item) {
    const Icon = item.icon;
    const active = isActive(item);
    return (
      <motion.button
        key={item.id}
        type="button"
        onClick={() => router.push(item.href)}
        className={`relative inline-flex size-11 items-center justify-center rounded-2xl transition ${
          active
            ? "text-white shadow-md shadow-cs-blue/25"
            : "text-cs-muted hover:bg-cs-blue-soft/60 hover:text-cs-blue"
        }`}
        aria-label={t(item.labelKey)}
        whileTap={reduce ? undefined : { scale: 0.9 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {active ? (
          reduce ? (
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-cs-blue" />
          ) : (
            <motion.span
              layoutId="nav-active-glow"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-cs-blue"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )
        ) : null}
        <span className="relative z-[1]">
          <Icon className="size-5 shrink-0" />
        </span>
      </motion.button>
    );
  }

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
        <motion.div
          className="pointer-events-auto relative w-full max-w-[390px]"
          initial={reduce ? false : { y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.15 }}
        >
          {showUpload ? (
            <div className="pointer-events-none absolute inset-x-0 -top-7 z-10 flex justify-center">
              <motion.button
                type="button"
                onClick={() => setUploadOpen(true)}
                aria-label={t("nav.uploadFile")}
                className="pointer-events-auto relative inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-[#f5a85a] to-cs-file-orange text-white shadow-[0_10px_24px_rgba(242,154,74,0.45)] ring-[6px] ring-[var(--cs-nav-ring)]"
                whileHover={reduce ? undefined : { scale: 1.06 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                animate={
                  reduce
                    ? undefined
                    : {
                        y: [0, -3, 0],
                        boxShadow: [
                          "0 10px 24px rgba(242,154,74,0.4)",
                          "0 14px 28px rgba(242,154,74,0.55)",
                          "0 10px 24px rgba(242,154,74,0.4)",
                        ],
                      }
                }
                transition={
                  reduce
                    ? undefined
                    : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <IconPlus className="size-7" />
                <span className="sr-only">{t("nav.upload")}</span>
              </motion.button>
            </div>
          ) : null}

          <div className="border-t border-cs-line/80 bg-white/92 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_rgba(21,32,56,0.06)] backdrop-blur-md">
            <div
              className={`grid items-center gap-1 ${
                showUpload ? "grid-cols-[1fr_3.5rem_1fr]" : "grid-cols-1"
              }`}
            >
              <div className="flex items-center justify-around">
                {leftItems.map(renderItem)}
              </div>

              {showUpload ? <div aria-hidden="true" className="h-11" /> : null}

              <div className="flex items-center justify-around">
                {rightItems.map(renderItem)}
              </div>
            </div>
          </div>
        </motion.div>
      </nav>

      {showUpload ? (
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          defaultFolderId={defaultFolderId}
          onSuccess={async () => {
            await onUploadSuccess?.();
          }}
        />
      ) : null}
    </>
  );
}
