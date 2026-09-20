export function IntroIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="mx-auto h-auto w-full max-w-[300px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="198" rx="118" ry="12" fill="#163d9e" opacity="0.45" />
      <rect x="78" y="108" width="164" height="78" rx="10" fill="#2b5fd6" />
      <rect x="92" y="120" width="52" height="36" rx="4" fill="#9ec0ff" />
      <rect x="154" y="120" width="72" height="8" rx="4" fill="#6f93ea" />
      <rect x="154" y="136" width="56" height="8" rx="4" fill="#6f93ea" />
      <rect x="154" y="152" width="40" height="8" rx="4" fill="#6f93ea" />
      <rect x="70" y="182" width="180" height="10" rx="3" fill="#163d9e" />

      {/* plant */}
      <rect x="248" y="150" width="18" height="28" rx="3" fill="#2456c8" />
      <path
        d="M257 150c-10-18 2-34 2-34s14 14 6 34c-2 5-6 5-8 0Z"
        fill="#7dffb2"
      />
      <path
        d="M257 148c8-16-4-30-4-30s-12 16-2 32c2 4 5 3 6-2Z"
        fill="#4ad98a"
      />

      {/* person left */}
      <circle cx="70" cy="96" r="16" fill="#ffd0b5" />
      <path d="M54 116c2-14 30-14 32 0v34H54v-34Z" fill="#3d6fe0" />
      <rect x="52" y="148" width="14" height="34" rx="4" fill="#1b3f9a" />
      <rect x="74" y="148" width="14" height="34" rx="4" fill="#1b3f9a" />
      <path d="M58 88c8-14 24-8 26 2-10 2-18 2-26-2Z" fill="#2a2a2a" />

      {/* person center */}
      <circle cx="160" cy="78" r="18" fill="#ffc9a8" />
      <path d="M138 102c4-18 40-18 44 0v40H138v-40Z" fill="#ffffff" />
      <rect x="142" y="140" width="15" height="40" rx="4" fill="#1b3f9a" />
      <rect x="163" y="140" width="15" height="40" rx="4" fill="#1b3f9a" />
      <path d="M146 68c10-16 30-12 34 4-12 0-22 0-34-4Z" fill="#1f1f1f" />
      <rect x="148" y="108" width="24" height="14" rx="3" fill="#6ea0ff" />

      {/* person right */}
      <circle cx="248" cy="96" r="16" fill="#ffd0b5" />
      <path d="M232 116c2-14 30-14 32 0v34h-32v-34Z" fill="#ff8f6b" />
      <rect x="230" y="148" width="14" height="34" rx="4" fill="#1b3f9a" />
      <rect x="252" y="148" width="14" height="34" rx="4" fill="#1b3f9a" />
      <path d="M236 88c10-12 24-6 26 4-10 0-18 0-26-4Z" fill="#2a2a2a" />

      {/* floating docs */}
      <rect x="28" y="54" width="34" height="44" rx="6" fill="#ffffff" opacity="0.92" />
      <rect x="34" y="64" width="22" height="4" rx="2" fill="#9db7ef" />
      <rect x="34" y="74" width="16" height="4" rx="2" fill="#9db7ef" />
      <rect x="268" y="48" width="30" height="38" rx="6" fill="#ffffff" opacity="0.9" />
      <rect x="274" y="58" width="18" height="4" rx="2" fill="#9db7ef" />
      <rect x="274" y="68" width="12" height="4" rx="2" fill="#9db7ef" />
    </svg>
  );
}
