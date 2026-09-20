"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
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
  onUpload,
  uploading = false,
  uploadLabel = "آپلود فایل",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const showUpload = typeof onUpload === "function";

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
    if (item.id === "folders" && pathname.startsWith("/folders")) return true;
    if (item.id === "manage" && pathname.startsWith("/files")) return true;
    if (item.id === "files" && pathname === "/dashboard") return true;
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
        className={`inline-flex size-11 flex-col items-center justify-center rounded-2xl transition ${
          active
            ? "bg-cs-blue text-white shadow-md shadow-cs-blue/30"
            : item.logout
              ? "text-red-500"
              : "text-cs-muted"
        }`}
        aria-label={item.label}
      >
        <Icon className="size-5 shrink-0" />
      </button>
    );
  }

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2">
        <div className="relative border-t border-cs-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          {showUpload ? (
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
              <div className="flex items-center justify-around gap-1">
                {leftItems.map(renderItem)}
              </div>

              <div className="relative -mt-8 flex w-[4.5rem] justify-center">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={onUpload}
                  aria-label={uploadLabel}
                  title={uploadLabel}
                  className="inline-flex size-[3.65rem] items-center justify-center rounded-[1.35rem] bg-cs-blue text-white shadow-[0_12px_28px_rgba(31,79,196,0.42)] ring-4 ring-[#f3f5fa] transition hover:bg-cs-blue-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {uploading ? (
                    <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <IconPlus className="size-7" />
                  )}
                </button>
                <span className="pointer-events-none absolute -bottom-5 whitespace-nowrap text-[10px] font-semibold text-cs-muted">
                  {uploading ? "آپلود..." : "آپلود"}
                </span>
              </div>

              <div className="flex items-center justify-around gap-1">
                {rightItems.map(renderItem)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 px-1">
              {[...leftItems, ...rightItems].map(renderItem)}
            </div>
          )}

          {showUpload ? <div className="h-4" aria-hidden="true" /> : null}
        </div>
      </nav>

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
