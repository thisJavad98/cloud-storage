"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppBrand from "../../components/AppBrand";
import { LoginIllustration } from "../../components/LoginIllustration";
import { IconArrow, IconEye } from "../../components/Icons";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { notifyError, notifySuccess } from "../../lib/toast";
import { formatAuthError, login } from "../../services/auth";

export default function LoginPage() {
  const router = useRouter();
  const { t, brandName } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      notifySuccess(t("auth.loginSuccess"));
      router.push("/dashboard");
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen hex-pattern">
      <div className="phone-shell flex h-full min-h-0 flex-col">
        <div className="animate-fade-in flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 pb-1 pt-6">
          <LoginIllustration />
        </div>

        <section className="animate-fade-in-delay shrink-0 rounded-t-[2rem] bg-white px-6 pb-8 pt-7 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-5 flex justify-center">
            <AppBrand size="sm" tone="blue" />
          </div>
          <div className="mb-7 flex items-center gap-3">
            <h1 className="text-2xl font-extrabold leading-none text-cs-ink">
              {t("auth.loginTo", { name: brandName })}
            </h1>
            <Link
              href="/"
              className="icon-label inline-flex size-9 shrink-0 items-center justify-center rounded-full text-cs-blue"
              aria-label={t("common.back")}
            >
              <IconArrow className="size-5" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cs-ink">
                {t("auth.email")}
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                className="h-13 w-full rounded-2xl border-0 bg-[#f1f3f8] px-4 py-3.5 text-left text-sm text-cs-ink outline-none ring-1 ring-transparent transition placeholder:text-cs-muted focus:bg-white focus:ring-cs-blue/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cs-ink">
                {t("auth.password")}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  className="h-13 w-full rounded-2xl border-0 bg-[#f1f3f8] py-3.5 ps-12 pe-4 text-left text-sm text-cs-ink outline-none ring-1 ring-transparent transition placeholder:text-cs-muted focus:bg-white focus:ring-cs-blue/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 start-0 flex w-12 items-center justify-center text-cs-muted"
                  aria-label={
                    showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                  }
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </label>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl bg-cs-blue text-base font-bold text-white transition hover:bg-cs-blue-deep disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? t("auth.submittingLogin") : t("auth.login")}
              </button>
              <button
                type="button"
                className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cs-surface text-cs-blue ring-1 ring-cs-line"
                aria-label={t("auth.googleLogin")}
              >
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.8 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12Z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm leading-7 text-cs-muted">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-bold text-cs-blue">
              {t("auth.signup")}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
