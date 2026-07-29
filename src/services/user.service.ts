import { apiFetch } from "./api";
import type { ApiResponse, IUser, PaginatedResponse } from "@/types";

export const userService = {
  getAll(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IUser>>(`/admin/users${query}`);
  },

  getById(id: string) {
    return apiFetch<ApiResponse<IUser>>(`/admin/users/${id}`);
  },

  suspend(id: string) {
    return apiFetch<ApiResponse<IUser>>(`/admin/users/${id}/suspend`, {
      method: "PATCH",
    });
  },

  activate(id: string) {
    return apiFetch<ApiResponse<IUser>>(`/admin/users/${id}/activate`, {
      method: "PATCH",
    });
  },

  changeRole(id: string, role: "ADMIN" | "CUSTOMER" | "PROVIDER") {
    return apiFetch<ApiResponse<IUser>>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role },
    });
  },
};
