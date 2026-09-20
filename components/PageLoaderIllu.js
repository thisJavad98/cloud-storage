"use client";

/** Looping SVG scene for the full-page loader. */
export function PageLoaderIllu({ className = "mx-auto h-auto w-full max-w-[220px]" }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className={`page-loader-illu ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
    >
      <defs>
        <linearGradient id="pl-cloud" x1="120" y1="28" x2="120" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d4e3ff" />
        </linearGradient>
        <linearGradient id="pl-ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4d7cf0" />
          <stop offset="1" stopColor="#1f4fc4" />
        </linearGradient>
        <filter id="pl-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0a1f66" floodOpacity="0.2" />
        </filter>
      </defs>

      <circle className="page-loader-illu__orb page-loader-illu__orb--a" cx="28" cy="40" r="16" fill="#1f4fc4" opacity="0.08" />
      <circle className="page-loader-illu__orb page-loader-illu__orb--b" cx="214" cy="36" r="22" fill="#f6c344" opacity="0.16" />
      <ellipse className="page-loader-illu__ground" cx="120" cy="164" rx="72" ry="8" fill="#1f4fc4" opacity="0.12" />

      {/* soft halo ring */}
      <circle
        className="page-loader-illu__halo"
        cx="120"
        cy="88"
        r="58"
        stroke="url(#pl-ring)"
        strokeWidth="2"
        strokeDasharray="8 10"
        opacity="0.35"
      />

      <g className="page-loader-illu__cloud" filter="url(#pl-shadow)">
        <path
          d="M72 88c0-16 12-28 28-28 4 0 8 1 12 3 5-10 16-17 29-17 19 0 34 14 34 33 0 1 0 2-.1 3h8c13 0 24 10 24 23s-11 23-24 23H80c-16 0-28-12-28-27 0-8 4-16 11-21 2-6 5-11 9-14Z"
          fill="url(#pl-cloud)"
        />
        <circle cx="120" cy="72" r="13" fill="#f6c344" />
        <path
          d="M114 72l4.2 4.2 8-8.5"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* upload beams */}
      <g className="page-loader-illu__beam" opacity="0.55">
        <path d="M120 104 L108 132 L132 132 Z" fill="#1f4fc4" opacity="0.18" />
        <path d="M120 108 L112 128 L128 128 Z" fill="#4d7cf0" opacity="0.28" />
      </g>

      {/* floating file cards */}
      <g className="page-loader-illu__card page-loader-illu__card--l" filter="url(#pl-shadow)">
        <rect x="18" y="78" width="40" height="50" rx="9" fill="#ffffff" stroke="#e6e9f0" strokeWidth="1.5" />
        <rect x="26" y="90" width="24" height="4" rx="2" fill="#9db7ef" />
        <rect x="26" y="100" width="16" height="4" rx="2" fill="#c5d4f5" />
        <rect x="26" y="110" width="20" height="4" rx="2" fill="#c5d4f5" />
      </g>
      <g className="page-loader-illu__card page-loader-illu__card--r" filter="url(#pl-shadow)">
        <rect x="182" y="70" width="40" height="50" rx="9" fill="#ffffff" stroke="#e6e9f0" strokeWidth="1.5" />
        <rect x="190" y="82" width="24" height="4" rx="2" fill="#f6c344" />
        <rect x="190" y="92" width="16" height="4" rx="2" fill="#f29a4a" opacity="0.55" />
        <rect x="190" y="102" width="20" height="4" rx="2" fill="#f6c344" opacity="0.4" />
      </g>

      {/* bouncing dots under cloud */}
      <g>
        <circle className="page-loader-illu__dot page-loader-illu__dot--a" cx="100" cy="142" r="4" fill="#1f4fc4" />
        <circle className="page-loader-illu__dot page-loader-illu__dot--b" cx="120" cy="142" r="4" fill="#4d7cf0" />
        <circle className="page-loader-illu__dot page-loader-illu__dot--c" cx="140" cy="142" r="4" fill="#1f4fc4" />
      </g>

      <path
        className="page-loader-illu__spark page-loader-illu__spark--a"
        d="M168 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        fill="#1f4fc4"
        opacity="0.7"
      />
      <path
        className="page-loader-illu__spark page-loader-illu__spark--b"
        d="M64 42l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6Z"
        fill="#f29a4a"
      />
      <circle className="page-loader-illu__spark page-loader-illu__spark--c" cx="188" cy="118" r="2.4" fill="#4d7cf0" opacity="0.55" />
    </svg>
  );
}
