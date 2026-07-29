"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import Container from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { Calendar, DollarSign, ShoppingBag } from "lucide-react";

export default function CustomerDashboardPage() {
  const {
    data: dashboardRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: () => dashboardService.getCustomerDashboard(),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  const dashboard = dashboardRes?.data;

  if (!dashboard) return null;

  const stats = [
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Total Spent",
      value: `৳${dashboard.totalSpent}`,
      icon: DollarSign,
    },
    {
      title: "Active Rentals",
      value: dashboard.activeOrders,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your rentals and reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
