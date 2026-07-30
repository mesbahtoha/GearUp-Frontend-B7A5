import { api, setAccessToken, clearTokens } from "./api";
import type { IApiResponse, IAuthTokens, IUser } from "@/types";
import { useAuthStore } from "@/store/authStore";

export async function loginUser(email: string, password: string) {
  const res = await api.post<IApiResponse<IAuthTokens>>("/auth/login", { email, password });
  if (res.success && res.data) {
    setAccessToken(res.data.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", res.data.refreshToken);
      document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
    }
  }
  return res;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) {
  return api.post<IApiResponse<IUser>>("/users/register", data as Record<string, unknown>);
}

export function logoutUser() {
  useAuthStore.getState().setUser(null);
  api.post("/auth/logout");
  clearTokens();
  if (typeof window !== "undefined") {
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    window.location.href = "/";
  }
}

export async function getMyProfile() {
  return api.get<IApiResponse<IUser>>("/users/me");
}

export async function updateMyProfile(data: { name?: string; phone?: string }) {
  return api.put<IApiResponse<IUser>>("/users/my-profile", data);
}

export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  return api.patch<IApiResponse<null>>("/auth/change-password", data);
}

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") return value;
  }
  return null;
}

export function parseJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}


