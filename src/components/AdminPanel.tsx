import { useEffect, useState } from "react";
import type { StoreApi } from "../hooks/useStore";
import { AppearanceTab, DataTab, GithubTab } from "./admin/DataTabs";
import { DiscountsTab, OffersTab, SettingsTab } from "./admin/EditTabs";

interface Props {
  open: boolean;
  onClose: () => void;
  store: StoreApi;
  onOpenGithubGuide?: () => void;
}

type TabId = "data" | "appearance" | "offers" | "discounts" | "settings" | "github";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "data", label: "البيانات", icon: "📋" },
  { id: "appearance", label: "المظهر", icon: "🎨" },
  { id: "offers", label: "العروض", icon: "🎉" },
  { id: "discounts", label: "الخصومات", icon: "🏷️" },
  { id: "settings", label: "الإعدادات", icon: "⚙️" },
  { id: "github", label: "GitHub", icon: "🔄" },
];

export default function AdminPanel({ open, onClose, store, onOpenGithubGuide }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState<TabId>("data");

  useEffect(() => {
    if (!open) {
      // إعادة القفل عند الإغلاق للأمان
      const t = setTimeout(() => {
        setUnlocked(false);
        setPwd("");
        setErr(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function tryUnlock() {
    if (pwd === store.data.settings.adminPassword) {
      setUnlocked(true);
      setErr(false);
    } else {
      setErr(true);
    }
  }

  return (
    <>
      {/* الخلفية المعتمة */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* الدرج */}
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-[#fffdf5] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between border-b-2 border-black bg-[#15803d] px-4 py-3 text-white">
          <h2 className="font-changa text-lg font-extrabold">⚙️ لوحة التحكم</h2>
          <button
            onClick={onClose}
            className="btn-press rounded-lg border-2 border-white bg-white px-3 py-1 font-cairo text-sm font-extrabold text-black"
          >
            إغلاق ✕
          </button>
        </div>

        {!unlocked ? (
          /* بوابة كلمة المرور */
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="text-6xl">🔐</div>
            <h3 className="mt-3 font-changa text-xl font-extrabold text-black">
              دخول لوحة التحكم
            </h3>
            <p className="mt-1 text-center font-cairo text-xs text-neutral-500">
              أدخل كلمة المرور للوصول إلى الإعدادات
            </p>
            <input
              type="password"
              inputMode="numeric"
              value={pwd}
              autoFocus
              onChange={(e) => {
                setPwd(e.target.value);
                setErr(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              placeholder="••••"
              className={`mt-4 w-full max-w-xs rounded-lg border-2 bg-white px-4 py-3 text-center font-changa text-2xl font-bold tracking-widest outline-none ${
                err ? "animate-shake border-red-500" : "border-black"
              }`}
            />
            {err && (
              <p className="mt-2 font-cairo text-sm font-bold text-red-600">
                كلمة المرور غير صحيحة
              </p>
            )}
            <button
              onClick={tryUnlock}
              className="btn-press mt-4 w-full max-w-xs rounded-lg border-2 border-black bg-[#f59e0b] py-3 font-cairo text-base font-extrabold text-black"
            >
              دخول
            </button>
          </div>
        ) : (
          <>
            {/* تبويبات */}
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b-2 border-black bg-white p-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-lg border-2 border-black px-3 py-1.5 font-cairo text-xs font-extrabold transition-colors ${
                    tab === t.id ? "bg-[#15803d] text-white" : "bg-white text-black"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* المحتوى */}
            <div className="flex-1 overflow-y-auto p-3">
              {tab === "data" && <DataTab store={store} />}
              {tab === "appearance" && <AppearanceTab store={store} />}
              {tab === "offers" && <OffersTab store={store} />}
              {tab === "discounts" && <DiscountsTab store={store} />}
              {tab === "settings" && (
                <SettingsTab store={store} onClose={onClose} onOpenGithubGuide={onOpenGithubGuide} />
              )}
              {tab === "github" && <GithubTab store={store} />}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
