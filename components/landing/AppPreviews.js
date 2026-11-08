"use client";

import { CloudArrowUp, FolderSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { StorageRing } from "../Icons";

const foldersFa = [
  { name: "اسناد کاری", count: "۱۲" },
  { name: "عکس‌های سفر", count: "۴۸" },
  { name: "قراردادها", count: "۷" },
];

const foldersEn = [
  { name: "Work docs", count: "12" },
  { name: "Travel photos", count: "48" },
  { name: "Contracts", count: "7" },
];

const filesFa = [
  { name: "گزارش_ماهانه.pdf", meta: "۲.۴ مگابایت", tone: "blue" },
  { name: "پلان_پروژه.png", meta: "۱.۱ مگابایت", tone: "orange" },
  { name: "یادداشت_جلسه.txt", meta: "۱۸ کیلوبایت", tone: "blue" },
];

const filesEn = [
  { name: "monthly_report.pdf", meta: "2.4 MB", tone: "blue" },
  { name: "project_plan.png", meta: "1.1 MB", tone: "orange" },
  { name: "meeting_notes.txt", meta: "18 KB", tone: "blue" },
];

function FileChip({ tone }) {
  const bg = tone === "blue" ? "bg-cs-file-blue" : "bg-cs-file-orange";
  return <span className={`inline-flex size-8 shrink-0 rounded-xl ${bg}`} aria-hidden />;
}

/** Live-styled mini dashboard that mirrors the real home screen. */
export function DashboardPreview({ locale = "fa", labels }) {
  const folders = locale === "fa" ? foldersFa : foldersEn;
  const files = locale === "fa" ? filesFa : filesEn;

  return (
    <div className="flex h-full flex-col bg-[#eef2fb] text-cs-ink">
      <div className="bg-gradient-to-br from-[#e8782a] via-[#c96118] to-[#c96118] px-4 pb-5 pt-10 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-white/75">{labels.greeting}</p>
            <p className="mt-1 text-lg font-extrabold leading-none">{labels.brand}</p>
          </div>
          <div className="origin-top-left scale-[0.82]">
            <StorageRing percent={62} usedLabel={labels.used} locale={locale} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2.5 ring-1 ring-white/20">
          <MagnifyingGlass size={16} weight="bold" className="text-white/80" aria-hidden />
          <span className="text-xs text-white/70">{labels.search}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden px-3.5 py-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold">{labels.folders}</p>
            <span className="text-[10px] font-semibold text-cs-blue">{labels.more}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {folders.map((folder) => (
              <div
                key={folder.name}
                className="rounded-2xl bg-white p-2.5 shadow-[0_8px_20px_rgba(21,32,56,0.06)]"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[#fff6d8] text-cs-folder">
                  <FolderSimple size={18} weight="fill" aria-hidden />
                </span>
                <p className="mt-2 truncate text-[10px] font-bold leading-4">{folder.name}</p>
                <p className="text-[9px] text-cs-muted">
                  {folder.count} {labels.items}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold">{labels.recent}</p>
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2 shadow-[0_8px_20px_rgba(21,32,56,0.05)]"
              >
                <FileChip tone={file.tone} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold">{file.name}</p>
                  <p className="text-[9px] text-cs-muted">{file.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Folders library preview. */
export function FoldersPreview({ locale = "fa", labels }) {
  const folders = locale === "fa" ? foldersFa : foldersEn;

  return (
    <div className="flex h-full flex-col bg-[#eef2fb] px-3.5 pb-4 pt-10 text-cs-ink">
      <p className="text-lg font-extrabold">{labels.foldersTitle}</p>
      <p className="mt-1 text-xs text-cs-muted">{labels.foldersBody}</p>
      <ul className="mt-4 space-y-2.5">
        {folders.map((folder, index) => (
          <motion.li
            key={folder.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * index, duration: 0.45 }}
            className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_10px_24px_rgba(21,32,56,0.06)]"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#fff6d8] text-cs-folder">
              <FolderSimple size={22} weight="fill" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{folder.name}</p>
              <p className="text-[11px] text-cs-muted">
                {folder.count} {labels.items}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Data Island style preview. */
export function IslandPreview({ labels }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0b3d7a] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(110,168,255,0.45), transparent 45%), radial-gradient(circle at 70% 70%, rgba(80,180,255,0.28), transparent 50%), linear-gradient(180deg, #0f4a96 0%, #0a356c 55%, #07274f 100%)",
        }}
        aria-hidden
      />
      <div className="relative z-[1] px-4 pb-3 pt-10">
        <p className="text-base font-extrabold">{labels.islandTitle}</p>
        <p className="mt-1 text-[11px] leading-5 text-white/75">{labels.islandBody}</p>
      </div>
      <div className="relative z-[1] flex flex-1 items-center justify-center">
        <div className="relative size-40">
          <span className="absolute inset-6 rounded-full bg-white/10 blur-md" aria-hidden />
          <span className="absolute left-[18%] top-[22%] size-12 rounded-2xl bg-[#f5c03d] shadow-lg shadow-black/20" />
          <span className="absolute right-[14%] top-[36%] size-10 rounded-2xl bg-[#f5a85a] shadow-lg shadow-black/20" />
          <span className="absolute bottom-[18%] left-[34%] size-14 rounded-[1.25rem] bg-white/90 shadow-lg shadow-black/25" />
          <span className="absolute left-[46%] top-[12%] size-8 rounded-xl bg-[#f08a3a] shadow-md shadow-black/20" />
        </div>
      </div>
      <div className="relative z-[1] mx-3 mb-4 rounded-2xl bg-white/12 px-3 py-2.5 ring-1 ring-white/20 backdrop-blur-sm">
        <p className="text-[11px] font-semibold text-white/90">{labels.islandHint}</p>
      </div>
    </div>
  );
}

/** Upload sheet overlay for hero storytelling. */
export function UploadSheet({ labels }) {
  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-white p-4 shadow-[0_-18px_40px_rgba(21,32,56,0.18)]">
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-cs-line" />
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-cs-blue text-white">
          <CloudArrowUp size={22} weight="bold" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-cs-ink">{labels.uploadTitle}</p>
          <p className="truncate text-xs text-cs-muted">{labels.uploadFile}</p>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-cs-blue-soft">
        <motion.div
          className="h-full rounded-full bg-cs-blue"
          initial={{ width: "12%" }}
          animate={{ width: "78%" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-cs-blue">{labels.uploadProgress}</p>
    </div>
  );
}
