import { apiRequest } from "../lib/api";
import { getAccessToken, saveSession } from "../lib/session";

export async function signup({ email, password, fullName }) {
  const payload = await apiRequest("/auth/signup", {
    method: "POST",
    body: { email, password, fullName },
  });

  const { user, accessToken, refreshToken } = payload.data;
  saveSession({ user, accessToken, refreshToken });
  return payload.data;
}

export async function login({ email, password }) {
  const payload = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const { user, accessToken, refreshToken } = payload.data;
  saveSession({ user, accessToken, refreshToken });
  return payload.data;
}

export async function getMe() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }

  const payload = await apiRequest("/auth/me", {
    method: "GET",
    token,
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

  const user = payload.data.user;
  saveSession({ user });
  return user;
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

  const user = payload.data.user;
  saveSession({ user });
  return user;
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

  const user = payload.data.user;
  saveSession({ user });
  return user;
}

export function formatAuthError(error) {
  if (!error) return "خطای ناشناخته رخ داد.";

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).join(" · ");
  }

  return error.message || "خطای ناشناخته رخ داد.";
}
