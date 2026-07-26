const SESSION_KEY = "kashef_session_v1";

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** جلسة الدخول محلية على هذا الجهاز فقط ولا تُرفع إلى GitHub أبدًا */
export function getSessionUsername(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUsername(username: string) {
  localStorage.setItem(SESSION_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
