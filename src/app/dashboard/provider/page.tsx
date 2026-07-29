"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { Package, ShoppingBag, Calendar, DollarSign } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  RETURNED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

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
      value: dashboard.totalGears,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Active Rentals",
      value: dashboard.activeRentals,
      icon: Calendar,
    },
    {
      title: "Total Earnings",
      value: `৳${dashboard.totalEarnings}`,
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {order.gear?.name || "Gear"} -{" "}
                      {order.customer?.name || "Customer"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.startDate).toLocaleDateString()} -{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">৳{order.totalPrice}</p>
                    <Badge
                      className={
                        statusColors[order.status] || "bg-gray-100"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
