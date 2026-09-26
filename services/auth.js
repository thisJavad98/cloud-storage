import { apiRequest } from "../lib/api";
import { getAccessToken, getRefreshToken, saveSession } from "../lib/session";
import { emitLibrarySync, setStoredDataRevision } from "../lib/sync";

function persistUser(user) {
  saveSession({ user });
  if (user?.dataRevision != null) {
    setStoredDataRevision(user.dataRevision);
  }
  emitLibrarySync("profile");
  return user;
}
export async function signup({ email, password, fullName }) {
  const payload = await apiRequest("/auth/signup", {
    method: "POST",
    body: { email, password, fullName },
    skipAuthRefresh: true,
  });

  const { user, accessToken, refreshToken } = payload.data;
  saveSession({ user, accessToken, refreshToken });
  if (user?.dataRevision != null) setStoredDataRevision(user.dataRevision);
  return payload.data;
}

export async function login({ email, password }) {
  const payload = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuthRefresh: true,
  });

  const { user, accessToken, refreshToken } = payload.data;
  saveSession({ user, accessToken, refreshToken });
  if (user?.dataRevision != null) setStoredDataRevision(user.dataRevision);
  return payload.data;
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("نشست منقضی شده است.");
  }

  const payload = await apiRequest("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    skipAuthRefresh: true,
  });

  const { user, accessToken, refreshToken: nextRefresh } = payload.data;
  saveSession({ user, accessToken, refreshToken: nextRefresh });
  if (user?.dataRevision != null) setStoredDataRevision(user.dataRevision);
  return payload.data;
}

export async function getMe() {
  const token = getAccessToken();
  if (!token && !getRefreshToken()) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }

  const payload = await apiRequest("/auth/me", {
    method: "GET",
    token: getAccessToken() || undefined,
  });

  return payload.data.user;
}

export async function updateProfile({ fullName, bio }) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }

  const body = {};
  if (fullName !== undefined) body.fullName = fullName;
  if (bio !== undefined) body.bio = bio;

  const payload = await apiRequest("/auth/me", {
    method: "PATCH",
    token,
    body,
  });

  return persistUser(payload.data.user);
}

export async function uploadAvatar(file) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const payload = await apiRequest("/auth/avatar", {
    method: "POST",
    token,
    body: formData,
  });

  return persistUser(payload.data.user);
}

export async function removeAvatar() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }

  const payload = await apiRequest("/auth/avatar", {
    method: "DELETE",
    token,
  });

  return persistUser(payload.data.user);
}

export function formatAuthError(error) {
  if (!error) return "خطای ناشناخته رخ داد.";

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).join(" · ");
  }

  return error.message || "خطای ناشناخته رخ داد.";
}
