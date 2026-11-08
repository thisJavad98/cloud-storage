export default function PhoneFrame({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-[2.75rem] bg-[#121826] p-[0.55rem] shadow-[0_40px_80px_-30px_rgba(21,32,56,0.45),inset_0_0_0_1px_rgba(255,255,255,0.08)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-2.5">
        <span className="h-[1.15rem] w-[28%] rounded-full bg-black/80" aria-hidden />
      </div>
      <div className="relative aspect-[9/19.2] overflow-hidden rounded-[2.25rem] bg-[#eef2fb]">
        {children}
      </div>
    </div>
  );
}
