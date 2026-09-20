"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import { IconFolder, IconFolders, IconLogout, IconUpload } from "./Icons";
import { clearSession } from "../lib/session";
import { notifyInfo } from "../lib/toast";

const items = [
  { id: "files", href: "/dashboard", icon: IconFolder, label: "فایل‌ها" },
  { id: "manage", href: "/files", icon: IconUpload, label: "مدیریت" },
  { id: "folders", href: "/folders", icon: IconFolders, label: "پوشه‌ها" },
  { id: "logout", href: "/login", icon: IconLogout, label: "خروج", logout: true },
];

export default function BottomNav({ activeId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    if (
      item.id === "files" &&
      pathname === "/dashboard"
    ) {
      return true;
    }
    return false;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[390px] -translate-x-1/2 border-t border-cs-line bg-white/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item)}
                className={`inline-flex size-11 items-center justify-center rounded-2xl transition ${
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
          })}
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
