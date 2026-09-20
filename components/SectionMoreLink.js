import Link from "next/link";
import { IconArrow } from "./Icons";

export default function SectionMoreLink({
  href,
  label = "بیشتر",
  count,
  className = "",
}) {
  const countLabel =
    typeof count === "number" && count > 0
      ? String(count).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
      : null;

  return (
    <Link
      href={href}
      className={`group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-cs-blue-soft/80 pe-2.5 ps-3 text-cs-blue transition hover:bg-cs-blue hover:text-white active:scale-[0.97] ${className}`}
    >
      <span className="text-xs font-bold leading-none tracking-tight">
        {label}
      </span>
      {countLabel ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-cs-blue/12 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-cs-blue transition group-hover:bg-white/20 group-hover:text-white">
          {countLabel}
        </span>
      ) : null}
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-white/70 text-cs-blue shadow-sm transition group-hover:bg-white group-hover:text-cs-blue-deep">
        <IconArrow className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
      </span>
    </Link>
  );
}
