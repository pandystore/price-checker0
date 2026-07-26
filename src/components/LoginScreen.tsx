import { useState } from "react";
import type { Theme, User } from "../types";
import { hashPassword } from "../utils/auth";

interface Props {
  theme: Theme;
  users: User[];
  onSuccess: (user: User) => void;
}

export default function LoginScreen({ theme, users, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const uname = username.trim();
    if (!uname || !password) {
      setErr("أدخل اسم المستخدم وكلمة المرور");
      return;
    }
    setBusy(true);
    const hash = await hashPassword(password);
    const user = users.find((u) => u.username === uname);
    setBusy(false);
    if (!user || user.passwordHash !== hash) {
      setErr("بيانات الدخول غير صحيحة");
      return;
    }
    if (user.blocked) {
      setErr("تم حظر هذا الحساب من الدخول");
      return;
    }
    onSuccess(user);
  }

  return (
    <div className="dots-bg relative flex min-h-screen flex-col items-center justify-center bg-[#fffdf5] px-4">
      <div className="text-5xl">🔐</div>
      <h1
        className="mt-3 font-changa text-2xl font-extrabold"
        style={{ color: theme.primaryColor }}
      >
        {theme.shopName}
      </h1>
      <p className="mt-1 font-cairo text-sm font-semibold text-neutral-500">
        سجّل الدخول للمتابعة إلى كاشف الأسعار
      </p>

      <div className="paper-sm mt-6 w-full max-w-xs rounded-xl border-2 border-black bg-white p-4">
        <label className="mb-3 block">
          <span className="mb-1 block font-cairo text-xs font-bold text-neutral-600">
            اسم المستخدم
          </span>
          <input
            value={username}
            autoFocus
            onChange={(e) => {
              setUsername(e.target.value);
              setErr(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 font-cairo text-sm font-semibold text-black outline-none focus:bg-[#fffdf5]"
            placeholder="اسم المستخدم"
          />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block font-cairo text-xs font-bold text-neutral-600">
            كلمة المرور
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-lg border-2 border-black bg-white px-3 py-2 font-cairo text-sm font-semibold text-black outline-none focus:bg-[#fffdf5]"
            placeholder="••••••"
          />
        </label>

        {err && (
          <p className="mb-3 animate-shake font-cairo text-xs font-bold text-red-600">
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="btn-press w-full rounded-lg border-2 border-black bg-[#f59e0b] py-2.5 font-cairo text-sm font-extrabold text-black disabled:opacity-50"
        >
          {busy ? "جارٍ التحقق…" : "دخول"}
        </button>
      </div>
    </div>
  );
}
