"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FileGlyph,
  IconBell,
  IconDots,
  IconFolder,
  IconMenu,
  IconSearch,
  IconSettings,
  IconUser,
  StorageRing,
} from "../../components/Icons";
import { clearSession, getStoredUser } from "../../lib/session";

const folders = [
  { name: "پروژه", count: "۱۰۰ فایل" },
  { name: "پروژه", count: "۱۰۰ فایل" },
];

const recentFiles = [
  {
    name: "پروژه",
    meta: "۴ اردیبهشت | ۱۳:۵۴",
    size: "۱۲ MB",
    tone: "orange",
  },
  {
    name: "پروژه",
    meta: "۴ اردیبهشت | ۱۳:۵۴",
    size: "۱۲ MB",
    tone: "blue",
  },
];

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "۰ B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${toPersianDigits(rounded)} ${units[unit]}`;
}

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeNav, setActiveNav] = useState("files");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
  }, [router]);

  const storage = useMemo(() => {
    const used = Number(user?.storageUsedBytes ?? 0);
    const quota = Number(user?.storageQuotaBytes ?? 5 * 1024 * 1024 * 1024);
    const percent = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
    const remaining = Math.max(quota - used, 0);
    return { used, quota, percent, remaining };
  }, [user]);

  function handleNav(id) {
    if (id === "settings") {
      clearSession();
      router.push("/login");
      return;
    }
    setActiveNav(id);
  }

  if (!user) {
    return (
      <main className="flex min-h-dvh items-center justify-center dash-pattern text-sm text-cs-muted">
        در حال بارگذاری...
      </main>
    );
  }

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-24">
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
          <p className="mb-3 text-sm text-cs-muted">
            سلام،{" "}
            <span className="font-bold text-cs-ink">
              {user.fullName || user.email}
            </span>
          </p>
          <label className="relative block">
            <span className="sr-only">جستجو</span>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-cs-muted">
              <IconSearch />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="h-12 w-full rounded-2xl border-0 bg-white py-3 pe-12 ps-4 text-sm shadow-sm outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>
        </div>

        <section className="px-5 pt-5">
          <div className="rounded-[1.6rem] bg-cs-blue p-5 text-white shadow-[0_16px_40px_rgba(31,79,196,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <h2 className="text-lg font-extrabold">فضای ابری شما</h2>
                <p className="mt-1 text-sm text-white/75">
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
              <p className="mt-2 text-xs text-white/80">
                {formatBytes(storage.remaining)} در دسترس باقی مانده
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-cs-ink">فایل‌های من</h3>
            <button type="button" className="text-xs font-semibold text-cs-blue">
              بیشتر &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {folders.map((folder, index) => (
              <article
                key={`${folder.name}-${index}`}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cs-line"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[#fff4d4] text-cs-folder-dark">
                  <IconFolder className="size-7 text-cs-folder" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-cs-ink">
                  {folder.name}
                </h4>
                <p className="mt-1 text-xs text-cs-muted">{folder.count}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-cs-ink">
              آخرین فایل‌ها
            </h3>
            <button type="button" className="text-xs font-semibold text-cs-blue">
              بیشتر &gt;
            </button>
          </div>

          <div className="space-y-3">
            {recentFiles.map((file, index) => (
              <article
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-cs-line"
              >
                <FileGlyph tone={file.tone} />
                <div className="min-w-0 flex-1 text-right">
                  <h4 className="truncate text-sm font-bold text-cs-ink">
                    {file.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-cs-muted">
                    {file.meta}
                    <span className="mx-1.5 text-cs-line">|</span>
                    {file.size}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full text-cs-muted"
                  aria-label="گزینه‌ها"
                >
                  <IconDots />
                </button>
              </article>
            ))}
          </div>
        </section>

        <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[390px] -translate-x-1/2 border-t border-cs-line bg-white/95 px-6 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
            {[
              { id: "files", icon: IconFolder, label: "فایل‌ها" },
              { id: "profile", icon: IconUser, label: "پروفایل" },
              { id: "alerts", icon: IconBell, label: "اعلان‌ها" },
              { id: "settings", icon: IconSettings, label: "خروج" },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`inline-flex size-11 items-center justify-center rounded-2xl transition ${
                    active
                      ? "bg-cs-blue text-white shadow-md shadow-cs-blue/30"
                      : "text-cs-muted"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="size-5" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}
