"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import type { IApiResponse, ICustomerDashboard } from "@/types";
import Card from "@/components/ui/Card";
import RefreshButton from "@/components/ui/RefreshButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, CheckCircle, XCircle, RefreshCw, DollarSign, ArrowRight } from "lucide-react";
import { StatusPieChart } from "@/components/shared/Charts";

export default function CustomerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: () => api.get<IApiResponse<ICustomerDashboard>>("/dashboard/customer"),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Active Rentals", value: stats?.activeOrders || 0, icon: RefreshCw, color: "text-green-600 bg-green-50" },
    { label: "Returned", value: stats?.returnedOrders || 0, icon: CheckCircle, color: "text-gray-600 bg-gray-50" },
    { label: "Cancelled", value: stats?.cancelledOrders || 0, icon: XCircle, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKeys={[["customer-dashboard"]]} />
          <Link
            href="/dashboard/customer/orders"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <StatusPieChart
            data={[
              { name: "Active", value: stats?.activeOrders || 0, color: "#059669" },
              { name: "Returned", value: stats?.returnedOrders || 0, color: "#2563eb" },
              { name: "Cancelled", value: stats?.cancelledOrders || 0, color: "#ef4444" },
            ]}
            title="Orders by Status"
          />
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(stats?.totalSpent || 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
