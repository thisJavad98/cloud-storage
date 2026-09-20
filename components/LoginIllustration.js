export function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="mx-auto h-auto w-full max-w-[280px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="186" rx="90" ry="10" fill="#12358c" opacity="0.5" />

      {/* arch doorway */}
      <path
        d="M108 186V96c0-36 24-58 52-58s52 22 52 58v90"
        stroke="#9ec0ff"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M120 186V98c0-28 18-46 40-46s40 18 40 46v88"
        fill="url(#glow)"
      />
      <defs>
        <linearGradient id="glow" x1="160" y1="52" x2="160" y2="186" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#8eb6ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* light rays */}
      <path d="M160 70l-18 40h36l-18-40Z" fill="#ffffff" opacity="0.55" />
      <path d="M160 78l-28 52h56l-28-52Z" fill="#dce8ff" opacity="0.35" />

      {/* person walking */}
      <circle cx="118" cy="112" r="14" fill="#ffd0b5" />
      <path d="M104 128c2-12 26-12 28 0v30H104v-30Z" fill="#ffffff" />
      <path d="M108 156l-8 28h12l4-28h-8Z" fill="#1b3f9a" />
      <path d="M124 156l6 28h12l-10-28h-8Z" fill="#1b3f9a" />
      <path d="M132 136l22 8-4 10-22-6v-12Z" fill="#ffd0b5" />
      <path d="M106 98c8-12 22-8 24 2-8 1-16 1-24-2Z" fill="#222" />

      {/* floating sparkles */}
      <circle cx="210" cy="78" r="3" fill="#fff" opacity="0.8" />
      <circle cx="228" cy="104" r="2" fill="#fff" opacity="0.7" />
      <circle cx="198" cy="120" r="2.5" fill="#fff" opacity="0.6" />
    </svg>
  );
}
