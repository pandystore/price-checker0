import type { Theme } from "../types";

interface Props {
  theme: Theme;
}

export default function Header({ theme }: Props) {
  return (
    <header className="mx-auto w-full max-w-md px-3 pt-4">
      <div
        className="paper flex items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3"
        style={{ ["--brand-ink" as string]: shadeFor(theme.primaryColor) }}
      >
        {/* يمين: اسم المحل + كاشف الأسعار — كلهم على اليمين */}
        <div className="min-w-0 flex-1" style={{ direction: "rtl" }}>
          <h1
            className="font-[Changa] text-lg font-extrabold leading-tight text-black"
            style={{ textAlign: "right" }}
          >
            {theme.shopName}
          </h1>
          <div className="mt-0.5" style={{ textAlign: "right" }}>
            <span
              className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-[Cairo] text-sm font-extrabold text-black"
              style={{ backgroundColor: theme.accentColor }}
            >
              🏷️ كاشف الأسعار
            </span>
          </div>
        </div>

        {/* يسار: اللوجو */}
        <div className="relative h-12 w-12 shrink-0">
          {theme.shopLogo ? (
            <img
              src={theme.shopLogo}
              alt="لوجو"
              className="h-12 w-12 object-contain"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center text-2xl"
              style={{ color: theme.primaryColor }}
            >
              🏪
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function shadeFor(hex: string): string {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `#${Math.max(0, num - 0x333333).toString(16).padStart(6, "0")}`;
}
