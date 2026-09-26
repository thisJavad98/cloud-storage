"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav from "../../components/BottomNav";
import ConfirmModal from "../../components/ConfirmModal";
import AppBrand from "../../components/AppBrand";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { IconArrow, IconLogout } from "../../components/Icons";
import PageLoader from "../../components/PageLoader";
import { MotionBlock, MotionHeader } from "../../components/PageMotion";
import UserAvatar from "../../components/UserAvatar";
import { formatDigits } from "../../lib/format";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { finishPageLoad } from "../../lib/pageLoading";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  hasSession,
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
import { motion } from "motion/react";
import { shouldPromptAddToHome } from "../../lib/ios";

export default function ProfilePage() {
  const router = useRouter();
  const { t, locale } = useI18n();
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
  const [showA2hs, setShowA2hs] = useState(false);
  const bootRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!hasSession()) {
      router.replace("/login");
      return;
    }

    const startedAt = Date.now();
    const isBoot = bootRef.current;

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
      if (isBoot) {
        await finishPageLoad(startedAt);
        bootRef.current = false;
      }
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
    setShowA2hs(shouldPromptAddToHome());
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
      notifySuccess(t("profile.saved"));
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
      notifyError(t("profile.pickImage"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notifyError(t("profile.imageTooLarge"));
      return;
    }

    setAvatarBusy(true);
    try {
      const updated = await uploadAvatar(file);
      setUser(updated);
      notifySuccess(t("profile.avatarUpdated"));
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
      notifySuccess(t("profile.avatarRemoved"));
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  function confirmLogout() {
    setLoggingOut(true);
    clearSession();
    notifyInfo(t("profile.loggedOut"));
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
        <MotionHeader className="flex items-center justify-center px-5 pt-6">
          <div className="min-w-0 flex-1 px-12 text-center">
            <AppBrand size="sm" showLogo={false} className="justify-center" />
            <h1 className="mt-0.5 text-lg font-extrabold text-cs-ink">
              {t("profile.title")}
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="absolute right-5 top-6 inline-flex size-10 items-center justify-center rounded-full bg-white text-cs-blue shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line"
            aria-label={t("common.back")}
          >
            <IconArrow className="size-5 rotate-180" />
          </Link>
        </MotionHeader>

        <MotionBlock
          className="flex flex-col items-center px-5 pt-8"
          delay={0.12}
          as="section"
          variant="scale"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.15 }}
          >
            <UserAvatar user={user} size="lg" className="ring-4 ring-white" />
            {avatarBusy ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-xs font-semibold text-white">
                ...
              </div>
            ) : null}
          </motion.div>

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
              {t("profile.changePhoto")}
            </button>
            {user.avatarUrl ? (
              <button
                type="button"
                disabled={avatarBusy}
                onClick={() => setRemoveOpen(true)}
                className="h-10 rounded-2xl bg-white px-4 text-sm font-semibold text-cs-muted ring-1 ring-cs-line disabled:opacity-60"
              >
                {t("profile.removePhoto")}
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
        </MotionBlock>

        <MotionBlock as="form" className="mt-8 space-y-5 px-5" delay={0.22} onSubmit={handleSave}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-cs-ink">
              {t("profile.displayName")}
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("profile.displayNamePlaceholder")}
              className="h-13 w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-sm text-cs-ink outline-none ring-1 ring-cs-line transition placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-semibold text-cs-ink">
              <span>{t("profile.bio")}</span>
              <span className="text-xs font-normal text-cs-muted">
                {formatDigits(bio.length, locale)}
                /
                {formatDigits(280, locale)}
              </span>
            </span>
            <textarea
              rows={4}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("profile.bioPlaceholder")}
              className="w-full resize-none rounded-2xl border-0 bg-white px-4 py-3.5 text-sm leading-7 text-cs-ink outline-none ring-1 ring-cs-line transition placeholder:text-cs-muted focus:ring-cs-blue/30"
            />
          </label>

          <motion.button
            type="submit"
            disabled={saving || !dirty || fullName.trim().length < 2}
            className="h-14 w-full rounded-2xl bg-cs-blue text-base font-bold text-white shadow-[0_12px_28px_rgba(31,79,196,0.28)] transition disabled:cursor-not-allowed disabled:opacity-50"
            whileTap={dirty ? { scale: 0.98 } : undefined}
          >
            {saving ? t("profile.saving") : t("profile.save")}
          </motion.button>
        </MotionBlock>

        <MotionBlock className="mt-6 space-y-3 px-5" delay={0.3} as="section">
          {showA2hs ? (
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-cs-blue to-[#1542b0] p-4 text-white shadow-[0_12px_28px_rgba(30,85,214,0.28)]"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 text-start">
                  <p className="text-sm font-bold">{t("a2hs.profileTitle")}</p>
                  <p className="mt-1 text-xs leading-5 text-white/80">
                    {t("a2hs.profileDesc")}
                  </p>
                </div>
                <Link
                  href="/add-to-home"
                  className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-cs-blue"
                >
                  {t("a2hs.profileCta")}
                </Link>
              </div>
            </motion.div>
          ) : null}

          <motion.div
            className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-start">
                <p className="text-sm font-bold text-cs-ink">
                  {t("profile.languageTitle")}
                </p>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {t("profile.languageDesc")}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(21,32,56,0.06)] ring-1 ring-cs-line"
            whileHover={{ y: -2 }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 text-start">
                <p className="text-sm font-bold text-cs-ink">
                  {t("profile.themeTitle")}
                </p>
                <p className="mt-1 text-xs leading-5 text-cs-muted">
                  {t("profile.themeDesc")}
                </p>
              </div>
              <ThemeSwitcher className="self-start sm:self-auto" />
            </div>
          </motion.div>
        </MotionBlock>

        <MotionBlock className="mt-6 px-5" delay={0.36}>
          <motion.button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-red-500 ring-1 ring-cs-line"
            whileTap={{ scale: 0.98 }}
          >
            <IconLogout className="size-5" />
            {t("profile.logout")}
          </motion.button>
        </MotionBlock>

        <BottomNav activeId="profile" onUploadSuccess={refresh} />
      </div>

      <ConfirmModal
        open={removeOpen}
        title={t("profile.removeAvatarTitle")}
        message={t("profile.removeAvatarMessage")}
        confirmLabel={t("profile.removeAvatarConfirm")}
        cancelLabel={t("common.cancel")}
        tone="danger"
        loading={avatarBusy}
        onCancel={() => {
          if (!avatarBusy) setRemoveOpen(false);
        }}
        onConfirm={confirmRemoveAvatar}
      />

      <ConfirmModal
        open={logoutOpen}
        title={t("profile.logoutTitle")}
        message={t("profile.logoutMessage")}
        confirmLabel={t("profile.logoutConfirm")}
        cancelLabel={t("common.cancel")}
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
