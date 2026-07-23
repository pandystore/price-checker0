import { useEffect, useState } from "react";
import type { Offer } from "../types";

interface Props {
  offers: Offer[];
}

export default function OffersCarousel({ offers }: Props) {
  const [index, setIndex] = useState(0);
  const count = offers.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  const current = offers[index];

  return (
    <div className="mx-auto mt-3 w-full max-w-md px-3">
      <div className="relative">
        <div
          key={current.id}
          className="paper animate-popin relative overflow-hidden rounded-2xl border-2 border-black p-4"
          style={{ backgroundColor: current.color }}
        >
          {/* نمط زخرفي */}
          <div className="pointer-events-none absolute -left-6 -top-8 text-8xl opacity-20">
            {current.emoji}
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white text-2xl">
              {current.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="rounded-md bg-black/15 px-1.5 py-0.5 text-[10px] font-extrabold text-white inline-block">
                عرض خاص
              </div>
              <h3 className="truncate font-changa text-lg font-extrabold leading-tight text-white drop-shadow">
                {current.title}
              </h3>
              <p className="truncate text-xs font-semibold text-white/90">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* نقاط المؤشر */}
        {count > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {offers.map((o, i) => (
              <button
                key={o.id}
                aria-label={`العرض ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full border border-black transition-all ${
                  i === index ? "w-6 bg-black" : "w-2 bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
