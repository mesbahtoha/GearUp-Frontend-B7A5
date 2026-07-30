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

  create(payload: {
    name: string;
    description: string;
    brand: string;
    image?: string;
    pricePerDay: number;
    stock: number;
    categoryId: string;
    isAvailable?: boolean;
  }) {
    return apiFetch<ApiResponse<IGear>>("/gears", {
      method: "POST",
      body: payload,
    });
  },

  update(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
      brand: string;
      image: string;
      pricePerDay: number;
      stock: number;
      isAvailable: boolean;
      categoryId: string;
    }>
  ) {
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
