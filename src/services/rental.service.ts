import { apiFetch } from "./api";
import type { ApiResponse, IRental, PaginatedResponse } from "@/types";

export const rentalService = {
  create(payload: {
    gearId: string;
    quantity: number;
    startDate: string;
    endDate: string;
  }) {
    return apiFetch<ApiResponse<IRental>>("/rentals", {
      method: "POST",
      body: payload,
    });
  },

  getMyRentals(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IRental>>(`/rentals/my-rentals${query}`);
  },

  getProviderOrders(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IRental>>(
      `/rentals/provider-orders${query}`
    );
  },

  getById(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}`);
  },

  getAll(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<IRental>>(`/rentals/all${query}`);
  },

  confirm(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}/confirm`, {
      method: "PATCH",
    });
  },

  pickup(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}/pickup`, {
      method: "PATCH",
    });
  },

  return(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}/return`, {
      method: "PATCH",
    });
  },

  cancel(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}/cancel`, {
      method: "PATCH",
    });
  },
};
