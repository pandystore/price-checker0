import { useEffect, useRef, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import OffersCarousel from "./components/OffersCarousel";
import PriceResult from "./components/PriceResult";
import Scanner from "./components/Scanner";
import SearchBox from "./components/SearchBox";
import { useStore } from "./hooks/useStore";
import { shade } from "./utils/color";
import { computePrice, findProducts, formatEGP } from "./utils/pricing";
import { playError, playFound } from "./utils/sound";
import type { Product } from "./types";

interface ResultState {
  product: Product;
  breakdown: ReturnType<typeof computePrice>;
}

const FLOATY = [
  { t: "احذية -30%", c: "#dc2626", rot: -8 },
  { t: "وفرت 70 جنيه", c: "#15803d", rot: 6 },
  { t: "خصم خاص", c: "#2563eb", rot: -4 },
  { t: "اكواد", c: "#7c3aed", rot: 9 },
];

export default function App() {
  const store = useStore();
  const { data, replaceAll } = store;

  const [booted, setBooted] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Product[]>([]);
  const [result, setResult] = useState<ResultState | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const hideTimer = useRef<number | null>(null);
  const nfTimer = useRef<number | null>(null);
  const dataLoaded = useRef(false);

  // شاشة التحميل
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2400);
    return () => clearTimeout(t);
  }, []);

  // تحميل البيانات من data.json تلقائيا
  useEffect(() => {
    if (dataLoaded.current) return;
    dataLoaded.current = true;

    const base = window.location.pathname.replace(/\/[^/]*$/, "");
    const dataUrl = base + "/data.json";

    fetch(dataUrl + "?t=" + Date.now(), { cache: "no-store" })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("not found");
      })
      .then((remote: Partial<typeof data>) => {
        replaceAll(remote);
      })
      .catch(() => {
        /* data.json مش موجود — استخدام البيانات المحلية */
      });
  }, [replaceAll]);

  // البحث الحي أثناء الكتابة
  useEffect(() => {
    if (result) return;
    const q = query.trim();
    if (!q) {
      setMatches([]);
      setNotFound(null);
      return;
    }
    const t = setTimeout(() => {
      const m = findProducts(q, data.products);
      setMatches(m.slice(0, 6));
    }, 170);
    return () => clearTimeout(t);
  }, [query, data.products, result]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (nfTimer.current) clearTimeout(nfTimer.current);
    };
  }, []);

  function clearTimers() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function showProduct(p: Product) {
    clearTimers();
    setResult({ product: p, breakdown: computePrice(p, data.discounts, data.settings) });
    setMatches([]);
    setQuery("");
    setNotFound(null);
    setResultKey((k) => k + 1);
    if (data.settings.soundEnabled) playFound();
    hideTimer.current = window.setTimeout(
      () => setResult(null),
      data.settings.displayDuration * 1000,
    );
  }

  function submitSearch(q: string) {
    const code = q.trim();
    if (!code) return;
    const m = findProducts(code, data.products);
    if (m.length) {
      showProduct(m[0]);
    } else {
      setNotFound(code);
      setMatches([]);
      if (data.settings.errorSoundEnabled) playError();
      if (nfTimer.current) clearTimeout(nfTimer.current);
      nfTimer.current = window.setTimeout(() => setNotFound(null), 3500);
    }
  }

  function handleScanResult(text: string) {
    setShowScanner(false);
    submitSearch(text.trim());
  }

  function clearResult() {
    clearTimers();
    setResult(null);
  }

  const themeVars = {
    "--brand": data.theme.primaryColor,
    "--accent": data.theme.accentColor,
    "--brand-ink": shade(data.theme.primaryColor, -0.3),
    backgroundColor: data.theme.bgColor,
  } as React.CSSProperties;

  return (
    <div
      style={themeVars}
      className="dots-bg relative min-h-screen overflow-x-hidden"
    >
      <LoadingScreen visible={!booted} />

      {showScanner && (
        <Scanner onResult={handleScanResult} onClose={() => setShowScanner(false)} />
      )}

      <Header theme={data.theme} />

      <OffersCarousel offers={data.offers} />

      {result ? (
        <PriceResult
          product={result.product}
          breakdown={result.breakdown}
          theme={data.theme}
          duration={data.settings.displayDuration}
          runKey={resultKey}
          onClose={clearResult}
        />
      ) : (
        <div className="mx-auto w-full max-w-md px-3 pb-28">
          <SearchBox
            value={query}
            onChange={setQuery}
            onSubmit={submitSearch}
            onClear={() => {
              setQuery("");
              setMatches([]);
              setNotFound(null);
            }}
            onOpenCamera={() => setShowScanner(true)}
            scanning={showScanner}
          />

          {matches.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {matches.map((p, i) => (
                <button
                  key={i}
                  onClick={() => showProduct(p)}
                  className="animate-slidedown paper-sm btn-press flex w-full items-center gap-2 rounded-xl border-2 border-black bg-white p-2.5 text-right"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black text-sm font-extrabold text-white"
                    style={{ backgroundColor: data.theme.primaryColor }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-[Changa] text-sm font-bold text-black">
                      {p.name}
                    </span>
                    <span className="block font-[Cairo] text-[11px] text-neutral-400" dir="ltr">
                      {p.itemCode} · {p.group}
                    </span>
                  </span>
                  <span className="shrink-0 font-[Changa] text-base font-extrabold text-[#15803d]">
                    {formatEGP(computePrice(p, data.discounts, data.settings).finalPrice)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {notFound && (
            <div className="animate-shake paper-sm mt-2 rounded-xl border-2 border-red-500 bg-white p-4 text-center">
              <div className="text-3xl">🚫</div>
              <p className="mt-1 font-[Changa] text-base font-extrabold text-red-600">
                لا يوجد صنف بهذا الكود
              </p>
              <p className="font-[Cairo] text-xs font-semibold text-neutral-500" dir="ltr">
                {notFound}
              </p>
            </div>
          )}

          {!query && matches.length === 0 && !notFound && (
            <div className="relative mt-6 flex flex-col items-center">
              <div className="relative h-28 w-full">
                {FLOATY.map((f, i) => (
                  <span
                    key={i}
                    className="animate-floaty absolute rounded-lg border-2 border-black px-2 py-1 font-[Changa] text-xs font-extrabold text-white"
                    style={{
                      background: f.c,
                      top: `${(i * 37) % 80}px`,
                      left: `${(i * 53) % 70}%`,
                      ["--rot" as string]: `${f.rot}deg`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    {f.t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* زر الإعدادات */}
      <button
        onClick={() => setAdminOpen(true)}
        aria-label="لوحة التحكم"
        className="btn-press fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center text-2xl"
        title="الإعدادات"
      >
        ⚙️
      </button>

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        store={store}
      />
    </div>
  );
}
