import { fetchData } from "./fetch";

import type {
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export const authService = {
  login(payload: LoginPayload) {
    return fetchData("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterPayload) {
    return fetchData("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyProfile() {
    return fetchData("/users/me");
  },

  logout() {
    return fetchData("/auth/logout", {
      method: "POST",
    });
  },

  refreshToken() {
    return fetchData("/auth/refresh-token", {
      method: "POST",
    });
  },

  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return fetchData("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  updateProfile(payload: Partial<{ name: string; phone: string }>) {
    return fetchData("/users/my-profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
