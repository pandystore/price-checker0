interface Props {
  visible: boolean;
}

const BARS = [
  { c: "#15803d", d: "0s" },
  { c: "#f59e0b", d: "0.12s" },
  { c: "#dc2626", d: "0.24s" },
  { c: "#2563eb", d: "0.36s" },
  { c: "#7c3aed", d: "0.48s" },
  { c: "#0891b2", d: "0.6s" },
];

export default function LoadingScreen({ visible }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fffdf5] transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="dots-bg absolute inset-0 opacity-60" />
      <div className="relative flex items-end gap-2 sm:gap-3">
        {BARS.map((b, i) => (
          <div
            key={i}
            className="w-5 rounded-t-md sm:w-7"
            style={{
              height: 90,
              backgroundColor: b.c,
              transformOrigin: "bottom",
              animation: "barload 1s ease-in-out infinite",
              animationDelay: b.d,
              boxShadow: "3px 3px 0 rgba(0,0,0,0.85)",
            }}
          />
        ))}
      </div>
      <div className="relative mt-8 text-center">
        <div className="text-5xl">🏷️</div>
        <h1 className="mt-3 font-changa text-3xl font-extrabold text-[#15803d]">
          كاشف الأسعار
        </h1>
        <p className="mt-1 font-cairo text-sm font-semibold text-[#7c2d12]">
          امسح الكود … يظهر السعر فورًا
        </p>
      </div>
    </div>
  );
}
