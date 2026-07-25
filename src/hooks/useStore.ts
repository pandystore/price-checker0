import { useCallback, useEffect, useRef, useState } from "react";
import type { StoreData } from "../types";
import { DEFAULT_DATA } from "../utils/defaults";

const KEY = "kashef_prices_v1";

function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    // دمج آمن مع الافتراضي حتى لو نَقُصَت بعض الحقول
    return {
      products: parsed.products ?? DEFAULT_DATA.products,
      offers: parsed.offers ?? DEFAULT_DATA.offers,
      discounts: parsed.discounts ?? DEFAULT_DATA.discounts,
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
      theme: { ...DEFAULT_DATA.theme, ...parsed.theme },
      github: { ...DEFAULT_DATA.github, ...parsed.github },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function useStore() {
  const [data, setData] = useState<StoreData>(() => loadData());
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* تجاهل أخطاء التخزين */
    }
  }, [data]);

  const setProducts = useCallback(
    (products: StoreData["products"]) =>
      setData((d) => ({ ...d, products })),
    [],
  );
  const setOffers = useCallback(
    (offers: StoreData["offers"]) => setData((d) => ({ ...d, offers })),
    [],
  );
  const setDiscounts = useCallback(
    (discounts: StoreData["discounts"]) =>
      setData((d) => ({ ...d, discounts })),
    [],
  );
  const setSettings = useCallback(
    (settings: StoreData["settings"]) =>
      setData((d) => ({ ...d, settings })),
    [],
  );
  const setTheme = useCallback(
    (theme: StoreData["theme"]) => setData((d) => ({ ...d, theme })),
    [],
  );
  const setGithub = useCallback(
    (github: StoreData["github"]) => setData((d) => ({ ...d, github })),
    [],
  );

  /** يستبدل كل البيانات دفعة واحدة (يُستخدم في الاستيراد/Sync) */
  const replaceAll = useCallback(
    (incoming: Partial<StoreData>) =>
      setData((d) => ({
        products: incoming.products ?? d.products,
        offers: incoming.offers ?? d.offers,
        discounts: incoming.discounts ?? d.discounts,
        settings: { ...d.settings, ...incoming.settings },
        theme: { ...d.theme, ...incoming.theme },
        github: { ...d.github, ...incoming.github },
      })),
    [],
  );

  const resetAll = useCallback(() => setData(DEFAULT_DATA), []);

  return {
    data,
    setProducts,
    setOffers,
    setDiscounts,
    setSettings,
    setTheme,
    setGithub,
    replaceAll,
    resetAll,
  };
}

export type StoreApi = ReturnType<typeof useStore>;
