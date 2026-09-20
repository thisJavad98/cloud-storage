"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav from "../../components/BottomNav";
import ConfirmModal from "../../components/ConfirmModal";
import AppBrand from "../../components/AppBrand";
import { IconArrow, IconLogout } from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import UserAvatar from "../../components/UserAvatar";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  saveSession,
} from "../../lib/session";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../../lib/toast";
import {
  formatAuthError,
  getMe,
  removeAvatar,
  updateProfile,
  uploadAvatar,
} from "../../services/auth";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const me = await getMe();
      saveSession({ user: me });
      setUser(me);
      setFullName(me.fullName || "");
      setBio(me.bio || "");
    } catch (err) {
      notifyError(formatAuthError(err));
      if (err?.status === 401) router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
    setFullName(stored.fullName || "");
    setBio(stored.bio || "");
    refresh();
  }, [router, refresh]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({
        fullName: fullName.trim(),
        bio: bio.trim() || null,
      });
      setUser(updated);
      notifySuccess("پروفایل با موفقیت ذخیره شد");
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notifyError("لطفاً یک فایل تصویری انتخاب کنید.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notifyError("حجم تصویر باید کمتر از ۲ مگابایت باشد.");
      return;
    }

    setAvatarBusy(true);
    try {
      const updated = await uploadAvatar(file);
      setUser(updated);
      notifySuccess("تصویر پروفایل به‌روز شد");
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function confirmRemoveAvatar() {
    setAvatarBusy(true);
    try {
      const updated = await removeAvatar();
      setUser(updated);
      setRemoveOpen(false);
      notifySuccess("تصویر پروفایل حذف شد");
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  function confirmLogout() {
    setLoggingOut(true);
    clearSession();
    notifyInfo("با موفقیت خارج شدید");
    setLogoutOpen(false);
    setLoggingOut(false);
    router.push("/login");
  }

  if (!user || loading) {
    return <PageLoader />;
  }

  const dirty =
    fullName.trim() !== (user.fullName || "").trim() ||
    (bio.trim() || "") !== (user.bio || "").trim();

  return (
    <main className="min-h-dvh dash-pattern">
      <div className="phone-shell flex min-h-dvh flex-col pb-32">
        <header className="flex items-center gap-3 px-5 pt-6">
          <Link
            href="/dashboard"
            className="inline-flex size-10 items-center justify-center rounded-full bg-white text-cs-blue shadow-sm ring-1 ring-cs-line"
            aria-label="بازگشت"
          >
            <IconArrow className="size-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <AppBrand size="sm" showLogo={false} className="justify-center" />
            <h1 className="mt-0.5 text-lg font-extrabold text-cs-ink">
              پروفایل من
            </h1>
          </div>
          <span className="size-10" aria-hidden="true" />
        </header>

        <section className="flex flex-col items-center px-5 pt-8">
          <div className="relative">
            <UserAvatar user={user} size="lg" className="ring-4 ring-white" />
            {avatarBusy ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-xs font-semibold text-white">
                ...
              </div>
            ) : null}
          </div>

          <p className="mt-3 text-base font-bold text-cs-ink">
            {user.fullName || user.email}
          </p>
          <p className="mt-1 text-xs text-cs-muted" dir="ltr">
            {user.email}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={avatarBusy}
              onClick={() => fileInputRef.current?.click()}
              className="h-10 rounded-2xl bg-cs-blue px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              تغییر تصویر
            </button>
            {user.avatarUrl ? (
              <button
                type="button"
                disabled={avatarBusy}
                onClick={() => setRemoveOpen(true)}
                className="h-10 rounded-2xl bg-white px-4 text-sm font-semibold text-cs-muted ring-1 ring-cs-line disabled:opacity-60"
              >
                حذف
              </button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </section>

        <form onSubmit={handleSave} className="mt-8 space-y-5 px-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-cs-ink">
              نام نمایشی
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              className="h-13 w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-sm text-cs-ink outline-none ring-1 ring-cs-line transition placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-semibold text-cs-ink">
              <span>درباره من</span>
              <span className="text-xs font-normal text-cs-muted">
                {String(bio.length).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}
                /
                {"۲۸۰"}
              </span>
            </span>
            <textarea
              rows={4}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="چند جمله درباره خودتان بنویسید..."
              className="w-full resize-none rounded-2xl border-0 bg-white px-4 py-3.5 text-sm leading-7 text-cs-ink outline-none ring-1 ring-cs-line transition placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>

          <button
            type="submit"
            disabled={saving || !dirty || fullName.trim().length < 2}
            className="h-14 w-full rounded-2xl bg-cs-blue text-base font-bold text-white shadow-[0_12px_28px_rgba(31,79,196,0.28)] transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </form>

        <div className="mt-6 px-5">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-red-500 ring-1 ring-cs-line"
          >
            <IconLogout className="size-5" />
            خروج از حساب
          </button>
        </div>

        <BottomNav activeId="profile" onUploadSuccess={refresh} />
      </div>

      <ConfirmModal
        open={removeOpen}
        title="حذف تصویر پروفایل"
        message="آیا می‌خواهید تصویر پروفایل حذف شود؟"
        confirmLabel="بله، حذف کن"
        cancelLabel="انصراف"
        tone="danger"
        loading={avatarBusy}
        onCancel={() => {
          if (!avatarBusy) setRemoveOpen(false);
        }}
        onConfirm={confirmRemoveAvatar}
      />

      <ConfirmModal
        open={logoutOpen}
        title="خروج از حساب"
        message="آیا می‌خواهید از حساب کاربری خارج شوید؟"
        confirmLabel="بله، خارج شو"
        cancelLabel="انصراف"
        tone="primary"
        loading={loggingOut}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={confirmLogout}
      />
    </main>
  );
}
