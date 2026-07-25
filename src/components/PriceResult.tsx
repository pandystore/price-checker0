import { useEffect, useState } from "react";
import type { PriceBreakdown, Product, Theme } from "../types";

/** يformatter السعر بالأرقام الإنجليزية (وليس العربية) */
function fmt(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

interface Props {
  product: Product;
  breakdown: PriceBreakdown;
  theme: Theme;
  duration: number;
  runKey: number;
  onClose: () => void;
}

export default function PriceResult({
  product,
  breakdown,
  theme,
  duration,
  runKey,
}: Props) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
    const start = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, duration - (Date.now() - start) / 1000);
      setRemaining(left);
      if (left <= 0) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [duration, runKey]);

  const pct = (remaining / duration) * 100;

  return (
    <div className="mx-auto mt-3 w-full max-w-md px-3">
      <div
        key={runKey}
        className="animate-popin relative rounded-t-2xl border-[3px] border-black bg-white"
        style={{ boxShadow: "8px 8px 0 rgba(0,0,0,0.92)" }}
      >
        {/* رأس الإيصال */}
        <div
          className="flex items-center justify-between rounded-t-xl border-b-[3px] border-black px-5 py-3 text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <span className="font-[Changa] text-base font-extrabold tracking-wide">
            {theme.shopName}
          </span>
          <span className="rounded-md bg-black/25 px-2.5 py-1 text-[11px] font-bold">
            🧾 إيصال السعر
          </span>
        </div>

        {/* جسم الإيصال */}
        <div className="relative px-5 pb-5 pt-5">

          {/* ختم الخصم الكبير */}
          {breakdown.hasDiscount && (
            <div className="animate-stamp pointer-events-none absolute -top-4 left-3 z-10 rotate-[-10deg]">
              <div className="rounded-2xl border-[4px] border-red-600 bg-white px-5 py-2.5 text-center shadow-xl">
                <div className="font-[Changa] text-xl font-extrabold leading-none text-red-600">
                  خصم
                </div>
                <div className="font-[Changa] text-2xl font-black leading-tight text-red-600">
                  <strong>{breakdown.discountPercentage}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* المجموعة + الوحدة */}
          <div className="flex items-center justify-center gap-2">
            {product.group && (
              <span
                className="rounded-xl border-[2px] border-black px-3 py-1 text-[12px] font-extrabold text-black"
                style={{ backgroundColor: theme.accentColor }}
              >
                {product.group}
              </span>
            )}
            <span className="rounded-xl border-2 border-black/20 bg-neutral-100 px-3 py-1 text-[12px] font-extrabold text-neutral-600">
              {product.unit}
            </span>
          </div>

          {/* اسم المنتج */}
          <h2 className="mt-3 text-center font-[Changa] text-2xl font-extrabold leading-tight tracking-wide text-black">
            {product.name}
          </h2>

          {/* الكود */}
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 text-center font-[Cairo] text-xs font-semibold text-neutral-400">
            {product.merchantCode && (
              <span className="rounded-md bg-neutral-100 px-2 py-0.5">
                كود تاجر: {product.merchantCode}
              </span>
            )}
            <span className="rounded-md bg-neutral-100 px-2 py-0.5" dir="ltr">
              كود صنف: {product.itemCode}
            </span>
          </div>

          {/* صندوق الأسعار الضخم */}
          <div className="relative mt-5 overflow-hidden rounded-2xl border-[3px] border-black bg-[#f8fafc] py-5">

            {/* السعر قبل الخصم */}
            {breakdown.hasDiscount && (
              <div className="mb-3 text-center">
                <span className="rounded-lg bg-red-100 px-4 py-1.5 font-[Cairo] text-base font-bold text-red-500 line-through">
                  السعر قبل الخصم: <strong>{fmt(breakdown.originalPrice)}</strong> جنيه
                </span>
              </div>
            )}

            {/* السعر النهائي — الضخم والعريض بالإنجليزية */}
            <div className="text-center">
              <div
                className="inline-flex items-baseline gap-2 font-[Changa] font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(3.5rem, 14vw, 5.5rem)", color: theme.primaryColor }}
              >
                <strong style={{ fontWeight: 900 }}>{fmt(breakdown.finalPrice)}</strong>
                <span className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold text-black">
                  جنيه
                </span>
              </div>
            </div>

            {/* وفّرت + النسبة */}
            {breakdown.hasDiscount && (
              <div className="mt-4 flex items-center justify-center gap-4">
                {/* وفّرت كام */}
                <div className="rounded-2xl border-[3px] border-green-600 bg-green-50 px-5 py-2.5 text-center">
                  <div className="font-[Cairo] text-[10px] font-extrabold uppercase tracking-wider text-green-700">
                    وفّرت
                  </div>
                  <div className="font-[Changa] text-2xl font-black leading-none text-green-700">
                    <strong>{fmt(breakdown.saved)}</strong>
                  </div>
                  <div className="font-[Cairo] text-[10px] font-bold text-green-500">
                    جنيه
                  </div>
                </div>

                {/* النسبة */}
                <div className="rounded-2xl border-[3px] border-red-600 bg-red-50 px-5 py-2.5 text-center">
                  <div className="font-[Cairo] text-[10px] font-extrabold uppercase tracking-wider text-red-700">
                    نسبة التوفير
                  </div>
                  <div className="font-[Changa] text-2xl font-black leading-none text-red-700">
                    <strong>{breakdown.discountPercentage}%</strong>
                  </div>
                  <div className="font-[Cairo] text-[10px] font-bold text-red-500">
                    خصم
                  </div>
                </div>
              </div>
            )}

            {/* إذا مفيش خصم — نُظهر السعر العادي بشكل واضح */}
            {!breakdown.hasDiscount && (
              <div className="mt-3 text-center">
                <span className="rounded-xl border-2 border-black/20 bg-neutral-200 px-4 py-1.5 font-[Cairo] text-sm font-extrabold text-neutral-600">
                  💰 سعر البيع النهائي
                </span>
              </div>
            )}

            {/* خصم مجموعة */}
            {breakdown.groupApplied && (
              <div className="mt-3 text-center">
                <span className="inline-block rounded-xl border-2 border-green-600 bg-green-50 px-4 py-1.5 font-[Cairo] text-xs font-extrabold text-green-700">
                  🎉 يشمل خصم مجموعة: {breakdown.groupApplied}
                </span>
              </div>
            )}
          </div>

          {/* شريط الوقت */}
          <div className="mt-4">
            <div className="h-2.5 overflow-hidden rounded-full border border-black/20 bg-neutral-200">
              <div
                className="h-full rounded-full transition-all duration-150 ease-linear"
                style={{
                  width: `${pct}%`,
                  backgroundColor: theme.primaryColor,
                }}
              />
            </div>
            <p className="mt-1.5 text-center font-[Cairo] text-[11px] font-semibold text-neutral-400">
              يختفي تلقائيًا خلال {Math.ceil(remaining)} ثانية
            </p>
          </div>
        </div>

        {/* الحافة الممزقة */}
        <div
          className="receipt-edge -mb-px h-3.5 w-full"
          style={{ backgroundColor: theme.primaryColor }}
        />
      </div>
    </div>
  );
}
