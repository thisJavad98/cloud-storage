import { apiRequest, getApiUrl } from "../lib/api";
import { getAccessToken } from "../lib/session";

function requireToken() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("وارد حساب کاربری نشده‌اید.");
  }
  return token;
}

export async function listFiles(params = {}) {
  const token = requireToken();
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.folderId !== undefined) {
    query.set(
      "folderId",
      params.folderId === null ? "root" : String(params.folderId)
    );
  }
  if (params.trashed) query.set("trashed", "true");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await apiRequest(`/files${suffix}`, {
    method: "GET",
    token,
  });

  return payload.data;
}

export async function uploadFile(file, { name, folderId } = {}) {
  const token = requireToken();
  const form = new FormData();
  form.append("file", file);
  if (name) form.append("name", name);
  if (folderId) form.append("folderId", folderId);

  const payload = await apiRequest("/files", {
    method: "POST",
    body: form,
    token,
  });

  return payload.data.file;
}

export async function updateFile(id, body) {
  const token = requireToken();
  const payload = await apiRequest(`/files/${id}`, {
    method: "PATCH",
    body,
    token,
  });
  return payload.data.file;
}

export async function trashFile(id) {
  const token = requireToken();
  const payload = await apiRequest(`/files/${id}/trash`, {
    method: "POST",
    token,
  });
  return payload.data.file;
}

export async function restoreFile(id) {
  const token = requireToken();
  const payload = await apiRequest(`/files/${id}/restore`, {
    method: "POST",
    token,
  });
  return payload.data.file;
}

export async function deleteFile(id) {
  const token = requireToken();
  const payload = await apiRequest(`/files/${id}`, {
    method: "DELETE",
    token,
  });
  return payload.data;
}

export async function listFolders(params = {}) {
  const token = requireToken();
  const query = new URLSearchParams();
  if (params.parentId !== undefined) {
    query.set(
      "parentId",
      params.parentId === null ? "root" : String(params.parentId)
    );
  }
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await apiRequest(`/files/folders${suffix}`, {
    method: "GET",
    token,
  });
  return payload.data.folders;
}

export async function getFolder(id) {
  const token = requireToken();
  const payload = await apiRequest(`/files/folders/${id}`, {
    method: "GET",
    token,
  });
  return payload.data.folder;
}

export async function createFolder({ name, parentId } = {}) {
  const token = requireToken();
  const payload = await apiRequest("/files/folders", {
    method: "POST",
    body: { name, parentId: parentId || null },
    token,
  });
  return payload.data.folder;
}

export async function updateFolder(id, { name }) {
  const token = requireToken();
  const payload = await apiRequest(`/files/folders/${id}`, {
    method: "PATCH",
    body: { name },
    token,
  });
  return payload.data.folder;
}

export async function deleteFolder(id) {
  const token = requireToken();
  const payload = await apiRequest(`/files/folders/${id}`, {
    method: "DELETE",
    token,
  });
  return payload.data;
}

export async function downloadFile(id, fileName) {
  const token = requireToken();
  const response = await apiRequest(`/files/${id}/download`, {
    method: "GET",
    token,
    rawResponse: true,
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || "download";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function formatFileError(error) {
  if (!error) return "خطای ناشناخته رخ داد.";
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).join(" · ");
  }
  return error.message || "خطای ناشناخته رخ داد.";
}

export function getDownloadUrl(id) {
  return `${getApiUrl()}/files/${id}/download`;
}
