"use client";

/** Looping SVG scene (GIF-like) for the plans page hero. */
export function PlansIllustration({ className = "mx-auto h-auto w-full max-w-[280px]" }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={`plans-illu ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
    >
      <defs>
        <linearGradient id="plans-cloud" x1="160" y1="20" x2="160" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d4e3ff" />
        </linearGradient>
        <linearGradient id="plans-tier-a" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#9ec0ff" />
          <stop offset="1" stopColor="#6f93ea" />
        </linearGradient>
        <linearGradient id="plans-tier-b" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#4d7cf0" />
          <stop offset="1" stopColor="#1f4fc4" />
        </linearGradient>
        <linearGradient id="plans-tier-c" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f6c344" />
          <stop offset="1" stopColor="#f29a4a" />
        </linearGradient>
        <filter id="plans-shadow" x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0a1f66" floodOpacity="0.22" />
        </filter>
      </defs>

      <circle className="plans-illu__orb plans-illu__orb--a" cx="34" cy="46" r="18" fill="#ffffff" opacity="0.1" />
      <circle className="plans-illu__orb plans-illu__orb--b" cx="290" cy="40" r="24" fill="#ffffff" opacity="0.08" />
      <ellipse className="plans-illu__ground" cx="160" cy="186" rx="100" ry="9" fill="#0d2a74" opacity="0.35" />

      <g className="plans-illu__cloud" filter="url(#plans-shadow)">
        <path
          d="M108 62c0-14 11-25 25-25 4 0 7 1 10 2 5-9 14-15 25-15 17 0 30 13 30 29 0 1 0 2 0 3h7c12 0 21 9 21 20s-9 20-21 20H115c-14 0-25-10-25-24 0-7 3-14 9-18 2-5 5-9 9-12Z"
          fill="url(#plans-cloud)"
        />
        <circle cx="160" cy="48" r="11" fill="#f6c344" />
        <path
          d="M155 48l3.5 3.5 6.5-7"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* storage bars rising like a GIF loop */}
      <g filter="url(#plans-shadow)">
        <g className="plans-illu__bar plans-illu__bar--a">
          <rect x="68" y="118" width="44" height="52" rx="10" fill="url(#plans-tier-a)" />
          <rect x="76" y="128" width="28" height="5" rx="2.5" fill="#fff" opacity="0.7" />
          <rect x="76" y="138" width="20" height="5" rx="2.5" fill="#fff" opacity="0.45" />
        </g>
        <g className="plans-illu__bar plans-illu__bar--b">
          <rect x="138" y="96" width="44" height="74" rx="10" fill="url(#plans-tier-b)" />
          <rect x="146" y="108" width="28" height="5" rx="2.5" fill="#fff" opacity="0.85" />
          <rect x="146" y="118" width="22" height="5" rx="2.5" fill="#fff" opacity="0.55" />
          <circle cx="160" cy="148" r="8" fill="#fff" opacity="0.2" />
          <path d="M160 143v10M155 148h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="plans-illu__bar plans-illu__bar--c">
          <rect x="208" y="108" width="44" height="62" rx="10" fill="url(#plans-tier-c)" />
          <rect x="216" y="120" width="28" height="5" rx="2.5" fill="#fff" opacity="0.8" />
          <rect x="216" y="130" width="18" height="5" rx="2.5" fill="#fff" opacity="0.5" />
        </g>
      </g>

      {/* floating file chips */}
      <g className="plans-illu__chip plans-illu__chip--l" filter="url(#plans-shadow)">
        <rect x="22" y="88" width="36" height="44" rx="8" fill="#ffffff" />
        <rect x="29" y="98" width="22" height="4" rx="2" fill="#9db7ef" />
        <rect x="29" y="108" width="14" height="4" rx="2" fill="#c5d4f5" />
        <rect x="29" y="118" width="18" height="4" rx="2" fill="#c5d4f5" />
      </g>
      <g className="plans-illu__chip plans-illu__chip--r" filter="url(#plans-shadow)">
        <rect x="262" y="78" width="36" height="44" rx="8" fill="#ffffff" />
        <rect x="269" y="88" width="22" height="4" rx="2" fill="#f6c344" />
        <rect x="269" y="98" width="14" height="4" rx="2" fill="#f29a4a" opacity="0.55" />
        <rect x="269" y="108" width="18" height="4" rx="2" fill="#f6c344" opacity="0.45" />
      </g>

      <path
        className="plans-illu__spark plans-illu__spark--a"
        d="M214 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        fill="#fff"
      />
      <path
        className="plans-illu__spark plans-illu__spark--b"
        d="M98 30l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6Z"
        fill="#fff"
      />
      <circle className="plans-illu__spark plans-illu__spark--c" cx="248" cy="96" r="2.4" fill="#fff" />
      <circle className="plans-illu__spark plans-illu__spark--d" cx="72" cy="74" r="2" fill="#f6c344" />
    </svg>
  );
}
