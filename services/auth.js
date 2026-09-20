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

export function formatAuthError(error) {
  if (!error) return "خطای ناشناخته رخ داد.";

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).join(" · ");
  }

  return error.message || "خطای ناشناخته رخ داد.";
}
