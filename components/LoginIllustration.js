"use client";

export function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="login-illu mx-auto h-auto max-h-[min(34vh,200px)] w-full max-w-[280px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
    >
      <defs>
        <linearGradient id="login-arch-glow" x1="160" y1="40" x2="160" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#c5d8ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8eb6ff" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="login-cloud" x1="160" y1="28" x2="160" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d7e4ff" />
        </linearGradient>
        <linearGradient id="login-ray" x1="160" y1="70" x2="160" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="login-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0b1f5c" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse className="login-illu__shadow" cx="160" cy="200" rx="96" ry="10" fill="#0d2a74" opacity="0.35" />

      {/* soft ambient orbs */}
      <circle className="login-illu__orb login-illu__orb--a" cx="48" cy="56" r="18" fill="#ffffff" opacity="0.08" />
      <circle className="login-illu__orb login-illu__orb--b" cx="278" cy="72" r="22" fill="#ffffff" opacity="0.07" />

      {/* cloud badge above doorway */}
      <g className="login-illu__cloud" filter="url(#login-soft-shadow)">
        <path
          d="M118 62c0-14 11-26 26-26 4 0 8 1 12 3 5-10 16-16 28-16 18 0 32 14 32 32 0 1 0 2-.1 3H226c12 0 22 9 22 21s-10 21-22 21H126c-14 0-26-11-26-25 0-8 4-15 10-20 2-6 5-10 8-12Z"
          fill="url(#login-cloud)"
        />
        <rect x="148" y="58" width="28" height="18" rx="3" fill="#6ea0ff" opacity="0.85" />
        <rect x="154" y="63" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.9" />
        <rect x="154" y="69" width="11" height="3" rx="1.5" fill="#ffffff" opacity="0.7" />
      </g>

      {/* arch doorway */}
      <path
        d="M100 196V98c0-38 26-62 60-62s60 24 60 62v98"
        stroke="#b8d0ff"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M114 196V100c0-30 20-48 46-48s46 18 46 48v96"
        fill="url(#login-arch-glow)"
      />
      <path
        d="M114 196V100c0-30 20-48 46-48s46 18 46 48v96"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* light rays from doorway */}
      <g className="login-illu__rays" opacity="0.55">
        <path d="M160 78 L132 168 L188 168 Z" fill="url(#login-ray)" />
        <path d="M160 86 L118 172 L202 172 Z" fill="url(#login-ray)" opacity="0.55" />
      </g>

      {/* floating file cards */}
      <g className="login-illu__card login-illu__card--left" filter="url(#login-soft-shadow)">
        <rect x="28" y="108" width="42" height="52" rx="8" fill="#ffffff" />
        <rect x="36" y="120" width="26" height="4" rx="2" fill="#9db7ef" />
        <rect x="36" y="130" width="18" height="4" rx="2" fill="#9db7ef" />
        <rect x="36" y="140" width="22" height="4" rx="2" fill="#c5d4f5" />
      </g>
      <g className="login-illu__card login-illu__card--right" filter="url(#login-soft-shadow)">
        <rect x="250" y="96" width="40" height="48" rx="8" fill="#ffffff" />
        <rect x="258" y="108" width="24" height="4" rx="2" fill="#9db7ef" />
        <rect x="258" y="118" width="16" height="4" rx="2" fill="#9db7ef" />
        <rect x="258" y="128" width="20" height="4" rx="2" fill="#c5d4f5" />
      </g>

      {/* person walking into the cloud */}
      <g className="login-illu__person">
        <circle cx="132" cy="118" r="15" fill="#ffd4ba" />
        <path d="M118 98c10-14 26-10 28 4-10 1-20 1-28-4Z" fill="#1f2433" />
        <path d="M116 136c3-14 30-14 32 0v28H116v-28Z" fill="#ffffff" />
        <path d="M120 162l-6 30h13l5-30h-12Z" fill="#1b3f9a" />
        <path d="M138 162l8 30h13l-9-30h-12Z" fill="#163d9e" />
        <path className="login-illu__arm" d="M146 142c10 2 22 10 24 14l-8 8c-4-4-14-10-20-12v-10Z" fill="#ffd4ba" />
        <circle cx="126" cy="116" r="1.6" fill="#5a3a2a" opacity="0.55" />
        <circle cx="136" cy="116" r="1.6" fill="#5a3a2a" opacity="0.55" />
        <path d="M128 122c2 2 6 2 8 0" stroke="#c4886a" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* sparkles */}
      <g className="login-illu__sparkles">
        <path className="login-illu__spark login-illu__spark--a" d="M214 84l2.2 5.2 5.2 2.2-5.2 2.2-2.2 5.2-2.2-5.2-5.2-2.2 5.2-2.2Z" fill="#ffffff" />
        <path className="login-illu__spark login-illu__spark--b" d="M236 112l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6Z" fill="#ffffff" />
        <circle className="login-illu__spark login-illu__spark--c" cx="204" cy="128" r="2.4" fill="#ffffff" />
        <circle className="login-illu__spark login-illu__spark--d" cx="92" cy="86" r="2" fill="#ffffff" />
      </g>
    </svg>
  );
}
