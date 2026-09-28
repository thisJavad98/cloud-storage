"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BottomNav from "../../components/BottomNav";
import SeaBackground from "../../components/data-island/SeaBackground";
import IslandNode from "../../components/data-island/IslandNode";
import IslandPreviewDock from "../../components/data-island/IslandPreviewDock";
import { IconArrow, IconIsland } from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import {
  defaultIslandPosition,
  getIslandPosition,
  setIslandPosition,
} from "../../lib/islandPositions";
import { formatBytes, formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { easeOut } from "../../lib/motion";
import { finishPageLoad } from "../../lib/pageLoading";
import { getStoredUser, hasSession } from "../../lib/session";
import { useLiveUser } from "../../lib/useLiveUser";
import { useLibrarySync } from "../../lib/useLibrarySync";
import { notifyError } from "../../lib/toast";
import { browseIsland, formatFileError } from "../../services/files";

function itemKey(kind, id) {
  return `${kind}:${id}`;
}

export default function DataIslandPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const seaRef = useRef(null);
  const bootRef = useRef(true);

  const [user, setUser] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [folder, setFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diving, setDiving] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [positions, setPositions] = useState({});
  const [trail, setTrail] = useState([]);

  const [seaSize, setSeaSize] = useState({ width: 360, height: 520 });

  useLiveUser(setUser);

  useEffect(() => {
    const sea = seaRef.current;
    if (!sea || typeof ResizeObserver === "undefined") return undefined;

    function measure() {
      const rect = sea.getBoundingClientRect();
      setSeaSize({ width: rect.width || 360, height: rect.height || 520 });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sea);
    return () => observer.disconnect();
  }, [loading]);

  const refresh = useCallback(async () => {
    if (!hasSession()) {
      router.replace("/login");
      return;
    }

    const startedAt = Date.now();
    const isBoot = bootRef.current;

    try {
      const island = await browseIsland({ parentId, limit: 100 });
      const stored = getStoredUser();
      if (stored) setUser(stored);
      setFolder(island.folder || null);
      setFolders(island.folders || []);
      setFiles(island.files || []);

      const nextPositions = {};
      const folderRows = island.folders || [];
      const fileRows = island.files || [];
      const total = folderRows.length + fileRows.length;
      for (let i = 0; i < folderRows.length; i += 1) {
        const key = itemKey("folder", folderRows[i].id);
        nextPositions[key] =
          getIslandPosition(parentId, key) ||
          defaultIslandPosition(i, total, 0);
      }
      for (let i = 0; i < fileRows.length; i += 1) {
        const key = itemKey("file", fileRows[i].id);
        const index = folderRows.length + i;
        nextPositions[key] =
          getIslandPosition(parentId, key) ||
          defaultIslandPosition(index, total, 3);
      }
      setPositions(nextPositions);
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
      setDiving(false);
    }
  }, [router, parentId]);

  useLibrarySync(refresh);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
    setLoading(true);
    refresh();
  }, [router, refresh]);

  const islands = useMemo(() => {
    const folderIslands = folders.map((f) => ({
      kind: "folder",
      item: f,
      key: itemKey("folder", f.id),
    }));
    const fileIslands = files.map((f) => ({
      kind: "file",
      item: f,
      key: itemKey("file", f.id),
    }));
    return [...folderIslands, ...fileIslands];
  }, [folders, files]);

  function commitIslandMove(key, next) {
    setPositions((prev) => ({ ...prev, [key]: next }));
    setIslandPosition(parentId, key, next);
  }

  function openFolderIsland(nextFolder) {
    if (diving) return;
    setPreviewFile(null);
    setDiving(true);
    setTrail((prev) => [
      ...prev,
      { id: parentId, name: folder?.name || t("dataIsland.openSea") },
    ]);
    setParentId(nextFolder.id);
  }

  function goBack() {
    if (diving) return;
    setPreviewFile(null);
    setDiving(true);
    setTrail((prev) => {
      const next = [...prev];
      const last = next.pop();
      setParentId(last?.id ?? null);
      return next;
    });
  }

  function goToRoot() {
    if (diving || parentId === null) return;
    setPreviewFile(null);
    setDiving(true);
    setTrail([]);
    setParentId(null);
  }

  const title = folder?.name || t("dataIsland.title");
  const subtitle = parentId
    ? t("dataIsland.folderSea")
    : t("dataIsland.openSea");

  if (loading && bootRef.current) {
    return <PageLoader />;
  }

  return (
    <div className="relative h-dvh min-h-dvh w-full bg-[#0284c7]">
      <div className="absolute inset-0 overflow-hidden">
        <SeaBackground />
      </div>
      <div className="relative z-10 mx-auto flex h-dvh min-h-dvh w-full max-w-[390px] flex-col">
        <header className="relative z-20 shrink-0 px-3 pb-1.5 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <motion.div
            className="flex items-center gap-2 rounded-3xl bg-[#082f49]/45 px-3 py-2.5 shadow-[0_12px_28px_rgba(8,47,73,0.35)] backdrop-blur-md ring-1 ring-cyan-100/20"
            initial={reduce ? false : { y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            {parentId ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20"
                aria-label={t("dataIsland.back")}
              >
                <IconArrow className="size-4 rotate-180" />
              </button>
            ) : (
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-100 ring-1 ring-cyan-200/30">
                <IconIsland className="size-5" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-cyan-100/80">
                {subtitle}
              </p>
              <h1 className="truncate font-brand text-[18px] leading-tight text-white">
                {title}
              </h1>
            </div>

            {parentId ? (
              <button
                type="button"
                onClick={goToRoot}
                className="rounded-full bg-teal-400/20 px-2.5 py-1 text-[10px] font-bold text-teal-100 ring-1 ring-teal-200/30"
              >
                {t("dataIsland.toSurface")}
              </button>
            ) : null}
          </motion.div>

          <motion.p
            className="mt-2 px-1 text-[11px] text-cyan-50/80"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            {t("dataIsland.hint")}
          </motion.p>

          {trail.length > 0 ? (
            <p className="mt-1 truncate px-1 text-[10px] text-cyan-100/55">
              {t("dataIsland.openSea")}
              {trail
                .filter((step) => step.id)
                .map((step) => ` · ${step.name}`)
                .join("")}
              {folder ? ` · ${folder.name}` : ""}
            </p>
          ) : null}
        </header>

        <div
          ref={seaRef}
          className="relative z-10 mb-[5.25rem] min-h-[66dvh] w-full flex-1 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={parentId || "root"}
              className="absolute inset-0"
              initial={
                reduce
                  ? false
                  : { opacity: 0, scale: 1.08, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              {loading || diving ? (
                <div className="flex h-full items-center justify-center">
                  <motion.div
                    className="rounded-full bg-[#082f49]/55 px-4 py-2 text-sm text-cyan-50 backdrop-blur-md"
                    animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    {t("dataIsland.diving")}
                  </motion.div>
                </div>
              ) : islands.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <motion.div
                    className="mb-3 size-20 rounded-[42%] bg-gradient-to-b from-emerald-300/80 to-emerald-700/90 shadow-[0_12px_28px_rgba(8,47,73,0.4)]"
                    animate={
                      reduce
                        ? undefined
                        : { y: [0, -8, 0], rotate: [0, 2, 0] }
                    }
                    transition={{ duration: 3.2, repeat: Infinity }}
                  />
                  <p className="text-base font-bold text-white">
                    {t("dataIsland.emptyTitle")}
                  </p>
                  <p className="mt-1 text-sm text-cyan-100/80">
                    {t("dataIsland.emptyBody")}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {islands.map((entry, index) => {
                    const pos =
                      positions[entry.key] ||
                      defaultIslandPosition(index, islands.length);
                    const meta =
                      entry.kind === "folder"
                        ? t("dataIsland.folderMeta", {
                            count: formatDigits(
                              entry.item.fileCount ?? 0,
                              locale
                            ),
                          })
                        : formatBytes(entry.item.sizeBytes || 0, t, locale);

                    return (
                      <IslandNode
                        key={entry.key}
                        item={entry.item}
                        kind={entry.kind}
                        x={pos.x}
                        y={pos.y}
                        index={index}
                        meta={meta}
                        seaWidth={seaSize.width}
                        seaHeight={seaSize.height}
                        onMove={(next) => commitIslandMove(entry.key, next)}
                        onOpen={(item, kind) => {
                          if (kind === "folder") {
                            openFolderIsland(item);
                          } else {
                            setPreviewFile(item);
                          }
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>
          </AnimatePresence>

          {!reduce ? (
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-4 h-12 rounded-[100%] bg-[#022c44]/4 blur-lg"
              animate={{ scaleX: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </div>

        <IslandPreviewDock
          open={Boolean(previewFile)}
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />

        <BottomNav
          activeId="manage"
          defaultFolderId={parentId}
          folders={folders}
        />
      </div>
    </div>
  );
}
