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

async function authRequest(path: string, email: string, password: string) {
  const data = await customFetch<{ access_token: string; user: { id: string; email: string } }>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  setStoredToken(data.access_token);
  return data;
}

export function login(email: string, password: string) {
  return authRequest("/api/auth/login", email, password);
}

export function signup(email: string, password: string) {
  return authRequest("/api/auth/signup", email, password);
}

export async function logout() {
  try {
    await customFetch("/api/auth/logout", { method: "POST" });
  } catch {}
  clearStoredToken();
}
