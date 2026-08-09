"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IAdminDashboard, IAnalytics } from "@/types";
import Card from "@/components/ui/Card";
import RefreshButton from "@/components/ui/RefreshButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  UserCheck,
  UserX,
  CheckCircle,
} from "lucide-react";
import {
  StatusPieChart,
  RevenueLineChart,
  MonthlyRentalsBarChart,
  CategoryBarChart,
} from "@/components/shared/Charts";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get<IApiResponse<IAdminDashboard>>("/admin/dashboard"),
  });

  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => api.get<IApiResponse<IAnalytics>>("/admin/analytics"),
  });

  const stats = data?.data;
  const analytics = analyticsRes?.data;

  if (isLoading || analyticsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30" },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/30" },
    { label: "Providers", value: stats?.totalProviders || 0, icon: Users, color: "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-900/30" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/30" },
    { label: "Suspended", value: stats?.suspendedUsers || 0, icon: UserX, color: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/30" },
    { label: "Total Gear", value: stats?.totalGears || 0, icon: Package, color: "text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-900/30" },
    { label: "Total Rentals", value: stats?.totalRentals || 0, icon: ShoppingBag, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30" },
    { label: "Completed", value: stats?.completedRentals || 0, icon: CheckCircle, color: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/30" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <RefreshButton queryKeys={[["admin-dashboard"], ["admin-analytics"]]} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <RevenueLineChart data={analytics?.monthlyRevenue || []} title="Revenue - Last 6 Months" />
        </Card>
        <Card className="p-5">
          <MonthlyRentalsBarChart data={analytics?.monthlyRentalCount || []} title="Rentals per Month" />
        </Card>
        <Card className="p-5">
          <StatusPieChart
            data={(analytics?.rentalStatusBreakdown || []).map((item) => ({ name: item.status, value: item.count }))}
            title="Rentals by Status"
          />
        </Card>
        <Card className="p-5">
          <CategoryBarChart data={analytics?.gearByCategory || []} title="Gear by Category" />
        </Card>
      </div>
    </div>
  );
}
