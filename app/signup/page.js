"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import AuthShell from "../../components/AuthShell";
import { SignupIllustration } from "../../components/SignupIllustration";
import { useI18n } from "../../lib/i18n/I18nProvider";
import { notifyError, notifySuccess } from "../../lib/toast";
import { formatAuthError, signup } from "../../services/auth";

export default function SignupPage() {
  const router = useRouter();
  const { t, brandName } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await signup({ email, password, fullName });
      notifySuccess(t("auth.signupSuccess"));
      router.push("/dashboard");
    } catch (err) {
      notifyError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      mode="signup"
      title={t("auth.signupTo", { name: brandName })}
      backHref="/login"
      illustration={<SignupIllustration />}
      footer={
        <p className="mt-6 text-center text-sm leading-7 text-cs-muted">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="relative z-10 font-bold text-cs-blue">
            {t("auth.login")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-cs-ink">
            {t("auth.fullName")}
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("auth.fullNamePlaceholder")}
            className="h-13 w-full rounded-2xl border-0 bg-[#f1f3f8] px-4 py-3.5 text-sm text-cs-ink outline-none ring-1 ring-transparent transition placeholder:text-cs-muted focus:bg-white focus:ring-cs-blue/30"
          />
        </label>

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
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            className="h-13 w-full rounded-2xl border-0 bg-[#f1f3f8] px-4 py-3.5 text-left text-sm text-cs-ink outline-none ring-1 ring-transparent transition placeholder:text-cs-muted focus:bg-white focus:ring-cs-blue/30"
          />
        </label>

        <motion.button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-cs-blue text-base font-bold text-white transition hover:bg-cs-blue-deep disabled:cursor-not-allowed disabled:opacity-70"
          whileHover={{ y: loading ? 0 : -2 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? t("auth.submittingSignup") : t("auth.signup")}
        </motion.button>
      </form>
    </AuthShell>
  );
}
