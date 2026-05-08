export async function customFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ptf_access_token") : null;
  
  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, data: errorData, message: errorData.error || response.statusText };
  }

  if (response.status === 204) return {} as T;
  return response.json();
}
