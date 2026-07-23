import type { Discount, PriceBreakdown, Product, Settings } from "../types";

/** يقرّب الرقم لأقرب مضاعف للقيمة (افتراضيًا 5 جنيهات) */
export function roundTo(value: number, step = 5): number {
  return Math.round(value / step) * step;
}

/**
 * يحسب السعر النهائي مع خصم المجموعة والتقريب.
 * المنطق:
 * - إن وُجد خصم مجموعة فعّال يطبّق على سعر المنتج الأصلي.
 * - وإلا يُستخدم سعر البيع الحالي، فإن كان يوجد originalPrice أعلى يظهر الخصم.
 */
export function computePrice(
  product: Product,
  discounts: Discount[],
  settings: Settings,
): PriceBreakdown {
  const unitPrice = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;

  const groupDiscount = discounts.find(
    (d) => d.active && d.group.trim() === product.group.trim(),
  );

  let finalPrice = unitPrice;
  let displayedOriginal = originalPrice > 0 ? originalPrice : unitPrice;
  let discountPercentage = 0;
  let groupApplied: string | null = null;

  if (groupDiscount) {
    discountPercentage = groupDiscount.percentage;
    finalPrice = displayedOriginal * (1 - groupDiscount.percentage / 100);
    groupApplied = groupDiscount.group;
  } else if (originalPrice > unitPrice) {
    discountPercentage = Math.round(
      ((originalPrice - unitPrice) / originalPrice) * 100,
    );
  }

  if (settings.roundTo5) {
    finalPrice = roundTo(finalPrice, 5);
  }
  finalPrice = Math.max(0, Math.round(finalPrice));

  const saved = Math.round(displayedOriginal - finalPrice);
  const hasDiscount = saved > 0;

  return {
    finalPrice,
    originalPrice: displayedOriginal,
    unitPrice,
    saved: hasDiscount ? saved : 0,
    discountPercentage,
    hasDiscount,
    groupApplied,
  };
}

/** يبحث عن منتج. يطابق كود الصنف أو كود التاجر بالضبط/بالبادئة أو الاسم جزئيًا. */
export function findProducts(query: string, products: Product[]): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const exact: Product[] = [];
  const partial: Product[] = [];

  for (const p of products) {
    const code = (p.itemCode || "").trim().toLowerCase();
    const merchant = (p.merchantCode || "").trim().toLowerCase();
    const name = (p.name || "").trim().toLowerCase();

    if (code === q || merchant === q) {
      exact.push(p);
    } else if (code === q || code.startsWith(q) || merchant.startsWith(q)) {
      partial.push(p);
    } else if (name.includes(q)) {
      partial.push(p);
    }
  }
  return [...exact, ...partial];
}

/** يFormatter السعر بالأرقام الإنجليزية */
export function formatEGP(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
