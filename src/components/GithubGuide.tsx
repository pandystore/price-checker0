interface Props {
  onClose: () => void;
}

export default function GithubGuide({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/70 p-4">
      <div className="mt-8 w-full max-w-lg rounded-2xl border-[3px] border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.9)]">
        {/* الرأس */}
        <div className="flex items-center justify-between rounded-t-xl border-b-[3px] border-black bg-[#15803d] px-5 py-3">
          <h2 className="font-[Changa] text-lg font-extrabold text-white">
            📚 دليل الربط مع GitHub — بالتفصيل
          </h2>
          <button
            onClick={onClose}
            className="btn-press rounded-lg border-2 border-white bg-white px-3 py-1 font-[Cairo] text-sm font-extrabold text-black"
          >
            ✕
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-5 font-[Cairo] text-sm text-black">

          {/* لماذا GitHub؟ */}
          <div className="mb-5 rounded-xl border-2 border-blue-400 bg-blue-50 p-3">
            <h3 className="mb-2 font-[Changa] text-base font-extrabold text-blue-700">
              💡 ليه أستخدم GitHub؟
            </h3>
            <p className="leading-relaxed text-blue-800">
              GitHub بيخليك تزامن بيانات المنتجات بين أكتر من جهاز (مثلاً: جهاز الكاشير +
              موبايل صاحب المحل + تابلت العرض). لما تغيّر产品在 في أي جهاز، أي جهاز تاني
              يقدر ينزّل التحديث فورًا.
            </p>
          </div>

          {/* الخطوات */}
          <h3 className="mb-3 font-[Changa] text-base font-extrabold text-black">
            📋 خطوات الربط — خطوة بخطوة:
          </h3>

          {/* الخطوة 1 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#f0fdf4] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#15803d] font-[Changa] text-sm font-extrabold text-white">
                1
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#15803d]">
                أنشئ حساب على GitHub
              </span>
            </div>
            <p className="leading-relaxed text-neutral-700">
              اذهب إلى{" "}
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-[#15803d]"
              >
                github.com/signup
              </a>{" "}
              وأنشئ حساب مجاني (اسم مستخدم وبريد وكلمة مرور).
            </p>
          </div>

          {/* الخطوة 2 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#fffbeb] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#f59e0b] font-[Changa] text-sm font-extrabold text-black">
                2
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#92400e]">
                أنشئ Repository (مستودع) جديد
              </span>
            </div>
            <ol className="ml-2 list-inside list-decimal space-y-1 leading-relaxed text-neutral-700">
              <li>بعد تسجيل الدخول، اضغط绿色的 "New" أو "New repository"</li>
              <li>
                <strong>Repository name:</strong> مثلاً{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">kashef-prices</code>
              </li>
              <li>
                اختار <strong>Private</strong> (خاص) أو <strong>Public</strong> (عام) —
                الحساب المجاني يسمح بالاثنين
              </li>
              <li>اضغط "Create repository" بدون تفعيل أي خيارات إضافية</li>
            </ol>
          </div>

          {/* الخطوة 3 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#eff6ff] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#2563eb] font-[Changa] text-sm font-extrabold text-white">
                3
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#1d4ed8]">
                أنشئ Personal Access Token
              </span>
            </div>
            <p className="mb-2 leading-relaxed text-neutral-700">
              الـ Token هو "مفتاح سري" يخلي التطبيق يقدر يقرأ ويكتب على المستودع من غير ما
              تدخل كلمة المرور كل مرة.
            </p>
            <ol className="ml-2 list-inside list-decimal space-y-1 leading-relaxed text-neutral-700">
              <li>
                اضغط على صورتك الشخصية في أعلى اليمين ←{" "}
                <strong>Settings</strong>
              </li>
              <li>
                من القائمة الجانبية:{" "}
                <strong>Developer settings</strong> (آخر خيار)
              </li>
              <li>
                اختار{" "}
                <strong>Personal access tokens</strong> ←{" "}
                <strong>Tokens (classic)</strong>
              </li>
              <li>
                اضغط{" "}
                <strong>Generate new token</strong> ←{" "}
                <strong>Generate new token (classic)</strong>
              </li>
              <li>
                أعطه اسم (مثلاً:{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  kashef-app
                </code>
                ) — اختار الصلاحية: <strong>repo</strong> (أول checkbox)
              </li>
              <li>
                اضغط <strong>Generate token</strong> — <strong>Important:</strong>{" "}
                انسخ الـ token فورًا لأنه هيختفي لما تخرج (
                <span className="font-bold text-red-600">
                  هيبدأ بـ ghp_
                </span>
                )
              </li>
            </ol>
          </div>

          {/* الخطوة 4 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#fdf4ff] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#7c3aed] font-[Changa] text-sm font-extrabold text-white">
                4
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#6d28d9]">
                املأ البيانات في التطبيق
              </span>
            </div>
            <p className="mb-2 leading-relaxed text-neutral-700">
              ادخل على لوحة التحكم ← تبويب{" "}
              <strong>GitHub</strong> واملأ:
            </p>
            <div className="space-y-1.5 text-neutral-700">
              <div className="flex items-center gap-2 rounded bg-white p-2 font-mono text-xs">
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 font-[Cairo] font-bold text-neutral-600">
                  Token
                </span>
                <span>← الـ token اللي نسخته (يبدأ بـ ghp_)</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white p-2 font-mono text-xs">
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 font-[Cairo] font-bold text-neutral-600">
                  Owner
                </span>
                <span>← اسم المستخدم اللي 注册ته على GitHub</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white p-2 font-mono text-xs">
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 font-[Cairo] font-bold text-neutral-600">
                  Repo
                </span>
                <span>← اسم المستودع اللي أنشأته (مثلاً: kashef-prices)</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white p-2 font-mono text-xs">
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 font-[Cairo] font-bold text-neutral-600">
                  Branch
                </span>
                <span>← اتركها main (الافتراضية)</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white p-2 font-mono text-xs">
                <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 font-[Cairo] font-bold text-neutral-600">
                  Path
                </span>
                <span>← اتركها data.json</span>
              </div>
            </div>
          </div>

          {/* الخطوة 5 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#fff1f2] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#e11d48] font-[Changa] text-sm font-extrabold text-white">
                5
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#be123c]">
                ارفع البيانات لأول مرة (Push)
              </span>
            </div>
            <p className="leading-relaxed text-neutral-700">
              بعد ما تملأ البيانات، اضغط زر{" "}
              <strong>⬆️ رفع البيانات (Push)</strong> — في أول مرة، GitHub هيطلب إذن
              (من الـ Token). بعد كده البيانات هتتحفظ في المستودع.
            </p>
          </div>

          {/* الخطوة 6 */}
          <div className="mb-4 rounded-xl border-2 border-black bg-[#f0fdf4] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#15803d] font-[Changa] text-sm font-extrabold text-white">
                6
              </span>
              <span className="font-[Changa] text-sm font-extrabold text-[#15803d]">
                على أي جهاز ثاني — استخدم نفس البيانات
              </span>
            </div>
            <p className="leading-relaxed text-neutral-700">
              افتح التطبيق ← لوحة التحكم ← GitHub ← املأ نفس البيانات (Token + Owner +
              Repo) ← اضغط{" "}
              <strong>⬇️ تنزيل البيانات (Pull)</strong> — وهتلاقي كل منتجاتك جاهزة!
            </p>
          </div>

          {/* ⚠️ ملاحظات مهمة */}
          <div className="rounded-xl border-2 border-red-400 bg-red-50 p-3">
            <h3 className="mb-2 font-[Changa] text-sm font-extrabold text-red-700">
              ⚠️ ملاحظات مهمة
            </h3>
            <ul className="ml-2 list-inside list-disc space-y-1 text-red-800">
              <li>
                الـ <strong>Token</strong> بيتخزّن محليًا على جهازك بس — مش بيترفع لأي
                سيرفر تاني.
              </li>
              <li>
                لو نسيت الـ token، اعمل واحد جديد من{" "}
                <strong>Settings → Developer settings</strong> واحذف القديم.
              </li>
              <li>
                المستودع <strong>Private</strong> معناه إن حد غيرك مش هينفع ي窥ه إلا لو
                أعطيته صلاحية.
              </li>
              <li>
                لو عندك بيانات على الجهاز وعملت <strong>Pull</strong>، البيانات اللي على
                GitHub هتستبدل البيانات المحلية — استخدم{" "}
                <strong>Pull</strong> بحذر!
              </li>
            </ul>
          </div>

          {/* زر إغلاق */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={onClose}
              className="btn-press rounded-xl border-[3px] border-black bg-[#15803d] px-8 py-3 font-[Cairo] text-base font-extrabold text-white"
            >
              فهمت! 👍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
