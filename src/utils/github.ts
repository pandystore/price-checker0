import type { GitHubConfig, StoreData } from "../types";

const API = "https://api.github.com";

function encodeBase64(text: string): string {
  // UTF-8 safe base64
  return btoa(unescape(encodeURIComponent(text)));
}
function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export interface SyncResult {
  ok: boolean;
  message: string;
}

/** يرفع data.json إلى مستودع GitHub (ينشئ أو يحدّث) */
export async function pushToGitHub(
  config: GitHubConfig,
  data: StoreData,
  message = "تحديث بيانات كاشف الأسعار",
): Promise<SyncResult> {
  if (!config.token || !config.owner || !config.repo) {
    return { ok: false, message: "أكمل بيانات GitHub (Token + المالك + المستودع)." };
  }
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;

  // جلب الـ sha إن كان الملف موجودًا مسبقًا
  let sha: string | undefined;
  try {
    const head = await fetch(url, {
      headers: { Authorization: `Bearer ${config.token}` },
    });
    if (head.ok) {
      const json = await head.json();
      sha = json.sha as string;
    }
  } catch {
    /* ملف جديد */
  }

  const content = encodeBase64(JSON.stringify(data, null, 2));
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message,
      content,
      sha,
      branch: config.branch,
    }),
  });

  if (res.ok) {
    return { ok: true, message: "تم رفع البيانات إلى GitHub بنجاح ✅" };
  }
  const err = await res.json().catch(() => ({}));
  return {
    ok: false,
    message: `فشل الرفع: ${err.message || res.statusText || res.status}`,
  };
}

/** يسحب data.json من مستودع GitHub */
export async function pullFromGitHub(
  config: GitHubConfig,
): Promise<{ data?: StoreData; message: string }> {
  if (!config.owner || !config.repo) {
    return { message: "أكمل بيانات GitHub (المالك + المستودع)." };
  }
  const url = `${API}/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
  try {
    const res = await fetch(url, {
      headers: config.token
        ? { Authorization: `Bearer ${config.token}` }
        : {},
    });
    if (!res.ok) {
      return { message: `تعذّر التنزيل: ${res.statusText || res.status}` };
    }
    const json = await res.json();
    const content = decodeBase64(json.content.replace(/\n/g, ""));
    const data = JSON.parse(content) as StoreData;
    return { data, message: "تم تنزيل البيانات من GitHub بنجاح ✅" };
  } catch (e) {
    return {
      message: `خطأ في الاتصال بـ GitHub: ${(e as Error).message}`,
    };
  }
}
