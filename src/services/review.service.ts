import { apiFetch } from "./api";
import type { ApiResponse, IReview } from "@/types";

export const reviewService = {
  create(payload: { gearId: string; rating: number; comment: string }) {
    return apiFetch<ApiResponse<IReview>>("/reviews", {
      method: "POST",
      body: payload,
    });
  },

  getMyReviews() {
    return apiFetch<ApiResponse<IReview[]>>("/reviews/my-reviews");
  },

  getAll() {
    return apiFetch<ApiResponse<IReview[]>>("/reviews/all");
  },

  getByGear(gearId: string) {
    return apiFetch<ApiResponse<IReview[]>>(`/reviews/gear/${gearId}`);
  },

  update(id: string, payload: { rating?: number; comment?: string }) {
    return apiFetch<ApiResponse<IReview>>(`/reviews/${id}`, {
      method: "PATCH",
      body: payload,
    });
  },

  delete(id: string) {
    return apiFetch<ApiResponse<null>>(`/reviews/${id}`, {
      method: "DELETE",
    });
  },
};
