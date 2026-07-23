import { useRef, useState } from "react";
import type { StoreApi } from "../../hooks/useStore";
import {
  downloadTemplate,
  exportProductsExcel,
  parseProductsFromFile,
} from "../../utils/excel";
import { pullFromGitHub, pushToGitHub } from "../../utils/github";
import { Btn, ColorRow, Field, SectionCard, TextInput } from "./ui";

function downloadJSON(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("read error"));
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });
}

/* ===================== تبويب البيانات ===================== */
export function DataTab({ store }: { store: StoreApi }) {
  const { data, setProducts } = store;
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { products, errors } = await parseProductsFromFile(file);
      setProducts(products);
      setMsg(`✅ تم استيراد ${products.length} صنف${errors ? ` (${errors} صف تجاهل)` : ""}`);
    } catch (err) {
      setMsg(`❌ خطأ: ${(err as Error).message}`);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <SectionCard title="القالب والاستيراد" icon="📥">
        <div className="flex flex-wrap gap-2">
          <Btn variant="gold" onClick={downloadTemplate}>
            ⬇️ تحميل قالب Excel
          </Btn>
          <Btn onClick={() => fileRef.current?.click()}>📂 استيراد Excel</Btn>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFile}
            className="hidden"
          />
        </div>
        {msg && (
          <p className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 font-cairo text-xs font-bold text-black">
            {msg}
          </p>
        )}
        <p className="mt-2 font-cairo text-[11px] text-neutral-500">
          الأعمدة المطلوبة: كود الصنف، كود التاجر، اسم المنتج، الوحدة، سعر البيع،
          السعر قبل الخصم، المجموعة.
        </p>
      </SectionCard>

      <SectionCard title={`جدول الأصناف (${data.products.length})`} icon="📋">
        <div className="max-h-64 overflow-auto rounded-lg border-2 border-black">
          <table className="w-full border-collapse text-right font-cairo text-xs">
            <thead className="sticky top-0 bg-[#15803d] text-white">
              <tr>
                <th className="border-l border-black/20 p-1.5">الصنف</th>
                <th className="border-l border-black/20 p-1.5">المجموعة</th>
                <th className="border-l border-black/20 p-1.5">السعر</th>
                <th className="p-1.5">قبل الخصم</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p, i) => (
                <tr
                  key={i}
                  className={i % 2 ? "bg-[#fffdf5]" : "bg-white"}
                >
                  <td className="border-t border-black/10 p-1.5 font-bold">
                    {p.name || "—"}
                    <div className="text-[10px] font-normal text-neutral-400" dir="ltr">
                      {p.itemCode}
                    </div>
                  </td>
                  <td className="border-t border-black/10 p-1.5">{p.group}</td>
                  <td className="border-t border-black/10 p-1.5 font-bold text-[#15803d]">
                    {p.price}
                  </td>
                  <td className="border-t border-black/10 p-1.5 text-neutral-500">
                    {p.originalPrice || "—"}
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-400">
                    لا توجد أصناف بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="نسخ احتياطي" icon="💾">
        <div className="flex flex-wrap gap-2">
          <Btn
            variant="outline"
            onClick={() => exportProductsExcel(data.products)}
          >
            تصدير Excel
          </Btn>
          <Btn variant="outline" onClick={() => downloadJSON("data.json", data)}>
            تصدير JSON
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (confirm("مسح كل الأصناف؟ لا يمكن التراجع.")) {
                setProducts([]);
              }
            }}
          >
            مسح الكل
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}

/* ===================== تبويب المظهر ===================== */
const PRESETS: { name: string; primary: string; accent: string }[] = [
  { name: "سوبرماركت", primary: "#15803d", accent: "#f59e0b" },
  { name: "صيدلية", primary: "#0e7490", accent: "#f43f5e" },
  { name: "ملابس", primary: "#7c3aed", accent: "#f59e0b" },
  { name: "إلكترونيات", primary: "#1d4ed8", accent: "#22d3ee" },
  { name: "حلويات", primary: "#db2777", accent: "#fbbf24" },
];

