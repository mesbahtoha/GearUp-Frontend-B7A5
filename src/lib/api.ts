const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = RAW_API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  params?: Record<string, string | number | undefined>;
  isFormData?: boolean;
}

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
  refreshPromise = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
      if (!refreshToken) return null;
      const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.data?.accessToken) {
        setAccessToken(data.data.accessToken);
        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        return data.data.accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, params, isFormData } = options;

  const apiEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE}/api${apiEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") searchParams.append(key, String(value));
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const token = getAccessToken();
  const reqHeaders: Record<string, string> = { ...headers };
  if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
  if (!isFormData) reqHeaders["Content-Type"] = "application/json";

  const config: RequestInit = {
    method,
    headers: reqHeaders,
    credentials: "include",
  };
  if (body && !isFormData) config.body = JSON.stringify(body);
  else if (body && isFormData) config.body = body as FormData;

  let res = await fetch(url, config);

  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      reqHeaders["Authorization"] = `Bearer ${newToken}`;
      config.headers = reqHeaders;
      res = await fetch(url, config);
    }
  }

  const data = await res.json();

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | undefined>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "POST", body }),

  patch: <T>(endpoint: string, body?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "PATCH", body }),

  put: <T>(endpoint: string, body?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "PUT", body }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),

  postFormData: <T>(endpoint: string, body: FormData) =>
    request<T>(endpoint, { method: "POST", body, isFormData: true }),
};
