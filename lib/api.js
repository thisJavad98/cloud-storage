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

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers: customHeaders = {},
  } = options;

  const headers = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "ارتباط با سرور برقرار نشد. مطمئن شوید سرویس بک‌اند روی پورت ۴۰۰۰ در حال اجراست.",
      { status: 0 }
    );
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
