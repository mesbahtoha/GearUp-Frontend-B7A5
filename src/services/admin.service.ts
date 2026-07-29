import { apiFetch } from "./api";
import type { ApiResponse, IRental, IPayment, PaginatedResponse } from "@/types";

export const adminService = {
  getRentals(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IRental>>(`/admin/rentals${query}`);
  },

  getPayments(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IPayment>>(`/admin/payments${query}`);
  },

  deleteGear(id: string) {
    return apiFetch<ApiResponse<null>>(`/admin/gears/${id}`, {
      method: "DELETE",
    });
  },
};
