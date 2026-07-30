"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import type { IApiResponse, IProviderDashboard } from "@/types";
import Card from "@/components/ui/Card";
import RefreshButton from "@/components/ui/RefreshButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Clock, CheckCircle, RefreshCw, DollarSign, ArrowRight } from "lucide-react";

export default function ProviderDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: () => api.get<IApiResponse<IProviderDashboard>>("/dashboard/provider"),
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Gear", value: stats?.totalGear || 0, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Total Rentals", value: stats?.totalRentals || 0, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Confirmed Orders", value: stats?.confirmedOrders || 0, icon: RefreshCw, color: "text-blue-600 bg-blue-50" },
    { label: "Returned", value: stats?.returnedOrders || 0, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: "text-primary-600 bg-primary-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <RefreshButton queryKeys={[["provider-dashboard"]]} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="flex gap-3">
        <Link href="/dashboard/provider/gear/new">
          <Card hover className="p-4 flex items-center gap-3">
            <Package className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-sm">Add New Gear</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Card>
        </Link>
        <Link href="/dashboard/provider/orders">
          <Card hover className="p-4 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-sm">View Orders</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
