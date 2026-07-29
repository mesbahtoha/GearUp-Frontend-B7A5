import { apiFetch } from "./api";
import type { ApiResponse, IGear, PaginatedResponse } from "@/types";

export const gearService = {
  getAll(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IGear>>(`/gears${query}`);
  },

  getById(id: string) {
    return apiFetch<ApiResponse<IGear>>(`/gears/${id}`);
  },

  getMyGears() {
    return apiFetch<ApiResponse<IGear[]>>("/gears/my-gears");
  },

  create(payload: Record<string, unknown>) {
    return apiFetch<ApiResponse<IGear>>("/gears", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: Record<string, unknown>) {
    return apiFetch<ApiResponse<IGear>>(`/gears/${id}`, {
      method: "PATCH",
      body: payload,
    });
  },

  delete(id: string) {
    return apiFetch<ApiResponse<null>>(`/gears/${id}`, {
      method: "DELETE",
    });
  },
};
