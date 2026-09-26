const ACCESS_TOKEN_KEY = "cs_access_token";
const REFRESH_TOKEN_KEY = "cs_refresh_token";
const USER_KEY = "cs_user";
export const USER_UPDATED_EVENT = "cs:user-updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

function emitUserUpdated(user) {
  if (!canUseStorage() || !user) return;
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: user }));
}

export function saveSession({ accessToken, refreshToken, user }) {
  if (!canUseStorage()) return;

  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emitUserUpdated(user);
  }
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: null }));
}

export function getAccessToken() {
  if (!canUseStorage()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!canUseStorage()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** True when any persisted auth material exists (access, refresh, or cached user). */
export function hasSession() {
  return Boolean(getAccessToken() || getRefreshToken() || getStoredUser());
}

export function getStoredUser() {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Subscribe to profile changes (same tab + other tabs via storage). */
export function subscribeUser(handler) {
  if (!canUseStorage()) return () => {};

  function onCustom(event) {
    handler(event.detail ?? null);
  }

  function onStorage(event) {
    if (event.key !== USER_KEY) return;
    if (!event.newValue) {
      handler(null);
      return;
    }
    try {
      handler(JSON.parse(event.newValue));
    } catch {
      handler(null);
    }
  }

  window.addEventListener(USER_UPDATED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(USER_UPDATED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
