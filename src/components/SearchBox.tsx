import { useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onClear: () => void;
  onOpenCamera: () => void;
  scanning: boolean;
}

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  onClear,
  onOpenCamera,
  scanning,
}: Props) {
  const lastKey = useRef<number>(0);
  const fastRef = useRef(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const now = performance.now();
    const delta = now - lastKey.current;
    lastKey.current = now;
    if (delta > 0 && delta < 30) fastRef.current = true;

    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(value.trim());
      fastRef.current = false;
    }
  }

  const isEmpty = value.trim().length === 0;

  return (
    <div className="mx-auto mt-4 w-full max-w-md px-3">
      <div className="paper relative flex items-center gap-2 rounded-2xl border-2 border-black bg-white p-2">
        {/* زوايا العدسة */}
        <span className="corner right-0 top-0 border-r-4 border-t-4" />
        <span className="corner left-0 top-0 border-l-4 border-t-4" />
        <span className="corner right-0 bottom-0 border-r-4 border-b-4" />
        <span className="corner left-0 bottom-0 border-l-4 border-b-4" />

        {/* أيقونة البحث */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#15803d]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M7 12h10" />
          </svg>
        </div>

        <input
          dir="ltr"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="امسح أو اكتب الكود…"
          className="min-w-0 flex-1 bg-transparent text-center font-changa text-lg font-bold tracking-wider text-black outline-none placeholder:text-neutral-400 placeholder:font-cairo placeholder:font-normal placeholder:text-sm placeholder:tracking-normal"
        />

        {/* مسح */}
        {value && (
          <button
            onClick={onClear}
            aria-label="مسح"
            className="btn-press flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-neutral-200 text-base font-bold text-black"
          >
            ✕
          </button>
        )}

        {/* الكاميرا */}
        <button
          onClick={onOpenCamera}
          aria-label="افتح الكاميرا"
          className="btn-press flex h-10 shrink-0 items-center gap-1 rounded-lg border-2 border-black px-2.5 font-changa text-sm font-bold text-white"
          style={{ backgroundColor: "#15803d" }}
        >
          {scanning ? (
            <span className="inline-block h-4 w-4 animate-spin-slow rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span className="text-base">📷</span>
          )}
        </button>
      </div>

      {/* خط المسح أسفل الحقل */}
      <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="absolute inset-y-0 w-1/3 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #16a34a, transparent)",
            animation: isEmpty ? "marquee 1.6s linear infinite" : "none",
            opacity: isEmpty ? 1 : 0.25,
          }}
        />
      </div>
    </div>
  );
}
