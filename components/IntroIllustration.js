"use client";

export function IntroIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      className="intro-illu mx-auto h-auto max-h-[min(38vh,240px)] w-full max-w-[300px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
    >
      <defs>
        <linearGradient id="intro-desk" x1="160" y1="108" x2="160" y2="196" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4d7ef0" />
          <stop offset="1" stopColor="#2a5fd4" />
        </linearGradient>
        <linearGradient id="intro-screen" x1="160" y1="118" x2="160" y2="168" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#dce8ff" />
        </linearGradient>
        <linearGradient id="intro-cloud" x1="160" y1="24" x2="160" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9dbff" />
        </linearGradient>
        <filter id="intro-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0a1f66" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ambient orbs */}
      <circle className="intro-illu__orb intro-illu__orb--a" cx="36" cy="48" r="20" fill="#ffffff" opacity="0.08" />
      <circle className="intro-illu__orb intro-illu__orb--b" cx="292" cy="64" r="26" fill="#ffffff" opacity="0.07" />

      {/* ground shadow */}
      <ellipse className="intro-illu__ground" cx="160" cy="218" rx="108" ry="10" fill="#0d2a74" opacity="0.4" />

      {/* floating cloud */}
      <g className="intro-illu__cloud" filter="url(#intro-shadow)">
        <path
          d="M108 70c0-16 12-28 28-28 4 0 8 1 12 3 5-10 16-17 29-17 19 0 34 14 34 33 0 1 0 2-.1 3h8c13 0 24 10 24 23s-11 23-24 23H116c-16 0-28-12-28-27 0-8 4-16 11-21 2-6 5-11 9-14Z"
          fill="url(#intro-cloud)"
        />
        <circle cx="160" cy="58" r="14" fill="#f6c344" />
        <path d="M154 58l4.5 4.5 8-9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* upload beam from cloud to desk */}
      <g className="intro-illu__beam" opacity="0.55">
        <path d="M160 88 L148 118 L172 118 Z" fill="#ffffff" opacity="0.35" />
        <path d="M160 92 L140 128 L180 128 Z" fill="#ffffff" opacity="0.18" />
      </g>

      {/* desk / device */}
      <g filter="url(#intro-shadow)">
        <rect x="72" y="118" width="176" height="72" rx="14" fill="url(#intro-desk)" />
        <rect x="86" y="130" width="148" height="48" rx="8" fill="url(#intro-screen)" />
        <rect x="98" y="140" width="36" height="28" rx="5" fill="#9ec0ff" />
        <rect x="144" y="142" width="70" height="6" rx="3" fill="#6f93ea" />
        <rect x="144" y="154" width="54" height="6" rx="3" fill="#8eabef" />
        <rect x="144" y="166" width="40" height="6" rx="3" fill="#a8c0f5" />
        <rect x="64" y="188" width="192" height="12" rx="4" fill="#163d9e" />
      </g>

      {/* plant */}
      <g className="intro-illu__plant">
        <rect x="252" y="158" width="16" height="26" rx="3" fill="#2456c8" />
        <path d="M260 158c-9-16 2-30 2-30s12 12 5 30c-1 4-5 4-7 0Z" fill="#7dffb2" />
        <path d="M260 156c7-14-3-28-3-28s-11 14-2 30c2 3 4 2 5-2Z" fill="#4ad98a" />
      </g>

      {/* people */}
      <g className="intro-illu__person intro-illu__person--l">
        <circle cx="64" cy="104" r="14" fill="#ffd0b5" />
        <path d="M50 92c8-12 22-8 24 2-8 1-16 1-24-2Z" fill="#222" />
        <path d="M48 122c2-12 28-12 30 0v28H48v-28Z" fill="#3d6fe0" />
        <rect x="48" y="148" width="12" height="28" rx="3" fill="#1b3f9a" />
        <rect x="66" y="148" width="12" height="28" rx="3" fill="#1b3f9a" />
      </g>

      <g className="intro-illu__person intro-illu__person--c">
        <circle cx="160" cy="86" r="16" fill="#ffc9a8" />
        <path d="M144 72c10-14 28-10 32 4-11 0-21 0-32-4Z" fill="#1f1f1f" />
        <path d="M140 108c3-16 38-16 42 0v34H140v-34Z" fill="#ffffff" />
        <rect x="146" y="118" width="28" height="12" rx="3" fill="#6ea0ff" />
        <rect x="144" y="140" width="13" height="32" rx="3" fill="#1b3f9a" />
        <rect x="163" y="140" width="13" height="32" rx="3" fill="#1b3f9a" />
      </g>

      <g className="intro-illu__person intro-illu__person--r">
        <circle cx="256" cy="104" r="14" fill="#ffd0b5" />
        <path d="M242 92c9-11 22-6 24 4-9 0-16 0-24-4Z" fill="#222" />
        <path d="M240 122c2-12 28-12 30 0v28h-30v-28Z" fill="#ff8f6b" />
        <rect x="240" y="148" width="12" height="28" rx="3" fill="#1b3f9a" />
        <rect x="258" y="148" width="12" height="28" rx="3" fill="#1b3f9a" />
      </g>

      {/* floating file cards (gif-like) */}
      <g className="intro-illu__card intro-illu__card--l" filter="url(#intro-shadow)">
        <rect x="18" y="52" width="40" height="50" rx="8" fill="#ffffff" />
        <rect x="26" y="64" width="24" height="4" rx="2" fill="#9db7ef" />
        <rect x="26" y="74" width="16" height="4" rx="2" fill="#9db7ef" />
        <rect x="26" y="84" width="20" height="4" rx="2" fill="#c5d4f5" />
      </g>
      <g className="intro-illu__card intro-illu__card--r" filter="url(#intro-shadow)">
        <rect x="264" y="42" width="38" height="46" rx="8" fill="#ffffff" />
        <rect x="272" y="54" width="22" height="4" rx="2" fill="#9db7ef" />
        <rect x="272" y="64" width="14" height="4" rx="2" fill="#9db7ef" />
        <rect x="272" y="74" width="18" height="4" rx="2" fill="#c5d4f5" />
      </g>

      {/* sparkles */}
      <path className="intro-illu__spark intro-illu__spark--a" d="M214 34l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#fff" />
      <path className="intro-illu__spark intro-illu__spark--b" d="M96 36l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6Z" fill="#fff" />
      <circle className="intro-illu__spark intro-illu__spark--c" cx="236" cy="96" r="2.4" fill="#fff" />
    </svg>
  );
}
