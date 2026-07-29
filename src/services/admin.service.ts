import { apiFetch } from "./api";
import type { ApiResponse, IRental, IPayment } from "@/types";

export const adminService = {
  getRentals() {
    return apiFetch<ApiResponse<IRental[]>>("/admin/rentals");
  },

  getPayments() {
    return apiFetch<ApiResponse<IPayment[]>>("/admin/payments");
  },

  deleteGear(id: string) {
    return apiFetch<ApiResponse<null>>(`/admin/gears/${id}`, {
      method: "DELETE",
    });
  },
};
