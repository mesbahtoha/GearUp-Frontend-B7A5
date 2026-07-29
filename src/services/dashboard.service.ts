import { apiFetch } from "./api";
import type {
  ApiResponse,
  IDashboardAdmin,
  IDashboardCustomer,
  IDashboardProvider,
} from "@/types";

export const dashboardService = {
  getCustomerDashboard() {
    return apiFetch<ApiResponse<IDashboardCustomer>>("/dashboard/customer");
  },

  getProviderDashboard() {
    return apiFetch<ApiResponse<IDashboardProvider>>("/dashboard/provider");
  },

  getAdminDashboard() {
    return apiFetch<ApiResponse<IDashboardAdmin>>("/admin/dashboard");
  },
};
