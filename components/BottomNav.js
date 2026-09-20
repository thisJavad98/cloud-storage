"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import UploadModal from "./UploadModal";
import {
  IconFolder,
  IconFolders,
  IconLogout,
  IconPlus,
  IconUpload,
} from "./Icons";
import { clearSession } from "../lib/session";
import { notifyInfo } from "../lib/toast";

const leftItems = [
  { id: "files", href: "/dashboard", icon: IconFolder, label: "خانه" },
  { id: "manage", href: "/files", icon: IconUpload, label: "مدیریت" },
];

const rightItems = [
  { id: "folders", href: "/folders", icon: IconFolders, label: "پوشه‌ها" },
  { id: "logout", href: "/login", icon: IconLogout, label: "خروج", logout: true },
];

export default function BottomNav({
  activeId,
  defaultFolderId = null,
  onUploadSuccess,
  showUpload = true,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    function openUpload() {
      setUploadOpen(true);
    }
    window.addEventListener("cs:open-upload", openUpload);
    return () => window.removeEventListener("cs:open-upload", openUpload);
  }, []);

  function handleClick(item) {
    if (item.logout) {
      setLogoutOpen(true);
      return;
    }
    router.push(item.href);
  }

  function confirmLogout() {
    setLoggingOut(true);
    clearSession();
    notifyInfo("با موفقیت خارج شدید");
    setLogoutOpen(false);
    setLoggingOut(false);
    router.push("/login");
  }

  function isActive(item) {
    if (item.logout) return false;
    if (activeId === item.id) return true;

    // Prefer explicit activeId when provided for folder detail vs list
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
    return false;
  }

  function renderItem(item) {
    const Icon = item.icon;
    const active = isActive(item);
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleClick(item)}
        className={`inline-flex size-11 items-center justify-center rounded-2xl transition ${
          active
            ? "bg-cs-blue text-white shadow-md shadow-cs-blue/25"
            : item.logout
              ? "text-red-500"
              : "text-cs-muted hover:bg-cs-blue-soft/60 hover:text-cs-blue"
        }`}
        aria-label={item.label}
      >
        <Icon className="size-5 shrink-0" />
      </button>
    );
  }

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
        <div className="pointer-events-auto relative w-full max-w-[390px]">
          {/* Elevated upload FAB */}
          {showUpload ? (
            <div className="pointer-events-none absolute inset-x-0 -top-7 z-10 flex justify-center">
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                aria-label="آپلود فایل"
                className="pointer-events-auto relative inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-[#f5a85a] to-cs-file-orange text-white shadow-[0_10px_24px_rgba(242,154,74,0.45)] ring-[6px] ring-[#f3f5fa] transition hover:from-cs-file-orange hover:to-[#e8893a] active:scale-95"
              >
                <IconPlus className="size-7" />
                <span className="sr-only">آپلود</span>
              </button>
            </div>
          ) : null}

          <div className="border-t border-cs-line bg-white/95 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
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
        </div>
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

      <ConfirmModal
        open={logoutOpen}
        title="خروج از حساب"
        message="آیا می‌خواهید از حساب کاربری خارج شوید؟"
        confirmLabel="بله، خارج شو"
        cancelLabel="انصراف"
        tone="primary"
        loading={loggingOut}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={confirmLogout}
      />
    </>
  );
}



