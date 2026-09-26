const ACCESS_TOKEN_KEY = "cs_access_token";
const REFRESH_TOKEN_KEY = "cs_refresh_token";
const USER_KEY = "cs_user";

function canUseStorage() {
  return typeof window !== "undefined";
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
  }
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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