export function AppearanceTab({ store }: { store: StoreApi }) {
  const { data, setTheme } = store;
  const t = data.theme;
  const logoRef = useRef<HTMLInputElement>(null);

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    setTheme({ ...t, shopLogo: url });
    if (logoRef.current) logoRef.current.value = "";
  }

  return (
    <div>
      <SectionCard title="هوية المحل" icon="🏪">
        <Field label="اسم المحل">
          <TextInput
            value={t.shopName}
            onChange={(e) => setTheme({ ...t, shopName: e.target.value })}
          />
        </Field>
        <Field label="لوجو المحل (اختياري)">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-2 border-black bg-neutral-100">
              {t.shopLogo ? (
                <img src={t.shopLogo} alt="logo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">🏪</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Btn variant="outline" onClick={() => logoRef.current?.click()}>
                رفع صورة
              </Btn>
              {t.shopLogo && (
                <Btn variant="danger" onClick={() => setTheme({ ...t, shopLogo: "" })}>
                  حذف
                </Btn>
              )}
            </div>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              onChange={onLogo}
              className="hidden"
            />
          </div>
        </Field>
      </SectionCard>

      <SectionCard title="الألوان" icon="🎨">
        <ColorRow
          label="اللون الأساسي"
          value={t.primaryColor}
          onChange={(v) => setTheme({ ...t, primaryColor: v })}
        />
        <ColorRow
          label="لون التمييز"
          value={t.accentColor}
          onChange={(v) => setTheme({ ...t, accentColor: v })}
        />
        <ColorRow
          label="لون الخلفية"
          value={t.bgColor}
          onChange={(v) => setTheme({ ...t, bgColor: v })}
        />
        <div className="mt-2">
          <span className="mb-1 block font-cairo text-xs font-bold text-neutral-600">
            قوالب جاهزة
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() =>
                  setTheme({ ...t, primaryColor: p.primary, accentColor: p.accent })
                }
                className="flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2 py-1 font-cairo text-[11px] font-bold"
              >
                <span
                  className="h-4 w-4 rounded-full border border-black"
                  style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.accent})` }}
                />
                {p.name}
              </button>
            ))}
          </div>
        </div>
        {/* معاينة */}
        <div className="mt-3 rounded-lg border-2 border-dashed border-black/40 p-3 text-center">
          <span className="font-cairo text-[11px] text-neutral-400">معاينة السعر</span>
          <div
            className="font-changa text-3xl font-extrabold"
            style={{ color: t.primaryColor }}
          >
            480{" "}
            <span className="text-base" style={{ color: t.accentColor }}>
              جنيه
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ===================== تبويب GitHub ===================== */
export function GithubTab({ store }: { store: StoreApi }) {
  const { data, setGithub } = store;
  const g = data.github;
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const ready = g.owner && g.repo;

  return (
    <div>
      <SectionCard title="ربط GitHub للمزامنة" icon="🔄">
        <p className="mb-3 rounded-lg bg-[#fffbeb] border-2 border-[#f59e0b] p-2 font-cairo text-[11px] font-semibold text-[#7c2d12]">
          تتيح المزامنة استخدام نفس البيانات على عدة أجهزة. أنشئ مستودعًا عامًا/خاصًا
          وPersonal Access Token من إعدادات GitHub ثم عبّئ البيانات.
        </p>
        <Field label="Personal Access Token" hint="يُحفظ محليًا على هذا الجهاز فقط.">
          <TextInput
            type="password"
            placeholder="ghp_..."
            value={g.token}
            onChange={(e) => setGithub({ ...g, token: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="مالك المستودع">
            <TextInput
              placeholder="username"
              value={g.owner}
              onChange={(e) => setGithub({ ...g, owner: e.target.value })}
            />
          </Field>
          <Field label="اسم المستودع">
            <TextInput
              placeholder="repo-name"
              value={g.repo}
              onChange={(e) => setGithub({ ...g, repo: e.target.value })}
            />
          </Field>
          <Field label="الفرع">
            <TextInput
              value={g.branch}
              onChange={(e) => setGithub({ ...g, branch: e.target.value })}
            />
          </Field>
          <Field label="مسار الملف">
            <TextInput
              value={g.path}
              onChange={(e) => setGithub({ ...g, path: e.target.value })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="عمليات المزامنة" icon="⬆️⬇️">
        <div className="flex flex-wrap gap-2">
          <Btn
            variant="gold"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const r = await pushToGitHub(g, data);
              setStatus(r.message);
              setBusy(false);
            }}
          >
            ⬆️ رفع البيانات (Push)
          </Btn>
          <Btn
            disabled={busy || !ready}
            onClick={async () => {
              setBusy(true);
              const r = await pullFromGitHub(g);
              if (r.data) {
                store.replaceAll(r.data);
                setStatus("تم استبدال البيانات المحلية بنسخة GitHub ✅");
              } else {
                setStatus(r.message);
              }
              setBusy(false);
            }}
          >
            ⬇️ تنزيل البيانات (Pull)
          </Btn>
        </div>
        {busy && (
          <p className="mt-2 font-cairo text-xs font-bold text-[#15803d]">
            جارٍ الاتصال بـ GitHub…
          </p>
        )}
        {status && (
          <p className="mt-2 rounded-lg bg-neutral-100 px-3 py-2 font-cairo text-xs font-bold text-black">
            {status}
          </p>
        )}
      </SectionCard>
    </div>
  );
}
