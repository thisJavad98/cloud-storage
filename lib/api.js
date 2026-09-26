import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "./session";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message, { status, errors, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 500;
    this.errors = errors ?? [];
    this.payload = payload ?? null;
  }
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new ApiError("نشست منقضی شده است. دوباره وارد شوید.", {
        status: 401,
      });
    }

    let response;
    try {
      response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      throw new ApiError(
        "ارتباط با سرور برقرار نشد. مطمئن شوید سرویس بک‌اند روی پورت ۴۰۰۰ در حال اجراست.",
        { status: 0 }
      );
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      clearSession();
      throw new ApiError(payload?.message || "نشست منقضی شده است.", {
        status: response.status,
        errors: payload?.errors || [],
        payload,
      });
    }

    const data = payload?.data || {};
    saveSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers: customHeaders = {},
    skipAuthRefresh = false,
    _retried = false,
  } = options;

  const headers = {
    Accept: "application/json",
    ...customHeaders,
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const authToken = token || (!skipAuthRefresh ? getAccessToken() : null);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "ارتباط با سرور برقرار نشد. مطمئن شوید سرویس بک‌اند روی پورت ۴۰۰۰ در حال اجراست.",
      { status: 0 }
    );
  }

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    !_retried &&
    path !== "/auth/login" &&
    path !== "/auth/signup" &&
    path !== "/auth/refresh"
  ) {
    try {
      const nextToken = await refreshAccessToken();
      return apiRequest(path, {
        ...options,
        token: nextToken,
        _retried: true,
      });
    } catch (refreshError) {
      if (refreshError instanceof ApiError) throw refreshError;
      clearSession();
      throw new ApiError("نشست منقضی شده است. دوباره وارد شوید.", {
        status: 401,
      });
    }
  }

  if (options.rawResponse) {
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new ApiError(payload?.message || "درخواست با خطا مواجه شد.", {
        status: response.status,
        errors: payload?.errors || [],
        payload,
      });
    }
    return response;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.message || "درخواست با خطا مواجه شد.", {
      status: response.status,
      errors: payload?.errors || [],
      payload,
    });
  }

  return payload;
}

export function getApiUrl() {
  return API_URL;
}

/** Resolve a backend-relative media path (e.g. /uploads/avatars/…) to an absolute URL. */
export function getMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const origin = API_URL.replace(/\/api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
