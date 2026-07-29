import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";
import type { IUser, LoginPayload, RegisterPayload } from "@/types/auth";

export const authService = {
  login(payload: LoginPayload) {
    return apiFetch<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  register(payload: RegisterPayload) {
    return apiFetch<ApiResponse<IUser>>("/users/register", {
      method: "POST",
      body: payload,
    });
  },

  getMyProfile() {
    return apiFetch<ApiResponse<IUser>>("/users/me");
  },

  logout() {
    return apiFetch<ApiResponse<null>>("/auth/logout", {
      method: "POST",
    });
  },

  refreshToken() {
    return apiFetch<ApiResponse<{ accessToken: string }>>("/auth/refresh-token", {
      method: "POST",
    });
  },

  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return apiFetch<ApiResponse<null>>("/auth/change-password", {
      method: "PATCH",
      body: payload,
    });
  },

  updateProfile(payload: Partial<{ name: string; phone: string }>) {
    return apiFetch<ApiResponse<IUser>>("/users/my-profile", {
      method: "PUT",
      body: payload,
    });
  },
};
