"use client";

/** Minimal looping SVG scenes (GIF-like) for empty / loading moments. */
export function EmptyFoldersIllu({ className = "mx-auto h-auto w-40" }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={`empty-illu ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse className="empty-illu__shadow" cx="100" cy="126" rx="54" ry="7" fill="#1f4fc4" opacity="0.12" />
      <g className="empty-illu__float">
        <path
          d="M52 58h36l10 10h50c6 0 10 4 10 10v36c0 6-4 10-10 10H52c-6 0-10-4-10-10V68c0-6 4-10 10-10Z"
          fill="#fff4d4"
        />
        <path
          d="M52 58h36l10 10H52V58Z"
          fill="#f6c344"
        />
        <path
          d="M52 68h96c6 0 10 4 10 10v36c0 6-4 10-10 10H52c-6 0-10-4-10-10V78c0-6 4-10 10-10Z"
          fill="#f6c344"
        />
        <path d="M68 92h64" stroke="#e5a820" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        <path d="M68 104h40" stroke="#e5a820" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      </g>
      <g className="empty-illu__spark empty-illu__spark--a">
        <path d="M148 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#1f4fc4" opacity="0.55" />
      </g>
      <g className="empty-illu__spark empty-illu__spark--b">
        <circle cx="44" cy="42" r="3" fill="#f29a4a" opacity="0.7" />
      </g>
      <g className="empty-illu__spark empty-illu__spark--c">
        <circle cx="160" cy="78" r="2.5" fill="#4d7cf0" opacity="0.55" />
      </g>
    </svg>
  );
}

export function EmptyFilesIllu({ className = "mx-auto h-auto w-40" }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={`empty-illu ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse className="empty-illu__shadow" cx="100" cy="126" rx="50" ry="7" fill="#1f4fc4" opacity="0.12" />
      <g className="empty-illu__card empty-illu__card--back">
        <rect x="78" y="34" width="58" height="72" rx="10" fill="#d7e3ff" />
      </g>
      <g className="empty-illu__card empty-illu__card--mid">
        <rect x="68" y="40" width="58" height="72" rx="10" fill="#b8ccf8" />
      </g>
      <g className="empty-illu__float">
        <rect x="58" y="48" width="58" height="72" rx="10" fill="#ffffff" stroke="#e6e9f0" strokeWidth="2" />
        <rect x="70" y="64" width="34" height="5" rx="2.5" fill="#9db7ef" />
        <rect x="70" y="76" width="26" height="5" rx="2.5" fill="#c5d4f5" />
        <rect x="70" y="88" width="30" height="5" rx="2.5" fill="#c5d4f5" />
        <circle cx="98" cy="108" r="8" fill="#1f4fc4" opacity="0.15" />
        <path d="M94 108h8M98 104v8" stroke="#1f4fc4" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="empty-illu__spark empty-illu__spark--a">
        <path d="M150 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f29a4a" />
      </g>
      <g className="empty-illu__spark empty-illu__spark--b">
        <circle cx="42" cy="56" r="3" fill="#1f4fc4" opacity="0.45" />
      </g>
    </svg>
  );
}

export function LoadingCloudIllu({ className = "mx-auto h-auto w-28" }) {
  return (
    <svg
      viewBox="0 0 160 110"
      className={`empty-illu ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="empty-illu__float">
        <path
          d="M44 72c-12 0-22-9-22-20 0-10 7-18 17-20 3-14 15-24 30-24 14 0 26 9 30 21 2-1 4-1 6-1 12 0 22 9 22 21 0 1 0 2-.2 3H126c10 0 18 7 18 17S136 86 126 86H50c-12 0-22-6-22-14 0-1 0-1 .2-2H44Z"
          fill="#1f4fc4"
          opacity="0.9"
        />
        <path
          d="M52 68c-8 0-14-6-14-13 0-6 4-12 10-13 2-10 10-17 20-17 9 0 17 6 20 14h4c8 0 14 6 14 14 0 .5 0 1-.1 1.5H114c7 0 12 4 12 10s-5 10-12 10H56c-8 0-14-4-14-9 0-.5 0-1 .1-1.5H52Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>
      <g className="empty-illu__dots">
        <circle className="empty-illu__dot empty-illu__dot--a" cx="66" cy="72" r="3.5" fill="#1f4fc4" />
        <circle className="empty-illu__dot empty-illu__dot--b" cx="80" cy="72" r="3.5" fill="#1f4fc4" />
        <circle className="empty-illu__dot empty-illu__dot--c" cx="94" cy="72" r="3.5" fill="#1f4fc4" />
      </g>
    </svg>
  );
}
