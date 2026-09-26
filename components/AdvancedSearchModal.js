"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileGlyph,
  IconClose,
  IconFilters,
  IconFolder,
  IconSearch,
} from "./Icons";
import { formatBytes, formatDate, formatDigits } from "../lib/format";
import { useI18n } from "../lib/i18n/I18nProvider";
import { notifyError } from "../lib/toast";
import {
  formatFileError,
  listFolders,
  searchLibrary,
} from "../services/files";

const MIME_OPTIONS = [
  { id: "all", value: "" },
  { id: "image", value: "image/" },
  { id: "video", value: "video/" },
  { id: "audio", value: "audio/" },
  { id: "pdf", value: "application/pdf" },
  { id: "text", value: "text/" },
];

const SCOPE_OPTIONS = ["all", "files", "folders"];

function fileTone(mimeType = "") {
  if (mimeType.startsWith("image/")) return "orange";
  if (mimeType.includes("pdf") || mimeType.startsWith("text/")) return "blue";
  return "orange";
}

function scopeLabelKey(id) {
  return `advancedSearch.scope${id[0].toUpperCase()}${id.slice(1)}`;
}

function typeLabelKey(id) {
  return `advancedSearch.type${id[0].toUpperCase()}${id.slice(1)}`;
}

export default function AdvancedSearchModal({
  open,
  onClose,
  initialQuery = "",
}) {
  const { t, locale } = useI18n();
  const searchingRef = useRef(false);
  const inputRef = useRef(null);
  const autoSearchedRef = useRef("");

  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState("all");
  const [mimeType, setMimeType] = useState("");
  const [folderId, setFolderId] = useState("any");
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState({
    files: [],
    folders: [],
    pagination: null,
  });

  searchingRef.current = searching;

  const runSearch = useCallback(
    async ({
      q = query,
      nextScope = scope,
      nextMime = mimeType,
      nextFolder = folderId,
    } = {}) => {
      const trimmed = String(q || "").trim();
      const hasFilters =
        Boolean(trimmed) ||
        Boolean(nextMime) ||
        nextFolder !== "any" ||
        nextScope !== "all";

      if (!hasFilters) {
        setSearched(true);
        setResults({ files: [], folders: [], pagination: null });
        return;
      }

      setSearching(true);
      try {
        const params = {
          q: trimmed || undefined,
          scope: nextScope,
          limit: 40,
        };

        if (nextScope !== "folders" && nextMime) {
          params.mimeType = nextMime;
        }

        if (nextScope !== "folders" && nextFolder !== "any") {
          params.folderId = nextFolder === "root" ? null : nextFolder;
        }

        const data = await searchLibrary(params);
        setResults({
          files: data?.files || [],
          folders: data?.folders || [],
          pagination: data?.pagination || null,
        });
        setSearched(true);
      } catch (err) {
        notifyError(formatFileError(err));
      } finally {
        setSearching(false);
      }
    },
    [query, scope, mimeType, folderId]
  );

  useEffect(() => {
    if (!open) {
      autoSearchedRef.current = "";
      return undefined;
    }

    setQuery(initialQuery || "");
    setScope("all");
    setMimeType("");
    setFolderId("any");
    setSearching(false);
    setSearched(false);
    setResults({ files: [], folders: [], pagination: null });

    let cancelled = false;
    async function loadFolders() {
      setLoadingFolders(true);
      try {
        const rows = await listFolders();
        if (!cancelled) setFolders(rows || []);
      } catch (err) {
        if (!cancelled) notifyError(formatFileError(err));
      } finally {
        if (!cancelled) setLoadingFolders(false);
      }
    }

    loadFolders();

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    function onKeyDown(event) {
      if (event.key === "Escape" && !searchingRef.current) onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelled = true;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, initialQuery, onClose]);

  useEffect(() => {
    if (!open) return;
    const seed = String(initialQuery || "").trim();
    if (!seed || autoSearchedRef.current === seed) return;
    autoSearchedRef.current = seed;
    runSearch({
      q: seed,
      nextScope: "all",
      nextMime: "",
      nextFolder: "any",
    });
  }, [open, initialQuery, runSearch]);

  if (!open) return null;

  const fileCount = results.files.length;
  const folderCount = results.folders.length;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 px-3 pb-3 pt-10 sm:items-center sm:px-4 sm:pb-6"
      role="presentation"
      onClick={() => {
        if (!searching) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="advanced-search-title"
        className="flex max-h-[min(92dvh,720px)] w-full max-w-[390px] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-cs-line px-5 pb-4 pt-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cs-blue-soft text-cs-blue">
              <IconFilters className="size-6" />
            </div>
            <div className="min-w-0 flex-1 text-start">
              <h2
                id="advanced-search-title"
                className="text-lg font-extrabold leading-8 text-cs-ink"
              >
                {t("advancedSearch.title")}
              </h2>
              <p className="text-xs leading-5 text-cs-muted">
                {t("advancedSearch.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onClose?.()}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-cs-muted ring-1 ring-cs-line hover:bg-cs-surface"
              aria-label={t("common.cancel")}
            >
              <IconClose className="size-4" />
            </button>
          </div>

          <label className="relative block">
            <span className="sr-only">{t("advancedSearch.query")}</span>
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-cs-muted">
              <IconSearch className="size-5" />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runSearch();
                }
              }}
              placeholder={t("advancedSearch.queryPlaceholder")}
              className="h-12 w-full rounded-2xl border-0 bg-cs-surface py-3 pe-10 ps-11 text-sm text-cs-ink outline-none ring-1 ring-cs-line placeholder:text-cs-muted focus:ring-cs-blue/35"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 end-2 my-auto inline-flex size-8 items-center justify-center rounded-full text-cs-muted hover:bg-white"
                aria-label={t("advancedSearch.clear")}
              >
                <IconClose className="size-3.5" />
              </button>
            ) : null}
          </label>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <p className="mb-2 text-xs font-bold text-cs-ink">
              {t("advancedSearch.scope")}
            </p>
            <div className="flex flex-wrap gap-2">
              {SCOPE_OPTIONS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setScope(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    scope === id
                      ? "bg-cs-blue text-white shadow-sm shadow-cs-blue/25"
                      : "bg-cs-surface text-cs-muted ring-1 ring-cs-line hover:text-cs-ink"
                  }`}
                >
                  {t(scopeLabelKey(id))}
                </button>
              ))}
            </div>
          </div>

          {scope !== "folders" ? (
            <div>
              <p className="mb-2 text-xs font-bold text-cs-ink">
                {t("advancedSearch.fileType")}
              </p>
              <div className="flex flex-wrap gap-2">
                {MIME_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMimeType(option.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      mimeType === option.value
                        ? "bg-cs-blue text-white shadow-sm shadow-cs-blue/25"
                        : "bg-cs-surface text-cs-muted ring-1 ring-cs-line hover:text-cs-ink"
                    }`}
                  >
                    {t(typeLabelKey(option.id))}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {scope !== "folders" ? (
            <div>
              <p className="mb-2 text-xs font-bold text-cs-ink">
                {t("advancedSearch.folder")}
              </p>
              <div className="max-h-36 space-y-1.5 overflow-y-auto rounded-2xl bg-cs-surface p-2">
                <button
                  type="button"
                  onClick={() => setFolderId("any")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition ${
                    folderId === "any"
                      ? "bg-white ring-2 ring-cs-blue/30"
                      : "hover:bg-white/80"
                  }`}
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-cs-blue-soft text-cs-blue">
                    <IconSearch className="size-4" />
                  </span>
                  <span className="text-sm font-bold text-cs-ink">
                    {t("advancedSearch.anyFolder")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFolderId("root")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition ${
                    folderId === "root"
                      ? "bg-white ring-2 ring-cs-blue/30"
                      : "hover:bg-white/80"
                  }`}
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-cs-blue-soft text-cs-blue">
                    <IconFolder className="size-4" />
                  </span>
                  <span className="text-sm font-bold text-cs-ink">
                    {t("advancedSearch.root")}
                  </span>
                </button>
                {loadingFolders ? (
                  <p className="px-3 py-2 text-xs text-cs-muted">
                    {t("common.loading")}
                  </p>
                ) : (
                  folders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setFolderId(folder.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition ${
                        folderId === folder.id
                          ? "bg-white ring-2 ring-cs-blue/30"
                          : "hover:bg-white/80"
                      }`}
                    >
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fff4d4] text-cs-folder-dark">
                        <IconFolder className="size-4 text-cs-folder" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-cs-ink">
                          {folder.name}
                        </span>
                        <span className="block text-[11px] text-cs-muted">
                          {formatDigits(folder.fileCount ?? 0, locale)}{" "}
                          {t("common.file")}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {searched ? (
            <div className="space-y-3 border-t border-cs-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-cs-ink">
                  {t("advancedSearch.results")}
                </h3>
                <p className="text-[11px] text-cs-muted">
                  {t("advancedSearch.resultsCount", {
                    files: formatDigits(fileCount, locale),
                    folders: formatDigits(folderCount, locale),
                  })}
                </p>
              </div>

              {!fileCount && !folderCount ? (
                <p className="rounded-2xl bg-cs-surface px-4 py-6 text-center text-sm text-cs-muted">
                  {t("advancedSearch.empty")}
                </p>
              ) : null}

              {folderCount ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-cs-muted">
                    {t("advancedSearch.folders")}
                  </p>
                  {results.folders.map((folder) => (
                    <Link
                      key={folder.id}
                      href={`/folders/${folder.id}`}
                      onClick={() => onClose?.()}
                      className="pressable flex items-center gap-3 rounded-2xl bg-cs-surface p-3 ring-1 ring-transparent transition hover:ring-cs-blue/25"
                    >
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4d4]">
                        <IconFolder className="size-5 text-cs-folder" />
                      </span>
                      <span className="min-w-0 flex-1 text-start">
                        <span className="block truncate text-sm font-bold text-cs-ink">
                          {folder.name}
                        </span>
                        <span className="block text-[11px] text-cs-muted">
                          {formatDigits(folder.fileCount ?? 0, locale)}{" "}
                          {t("common.file")}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}

              {fileCount ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-cs-muted">
                    {t("advancedSearch.files")}
                  </p>
                  {results.files.map((file) => (
                    <Link
                      key={file.id}
                      href={
                        file.folderId
                          ? `/folders/${file.folderId}?file=${encodeURIComponent(file.id)}`
                          : `/files?file=${encodeURIComponent(file.id)}`
                      }
                      onClick={() => onClose?.()}
                      className="pressable flex items-center gap-3 rounded-2xl bg-cs-surface p-3 ring-1 ring-transparent transition hover:ring-cs-blue/25"
                    >
                      <FileGlyph tone={fileTone(file.mimeType)} />
                      <span className="min-w-0 flex-1 text-start">
                        <span className="block truncate text-sm font-bold text-cs-ink">
                          {file.name}
                        </span>
                        <span className="block text-[11px] text-cs-muted">
                          {formatDate(file.updatedAt || file.createdAt, locale)}
                          <span className="mx-2 text-cs-line">|</span>
                          {formatBytes(file.sizeBytes, t, locale)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-cs-line px-5 py-4">
          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={searching}
            className="h-12 rounded-2xl bg-cs-surface text-sm font-bold text-cs-ink ring-1 ring-cs-line transition hover:bg-white disabled:opacity-60"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => runSearch()}
            disabled={searching}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cs-blue text-sm font-bold text-white shadow-sm shadow-cs-blue/25 transition hover:bg-cs-blue-deep disabled:opacity-60"
          >
            <IconSearch className="size-4" />
            {searching
              ? t("advancedSearch.searching")
              : t("advancedSearch.search")}
          </button>
        </div>
      </div>
    </div>
  );
}
