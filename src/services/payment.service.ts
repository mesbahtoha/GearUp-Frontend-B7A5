import { apiFetch } from "./api";
import type { ApiResponse } from "@/types";

export const paymentService = {
  checkout(rentalId: string) {
    return apiFetch<ApiResponse<{ url: string }>>(
      `/payments/checkout/${rentalId}`,
      { method: "POST" }
    );
  },
};
