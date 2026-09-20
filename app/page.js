import Link from "next/link";
import { IntroIllustration } from "../components/IntroIllustration";
import { IconArrow } from "../components/Icons";

export default function IntroPage() {
  return (
    <main className="min-h-dvh bg-cs-blue">
      <div className="phone-shell flex flex-col bg-cs-blue px-7 pb-8 pt-10 text-white">
        <div className="animate-soft-float flex flex-1 items-center justify-center pt-6">
          <IntroIllustration />
        </div>

        <div className="mt-2 pb-6 text-center">
          <h1 className="animate-fade-up text-[2rem] font-extrabold tracking-tight">
            خوش آمدید
          </h1>
          <p className="animate-fade-up-delay mx-auto mt-4 max-w-[280px] text-[13px] leading-7 text-white/80">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است.
          </p>
        </div>

        <Link
          href="/login"
          className="animate-fade-up-delay-2 mt-auto inline-flex h-14 w-full items-center justify-between rounded-2xl bg-white px-5 text-cs-blue shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:bg-white/95"
        >
          <span className="text-base font-bold">شروع</span>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-cs-blue/10 text-cs-blue">
            <IconArrow className="size-5" />
          </span>
        </Link>
      </div>
    </main>
  );
}
