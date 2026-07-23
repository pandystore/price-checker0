import * as XLSX from "xlsx";
import type { Product } from "../types";

const HEADERS = {
  itemCode: "كود الصنف",
  merchantCode: "كود التاجر",
  name: "اسم المنتج",
  unit: "الوحدة",
  price: "سعر البيع",
  originalPrice: "السعر قبل الخصم",
  group: "المجموعة",
};

/** يحمل قالب Excel فارغ مع رؤوس عربية وصف مثال */
export function downloadTemplate() {
  const sample = [
    { ...HEADERS },
    {
      [HEADERS.itemCode]: "62210008",
      [HEADERS.merchantCode]: "M-108",
      [HEADERS.name]: "حذاء رياضي خفيف",
      [HEADERS.unit]: "زوج",
      [HEADERS.price]: 480,
      [HEADERS.originalPrice]: 550,
      [HEADERS.group]: "أحذية",
    },
  ];
  const ws = XLSX.utils.json_to_sheet(sample);
  ws["!cols"] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 26 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "الأصناف");
  XLSX.writeFile(wb, "قالب_الاصناف.xlsx");
}

/** يحوّل سطر من الجدول إلى منتج بصرف النظر عن ترتيب الأعمدة */
function rowToProduct(row: Record<string, unknown>): Product {
  /** يزيل المسافات الزائدة والتمييز من نص العمود */
  function norm(s: string) {
    return s.trim().replace(/\s+/g, " ").toLowerCase();
  }

  const get = (...keys: string[]) => {
    for (const k of Object.keys(row)) {
      const n = norm(k);
      // ابحث عن أي مفتاح يطابق (تطابق تام أو جزئي)
      if (keys.some((kk) => n === kk || n.includes(kk) || kk.includes(n))) {
        return row[k];
      }
    }
    return undefined;
  };
  const toStr = (v: unknown) =>
    v === undefined || v === null ? "" : String(v).trim();
  const toNum = (v: unknown) => {
    const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  return {
    itemCode: toStr(get("كود الصنف", "itemcode", "item_code", "code", "كود", "باركود")),
    merchantCode: toStr(
      get("كود التاجر", "merchantcode", "merchant_code", "merchant", "كود التاجر", "كود تاجر", "vendor", "supplier", "suppliercode"),
    ),
    name: toStr(get("اسم المنتج", "name", "الاسم", "الصنف", "product")),
    unit: toStr(get("الوحدة", "unit", "وحدة")) || "حبة",
    price: toNum(get("سعر البيع", "price", "السعر", "سعر")),
    originalPrice: toNum(
      get("السعر قبل الخصم", "originalprice", "original_price", "قديم"),
    ),
    group: toStr(get("المجموعة", "group", "تصنيف", "category", "القسم")) || "عام",
  };
}

export interface ImportResult {
  products: Product[];
  errors: number;
}

/** يقرأ ملف Excel/CSV ويحوّله إلى مصفوفة منتجات */
export function parseProductsFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذّر قراءة الملف"));
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
          defval: "",
        });
        let errors = 0;
        const products: Product[] = [];
        for (const row of rows) {
          // تجاهل صف العناوين المكرّر
          const firstVal = Object.values(row)[0];
          if (
            typeof firstVal === "string" &&
            firstVal.includes("كود الصنف")
          ) {
            continue;
          }
          const p = rowToProduct(row);
          if (!p.name && !p.itemCode) {
            errors++;
            continue;
          }
          products.push(p);
        }
        resolve({ products, errors });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

/** يصدّر المنتجات الحالية كملف Excel */
export function exportProductsExcel(products: Product[]) {
  const rows = products.map((p) => ({
    [HEADERS.itemCode]: p.itemCode,
    [HEADERS.merchantCode]: p.merchantCode,
    [HEADERS.name]: p.name,
    [HEADERS.unit]: p.unit,
    [HEADERS.price]: p.price,
    [HEADERS.originalPrice]: p.originalPrice,
    [HEADERS.group]: p.group,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 26 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "الأصناف");
  XLSX.writeFile(wb, "الأصناف.xlsx");
}
