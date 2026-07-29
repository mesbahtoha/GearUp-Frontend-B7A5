"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { Package, ShoppingBag, Calendar, DollarSign } from "lucide-react";

export default function ProviderDashboardPage() {
  const {
    data: dashboardRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: () => dashboardService.getProviderDashboard(),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  const dashboard = dashboardRes?.data;
  if (!dashboard) return null;

  const stats = [
    {
      title: "Total Gears",
      value: dashboard.totalGear,
      icon: Package,
    },
    {
      title: "Total Rentals",
      value: dashboard.totalRentals,
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: Calendar,
    },
    {
      title: "Total Revenue",
      value: `৳${dashboard.totalRevenue}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your inventory and orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
