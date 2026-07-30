"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IAdminDashboard } from "@/types";
import Card from "@/components/ui/Card";
import RefreshButton from "@/components/ui/RefreshButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get<IApiResponse<IAdminDashboard>>("/admin/dashboard"),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Providers", value: stats?.totalProviders || 0, icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "text-green-600 bg-green-50" },
    { label: "Suspended", value: stats?.suspendedUsers || 0, icon: UserX, color: "text-red-600 bg-red-50" },
    { label: "Total Gear", value: stats?.totalGears || 0, icon: Package, color: "text-orange-600 bg-orange-50" },
    { label: "Total Rentals", value: stats?.totalRentals || 0, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Completed", value: stats?.completedRentals || 0, icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <RefreshButton queryKeys={[["admin-dashboard"]]} />
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
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
