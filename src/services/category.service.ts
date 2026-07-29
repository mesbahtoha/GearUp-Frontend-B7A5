import { apiFetch } from "./api";
import type { ApiResponse, ICategory } from "@/types";

export const categoryService = {
  getAll() {
    return apiFetch<ApiResponse<ICategory[]>>("/categories");
  },

  getById(id: string) {
    return apiFetch<ApiResponse<ICategory>>(`/categories/${id}`);
  },

  create(payload: { name: string; description?: string }) {
    return apiFetch<ApiResponse<ICategory>>("/categories", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: { name?: string; description?: string }) {
    return apiFetch<ApiResponse<ICategory>>(`/categories/${id}`, {
      method: "PATCH",
      body: payload,
    });
  },

  delete(id: string) {
    return apiFetch<ApiResponse<null>>(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
