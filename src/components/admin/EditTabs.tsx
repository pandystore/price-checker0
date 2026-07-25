import { useState } from "react";
import type { Discount, Offer } from "../../types";
import type { StoreApi } from "../../hooks/useStore";
import { Btn, Field, SectionCard, TextInput, Toggle } from "./ui";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ===================== تبويب العروض ===================== */
export function OffersTab({ store }: { store: StoreApi }) {
  const { data, setOffers } = store;

  function update(id: string, patch: Partial<Offer>) {
    setOffers(data.offers.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  function remove(id: string) {
    setOffers(data.offers.filter((o) => o.id !== id));
  }
  function add() {
    setOffers([
      ...data.offers,
      {
        id: uid(),
        title: "عرض جديد",
        subtitle: "وصف العرض",
        emoji: "✨",
        color: "#2563eb",
      },
    ]);
  }

  return (
    <div>
      <SectionCard title="عروض الكاروسيل" icon="🎉">
        <p className="mb-2 font-cairo text-[11px] text-neutral-500">
          تظهر هذه العروض أسفل خانة البحث وتتبدّل تلقائيًا.
        </p>
        <div className="space-y-3">
          {data.offers.map((o) => (
            <div key={o.id} className="rounded-lg border-2 border-black bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  value={o.emoji}
                  onChange={(e) => update(o.id, { emoji: e.target.value })}
                  className="w-12 rounded-md border-2 border-black bg-white p-1.5 text-center text-lg"
                />
                <input
                  value={o.color}
                  onChange={(e) => update(o.id, { color: e.target.value })}
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border-2 border-black bg-white p-0.5"
                />
                <span className="flex-1 font-cairo text-xs font-bold text-neutral-500">
                  بطاقة عرض
                </span>
                <Btn variant="danger" onClick={() => remove(o.id)}>
                  🗑️
                </Btn>
              </div>
              <input
                value={o.title}
                onChange={(e) => update(o.id, { title: e.target.value })}
                placeholder="العنوان"
                className="mt-2 w-full rounded-md border-2 border-black px-2 py-1.5 font-changa text-sm font-bold"
              />
              <input
                value={o.subtitle}
                onChange={(e) => update(o.id, { subtitle: e.target.value })}
                placeholder="الوصف"
                className="mt-2 w-full rounded-md border-2 border-black px-2 py-1.5 font-cairo text-xs"
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Btn variant="gold" onClick={add}>
            ➕ إضافة عرض
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}

/* ===================== تبويب الخصومات ===================== */
export function DiscountsTab({ store }: { store: StoreApi }) {
  const { data, setDiscounts } = store;
  const groups = Array.from(new Set(data.products.map((p) => p.group).filter(Boolean)));
  const [newGroup, setNewGroup] = useState(groups[0] ?? "");
  const [newPct, setNewPct] = useState(10);

  function update(id: string, patch: Partial<Discount>) {
    setDiscounts(
      data.discounts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );
  }
  function remove(id: string) {
    setDiscounts(data.discounts.filter((d) => d.id !== id));
  }
  function add() {
    if (!newGroup) return;
    setDiscounts([
      ...data.discounts,
      { id: uid(), group: newGroup, percentage: newPct, active: true },
    ]);
  }

  return (
    <div>
      <SectionCard title="خصومات المجموعات" icon="🏷️">
        <p className="mb-2 font-cairo text-[11px] text-neutral-500">
          خصم عام على كل أصناف مجموعة معيّنة (مثل كل الأحذية بخصم 30%).
        </p>
        <div className="space-y-2">
          {data.discounts.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-2 rounded-lg border-2 border-black bg-white p-2"
            >
              <button
                onClick={() => update(d.id, { active: !d.active })}
                className={`h-9 w-9 shrink-0 rounded-md border-2 border-black font-bold ${
                  d.active ? "bg-[#16a34a] text-white" : "bg-neutral-200 text-neutral-500"
                }`}
                title={d.active ? "مفعّل" : "معطّل"}
              >
                {d.active ? "✓" : "○"}
              </button>
              <span className="flex-1 font-changa text-sm font-extrabold">{d.group}</span>
              <input
                type="number"
                value={d.percentage}
                onChange={(e) =>
                  update(d.id, { percentage: Math.max(0, Math.min(100, +e.target.value)) })
                }
                className="w-16 rounded-md border-2 border-black px-2 py-1 text-center font-changa font-bold"
              />
              <span className="font-cairo text-sm font-bold">%</span>
              <Btn variant="danger" onClick={() => remove(d.id)}>
                🗑️
              </Btn>
            </div>
          ))}
          {data.discounts.length === 0 && (
            <p className="rounded-lg bg-neutral-100 p-3 text-center font-cairo text-xs text-neutral-400">
              لا توجد خصومات. أضف خصمًا لمجموعة بالأسفل.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="إضافة خصم جديد" icon="➕">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[140px] flex-1">
            <Field label="المجموعة">
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full rounded-lg border-2 border-black bg-white px-2 py-2 font-cairo text-sm font-bold"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                {groups.length === 0 && <option value="عام">عام</option>}
              </select>
            </Field>
          </div>
          <div className="w-24">
            <Field label="النسبة %">
              <TextInput
                type="number"
                value={newPct}
                onChange={(e) => setNewPct(Math.max(0, Math.min(100, +e.target.value)))}
              />
            </Field>
          </div>
          <Btn variant="gold" onClick={add}>
            إضافة
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}

/* ===================== تبويب الإعدادات ===================== */
export function SettingsTab({
  store,
  onClose,
  onOpenGithubGuide,
}: {
  store: StoreApi;
  onClose: () => void;
  onOpenGithubGuide?: () => void;
}) {
  const { data, setSettings, resetAll } = store;
  const s = data.settings;
  const [pwd, setPwd] = useState(s.adminPassword);
  const [pwd2, setPwd2] = useState("");

  function savePwd() {
    if (pwd.length < 3) {
      alert("كلمة المرور قصيرة جدًا (3 أحرف على الأقل).");
      return;
    }
    setSettings({ ...s, adminPassword: pwd });
    alert("تم حفظ كلمة المرور الجديدة ✅");
  }

  return (
    <div>
      {/* زر شرح ربط GitHub */}
      {onOpenGithubGuide && (
        <div className="mb-4">
          <button
            onClick={onOpenGithubGuide}
            className="btn-press flex w-full items-center justify-center gap-3 rounded-xl border-[3px] border-[#2563eb] bg-[#eff6ff] py-3.5 font-[Cairo] text-base font-extrabold text-[#1d4ed8]"
          >
            📚 شرح ربط GitHub — مزامنة البيانات بين الأجهزة
          </button>
        </div>
      )}

      <SectionCard title="عرض السعر" icon="⏱️">
        <Field label={`مدة ظهور السعر: ${s.displayDuration} ثانية`}>
          <input
            type="range"
            min={3}
            max={30}
            value={s.displayDuration}
            onChange={(e) =>
              setSettings({ ...s, displayDuration: +e.target.value })
            }
            className="w-full accent-[#15803d]"
          />
        </Field>
      </SectionCard>

      <SectionCard title="الأصوات" icon="🔊">
        <div className="space-y-2">
          <Toggle
            label="صوت عند إيجاد المنتج"
            checked={s.soundEnabled}
            onChange={(v) => setSettings({ ...s, soundEnabled: v })}
          />
          <Toggle
            label="صوت عند عدم وجود الكود"
            checked={s.errorSoundEnabled}
            onChange={(v) => setSettings({ ...s, errorSoundEnabled: v })}
          />
          <Toggle
            label="تقريب السعر لأقرب 5 جنيهات"
            checked={s.roundTo5}
            onChange={(v) => setSettings({ ...s, roundTo5: v })}
          />
        </div>
      </SectionCard>

      <SectionCard title="كلمة المرور" icon="🔑">
        <Field label="كلمة المرور الجديدة">
          <TextInput
            type="text"
            inputMode="numeric"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </Field>
        <Field label="تأكيد كلمة المرور">
          <TextInput
            type="text"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
          />
        </Field>
        <Btn
          variant="primary"
          onClick={() => {
            if (pwd !== pwd2) {
              alert("التأكيد غير مطابق.");
              return;
            }
            savePwd();
            setPwd2("");
          }}
        >
          حفظ كلمة المرور
        </Btn>
      </SectionCard>

      <SectionCard title="منطقة الخطر" icon="⚠️">
        <Btn
          variant="danger"
          onClick={() => {
            if (
              confirm(
                "إعادة ضبط كل البيانات للوضع الافتراضي؟ سيُفقد كل ما أضفته على هذا الجهاز.",
              )
            ) {
              resetAll();
              onClose();
            }
          }}
        >
          إعادة ضبط المصنع
        </Btn>
      </SectionCard>
    </div>
  );
}
