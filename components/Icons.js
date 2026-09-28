export function StorageRing({
  percent = 70,
  usedLabel,
  locale = "fa",
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const percentText =
    locale === "fa"
      ? String(percent).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
      : String(percent);
  const percentSuffix = locale === "fa" ? "٪" : "%";

  return (
    <div className="relative size-[88px] shrink-0">
      <svg viewBox="0 0 88 88" className="size-full -rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-lg font-extrabold leading-none tracking-wide">
          {percentText}
          {percentSuffix}
        </span>
        {usedLabel ? (
          <span className="mt-1.5 text-[10px] leading-none opacity-80">
            {usedLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function IconMenu({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.2 16.2 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFilters({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 7h16M7 12h10M10 17h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClose({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconEye({ open = false, className = "size-5" }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconArrow({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDots({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}

export function IconFolder({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3.2 8.1A2.3 2.3 0 0 1 5.5 5.8H9.1l1.7 1.7h7.7a2.3 2.3 0 0 1 2.3 2.3v7.4a2.3 2.3 0 0 1-2.3 2.3H5.5a2.3 2.3 0 0 1-2.3-2.3V8.1Z" />
    </svg>
  );
}

export function IconFolders({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* rear folder */}
      <path
        d="M6.2 5.2h3.6l1.35 1.35H18.2c.9 0 1.65.72 1.65 1.6v1.05"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.42"
      />
      <path
        d="M7.4 6.85h2.9l1.1 1.05h6.9c.72 0 1.3.55 1.3 1.22v.55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.28"
      />
      {/* front folder body */}
      <path
        d="M3.35 9.15c0-.95.77-1.72 1.72-1.72h3.55L10.2 9.1h8.55c.95 0 1.72.77 1.72 1.72v6.55c0 .95-.77 1.72-1.72 1.72H5.07c-.95 0-1.72-.77-1.72-1.72V9.15Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      {/* pocket / lid crease */}
      <path
        d="M3.35 11.05h17.12"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* file hints */}
      <path
        d="M7.2 14.2h5.4M7.2 16.35h3.6"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function IconIsland({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* distant wave */}
      <path
        d="M2.5 14.2c1.4-.7 2.7-1 4.1-1 1.6 0 2.7.55 4.2.55 1.4 0 2.7-.55 4.1-.55 1.4 0 2.8.4 4.6 1.15"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* mid wave */}
      <path
        d="M2.2 16.6c1.6-.85 3.1-1.25 4.7-1.25 1.7 0 2.9.65 4.5.65s2.9-.65 4.6-.65c1.6 0 3.2.5 5.3 1.35"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* front wave */}
      <path
        d="M2 19.2c1.8-1 3.5-1.45 5.3-1.45 1.85 0 3.15.7 4.9.7 1.8 0 3.15-.7 5-.7 1.7 0 3.4.55 5.6 1.5"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      {/* island landmass */}
      <path
        d="M7.4 13.6c.55-2.35 1.85-4.1 3.85-4.85 1.35-.5 2.55-.2 3.35.75.7.85.75 2.05.4 3.15-.9.55-2.05.85-3.5.85-1.55 0-2.85-.35-4.1-.9Z"
        fill="currentColor"
        opacity="0.92"
      />
      {/* sand rim */}
      <path
        d="M7.6 13.4c1.15.45 2.35.7 3.9.7 1.4 0 2.45-.25 3.35-.7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* palm trunk */}
      <path
        d="M13.05 9.1c.2-1.15.7-2.15 1.45-2.85"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      {/* palm fronds */}
      <path
        d="M14.5 6.3c-1.35-.55-2.35-1.35-2.7-1.85.95.55 1.85 1.2 2.7 1.85Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M14.5 6.3c1.25-.7 2.2-1.15 2.95-1.35-.55.75-1.45 1.25-2.95 1.35Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M14.5 6.3c.85.15 1.55.7 1.85 1.25-.55-.2-1.15-.4-1.85-1.25Z"
        fill="currentColor"
        opacity="0.65"
      />
      {/* tiny data chip / file on island */}
      <rect
        x="9.15"
        y="10.15"
        width="3.4"
        height="2.55"
        rx="0.45"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M9.55 11h2.55M9.55 11.85h1.7"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}

export function IconUser({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 19c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBell({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2h-15L6 16Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSettings({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 16.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 7.1l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLogout({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8l4 4-4 4M10 12h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FileGlyph({ tone = "orange" }) {
  const fill = tone === "blue" ? "#4d7cf0" : "#f29a4a";
  return (
    <div
      className="flex size-11 items-center justify-center rounded-xl"
      style={{ background: `${fill}22` }}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path
          d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
          fill={fill}
        />
        <path d="M14 3.5V8h4.5" fill="#fff" opacity="0.35" />
      </svg>
    </div>
  );
}

export function IconPlus({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUpload({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 16V5M12 5l-4 4M12 5l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconDownload({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 4v10M12 14l-4-4M12 14l4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconTrash({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEdit({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13 7l3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
