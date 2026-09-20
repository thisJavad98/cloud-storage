"use client";

export function formatDigits(value, locale = "fa") {
  const str = String(value);
  if (locale !== "fa") return str;
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export function formatBytes(bytes, t, locale = "fa") {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return `${formatDigits(0, locale)}\u00A0${t("common.bytes")}`;
  }
  const units = [
    t("common.bytes"),
    t("common.kb"),
    t("common.mb"),
    t("common.gb"),
    t("common.tb"),
  ];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${formatDigits(rounded, locale)}\u00A0${units[unit]}`;
}

export function formatDate(value, locale = "fa") {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
