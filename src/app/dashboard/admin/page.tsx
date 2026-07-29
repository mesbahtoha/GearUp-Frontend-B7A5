"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const {
    data: dashboardRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => dashboardService.getAdminDashboard(),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load dashboard" onRetry={refetch} />;

  const dashboard = dashboardRes?.data;
  if (!dashboard) return null;

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: Users,
    },
    {
      title: "Total Gears",
      value: dashboard.totalGears,
      icon: Package,
    },
    {
      title: "Total Rentals",
      value: dashboard.totalRentals,
      icon: ShoppingBag,
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and management
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.recentUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No users yet.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.recentRentals.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No rentals yet.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {rental.gear?.name || "Gear"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ৳{rental.totalPrice}
                      </p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {rental.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
