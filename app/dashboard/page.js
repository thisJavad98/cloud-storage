"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeNav, setActiveNav] = useState("files");

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

          <p className="justify-self-center text-sm font-extrabold tracking-[0.22em] text-cs-ink">
            LOGO
          </p>

          <div className="size-10 justify-self-end overflow-hidden rounded-full bg-gradient-to-br from-[#f7c59f] to-[#d9895b] shadow-sm ring-2 ring-white">
            <div className="flex h-full items-end justify-center">
              <div className="mb-0.5 size-6 rounded-full bg-[#5b3a2a]/30" />
            </div>
          </div>
        </header>

        <div className="px-5 pt-5">
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
                <p className="mt-1 text-sm text-white/75">۱,۲۰۰ فایل</p>
              </div>
              <StorageRing percent={70} />
            </div>

            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[70%] rounded-full bg-white" />
              </div>
              <p className="mt-2 text-xs text-white/80">
                ۲۷ GB در دسترس باقی مانده
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
              { id: "settings", icon: IconSettings, label: "تنظیمات" },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
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

      <Link href="/" className="sr-only">
        خروج
      </Link>
    </main>
  );
}
