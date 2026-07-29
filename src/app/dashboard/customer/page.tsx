"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import Container from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { Calendar, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

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
      title: "Total Rentals",
      value: dashboard.totalRentals,
      icon: ShoppingBag,
    },
    {
      title: "Total Spent",
      value: `৳${dashboard.totalSpent}`,
      icon: DollarSign,
    },
    {
      title: "Active Rentals",
      value: dashboard.activeRentals,
      icon: Calendar,
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PICKED_UP: "bg-purple-100 text-purple-800",
    RETURNED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Recent Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.recentRentals.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No rentals yet. Start by browsing gears!
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {rental.gear?.name || "Gear"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(rental.startDate).toLocaleDateString()} -{" "}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">৳{rental.totalPrice}</p>
                    <Badge
                      className={`${
                        statusColors[rental.status] || "bg-gray-100"
                      }`}
                    >
                      {rental.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.payments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No payments yet.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      Payment for{" "}
                      {payment.rental?.gear?.name || "Rental"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">৳{payment.amount}</p>
                    <Badge
                      variant={
                        payment.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {payment.status}
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
