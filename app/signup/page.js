"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginIllustration } from "../../components/LoginIllustration";
import { IconArrow } from "../../components/Icons";
import { formatAuthError, signup } from "../../services/auth";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({ email, password, fullName });
      router.push("/dashboard");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh hex-pattern">
      <div className="phone-shell flex min-h-dvh flex-col">
        <div className="flex flex-1 items-center justify-center px-6 pb-2 pt-8">
          <LoginIllustration />
        </div>

        <section className="rounded-t-[2rem] bg-white px-6 pb-8 pt-7 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-6 flex items-center justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-cs-ink">ثبت‌نام</h1>
            <Link
              href="/login"
              className="inline-flex size-9 items-center justify-center rounded-full text-cs-blue"
              aria-label="بازگشت"
            >
              <IconArrow className="size-5" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cs-ink">
                نام و نام خانوادگی
              </span>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="نام خود را وارد کنید"
                className="w-full rounded-2xl bg-[#f1f3f8] px-4 py-3.5 text-sm outline-none placeholder:text-cs-muted focus:bg-white focus:ring-1 focus:ring-cs-blue/30"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cs-ink">
                ایمیل
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                className="w-full rounded-2xl bg-[#f1f3f8] px-4 py-3.5 text-left text-sm outline-none placeholder:text-right placeholder:text-cs-muted focus:bg-white focus:ring-1 focus:ring-cs-blue/30"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cs-ink">
                رمز عبور
              </span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۸ کاراکتر، شامل حرف و عدد"
                className="w-full rounded-2xl bg-[#f1f3f8] px-4 py-3.5 text-left text-sm outline-none placeholder:text-right placeholder:text-cs-muted focus:bg-white focus:ring-1 focus:ring-cs-blue/30"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-cs-blue text-base font-bold text-white hover:bg-cs-blue-deep disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-cs-muted">
            حساب دارید؟{" "}
            <Link href="/login" className="font-bold text-cs-blue">
              ورود
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
