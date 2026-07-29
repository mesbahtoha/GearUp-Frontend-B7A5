import { apiFetch } from "./api";
import type { ApiResponse, IRental } from "@/types";

export const rentalService = {
  create(payload: { gearId: string; startDate: string; endDate: string }) {
    return apiFetch<ApiResponse<IRental>>("/rentals", {
      method: "POST",
      body: payload,
    });
  },

  getMyRentals() {
    return apiFetch<ApiResponse<IRental[]>>("/rentals/my-rentals");
  },

  getProviderOrders() {
    return apiFetch<ApiResponse<IRental[]>>("/rentals/provider-orders");
  },

  getById(id: string) {
    return apiFetch<ApiResponse<IRental>>(`/rentals/${id}`);
  },

  getAll() {
    return apiFetch<ApiResponse<IRental[]>>("/rentals/all");
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
