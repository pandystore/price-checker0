import type { ReactNode } from "react";

export function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-4 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0_rgba(0,0,0,0.85)]">
      <h3 className="mb-2 flex items-center gap-2 font-changa text-base font-extrabold text-black">
        <span className="text-lg">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block font-cairo text-xs font-bold text-neutral-600">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block font-cairo text-[11px] text-neutral-400">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border-2 border-black bg-white px-3 py-2 font-cairo text-sm font-semibold text-black outline-none focus:bg-[#fffdf5]";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border-2 border-black bg-white px-3 py-2"
    >
      <span className="font-cairo text-sm font-bold text-black">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full border-2 border-black transition-colors ${
          checked ? "bg-[#16a34a]" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full border border-black bg-white transition-all ${
            checked ? "right-0.5" : "right-[22px]"
          }`}
        />
      </span>
    </button>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "gold";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles: Record<string, string> = {
    primary: "bg-[#15803d] text-white",
    outline: "bg-white text-black",
    danger: "bg-red-600 text-white",
    gold: "bg-[#f59e0b] text-black",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-press rounded-lg border-2 border-black px-3 py-2 font-cairo text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-lg border-2 border-black bg-white px-3 py-2">
      <span className="font-cairo text-sm font-bold text-black">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-cairo text-xs font-mono text-neutral-500">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border-2 border-black bg-white p-0.5"
        />
      </div>
    </div>
  );
}
