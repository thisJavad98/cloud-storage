"use client";

const STORAGE_KEY = "cs_island_positions_v1";

function readAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota / private mode
  }
}

function seaKey(parentId) {
  return parentId ? String(parentId) : "root";
}

export function getIslandPosition(parentId, itemKey) {
  const all = readAll();
  const sea = all[seaKey(parentId)];
  if (!sea || typeof sea !== "object") return null;
  const pos = sea[itemKey];
  if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") return null;
  return { x: pos.x, y: pos.y };
}

export function setIslandPosition(parentId, itemKey, position) {
  const all = readAll();
  const key = seaKey(parentId);
  const sea = { ...(all[key] || {}) };
  sea[itemKey] = { x: position.x, y: position.y };
  all[key] = sea;
  writeAll(all);
}

/** Deterministic spread so islands don't stack on first visit. */
export function defaultIslandPosition(index, total, seed = 0) {
  const cols = Math.max(3, Math.min(4, Math.ceil(Math.sqrt(Math.max(total, 1) * 1.2))));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const jitterX = ((seed * 17 + index * 31) % 23) - 11;
  const jitterY = ((seed * 13 + index * 19) % 19) - 9;
  const cellW = 100 / cols;
  const rows = Math.max(1, Math.ceil(total / cols));
  const cellH = Math.max(18, 70 / rows);

  return {
    x: Math.min(86, Math.max(4, col * cellW + cellW * 0.12 + jitterX * 0.28)),
    y: Math.min(74, Math.max(8, 10 + row * cellH + jitterY * 0.32)),
  };
}
