import { customFetch, setAuthTokenGetter } from "@workspace/api-client-react";

const TOKEN_KEY = "ptf_access_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function initAuthTokenGetter() {
  setAuthTokenGetter(() => getStoredToken());
}

export async function loginWithEmail(email: string) {
  return customFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function logout() {
  const token = getStoredToken();
  if (token) {
    try {
      await customFetch("/api/auth/logout", { method: "POST" });
    } catch {}
  }
  clearStoredToken();
}
