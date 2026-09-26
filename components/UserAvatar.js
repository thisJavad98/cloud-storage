"use client";

import { getMediaUrl } from "../lib/api";

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  alt,
}) {
  const sizeClass =
    size === "lg"
      ? "size-24 text-2xl"
      : size === "sm"
        ? "size-8 text-xs"
        : "size-10 text-sm";

  const src = getMediaUrl(user?.avatarUrl, { version: user?.updatedAt });
  const label = alt || user?.fullName || user?.email || "کاربر";
  const initial = (user?.fullName || user?.email || "؟").trim().charAt(0);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        src={src}
        alt={label}
        className={`${sizeClass} rounded-full object-cover shadow-sm ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f7c59f] to-[#d9895b] font-bold text-white shadow-sm ring-2 ring-white ${className}`}
      title={label}
      aria-label={label}
    >
      <span className="leading-none">{initial}</span>
    </div>
  );
}
