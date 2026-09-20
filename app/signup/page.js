"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginIllustration } from "../../components/LoginIllustration";
import { IconArrow } from "../../components/Icons";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="min-h-dvh hex-pattern">
      <div className="phone-shell flex min-h-dvh flex-col">
        <div className="flex flex-1 items-center justify-center px-6 pb-2 pt-8">
          <LoginIllustration />
        </div>

        <section className="rounded-t-[2rem] bg-white px-6 pb-8 pt-7 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-cs-ink">ثبت‌نام</h1>
            <Link
              href="/login"
              className="inline-flex size-10 items-center justify-center rounded-full bg-cs-surface text-cs-blue"
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                className="w-full rounded-2xl bg-[#f1f3f8] px-4 py-3.5 text-sm outline-none placeholder:text-cs-muted focus:bg-white focus:ring-1 focus:ring-cs-blue/30"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className="w-full rounded-2xl bg-[#f1f3f8] px-4 py-3.5 text-sm outline-none placeholder:text-cs-muted focus:bg-white focus:ring-1 focus:ring-cs-blue/30"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-cs-blue text-base font-bold text-white hover:bg-cs-blue-deep"
            >
              ثبت‌نام
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
