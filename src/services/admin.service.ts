import { apiFetch } from "./api";
import type { IApiResponse, IRental, IPayment, PaginatedResponse, Meta } from "@/types";

export const adminService = {
  async getRentals(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const raw = await apiFetch<any>(`/admin/rentals${query}`);
    return {
      success: raw.success,
      statusCode: raw.statusCode,
      message: raw.message,
      data: (raw.data?.data || []) as IRental[],
      meta: (raw.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 }) as Meta,
    } as PaginatedResponse<IRental>;
  },

  async getPayments(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const raw = await apiFetch<any>(`/admin/payments${query}`);
    return {
      success: raw.success,
      statusCode: raw.statusCode,
      message: raw.message,
      data: (raw.data?.data || []) as IPayment[],
      meta: (raw.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 }) as Meta,
    } as PaginatedResponse<IPayment>;
  },

  deleteGear(id: string) {
    return apiFetch<IApiResponse<null>>(`/admin/gears/${id}`, {
      method: "DELETE",
    });
  },
};
