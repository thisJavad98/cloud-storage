import { APP_NAME } from "../lib/brand";

export default function AppBrand({
  tone = "ink",
  size = "md",
  showLogo = true,
  stacked = false,
  className = "",
}) {
  const textClass =
    tone === "white"
      ? "text-white"
      : tone === "blue"
        ? "text-cs-blue"
        : "text-cs-ink";

  const logoClass =
    size === "lg" ? "size-11" : size === "sm" ? "size-8" : "size-9";

  const nameClass =
    size === "lg" ? "text-lg" : size === "sm" ? "text-[11px]" : "text-sm";

  return (
    <div
      className={`inline-flex ${
        stacked ? "flex-col gap-1" : "items-center gap-2"
      } ${className}`}
    >
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/icon.png"
          alt={APP_NAME}
          width={size === "lg" ? 44 : size === "sm" ? 32 : 36}
          height={size === "lg" ? 44 : size === "sm" ? 32 : 36}
          className={`${logoClass} object-contain ${stacked ? "mx-auto" : ""}`}
        />
      ) : null}
      <span
        className={`${nameClass} font-extrabold tracking-tight ${textClass} ${
          stacked ? "text-center leading-none" : ""
        }`}
      >
        {APP_NAME}
      </span>
    </div>
  );
}
