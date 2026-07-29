"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalService } from "@/services/rental.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  RETURNED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();

  const {
    data: ordersRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => rentalService.getProviderOrders(),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => rentalService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order confirmed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const pickupMutation = useMutation({
    mutationFn: (id: string) => rentalService.pickup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order picked up");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => rentalService.return(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order returned");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => rentalService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order cancelled");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load orders" onRetry={refetch} />;

  const orders = ordersRes?.data || [];

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Orders will appear here when customers rent your gears"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage your rental orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {order.gear?.name || "Gear"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.customer?.name || "N/A"} (
                    {order.customer?.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.startDate).toLocaleDateString()} -{" "}
                    {new Date(order.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        statusColors[order.status] || "bg-gray-100"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="text-sm font-semibold">
                      ৳{order.totalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => confirmMutation.mutate(order.id)}
                        disabled={confirmMutation.isPending}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => cancelMutation.mutate(order.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {order.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      onClick={() => pickupMutation.mutate(order.id)}
                      disabled={pickupMutation.isPending}
                    >
                      Mark Picked Up
                    </Button>
                  )}
                  {order.status === "PICKED_UP" && (
                    <Button
                      size="sm"
                      onClick={() => returnMutation.mutate(order.id)}
                      disabled={returnMutation.isPending}
                    >
                      Mark Returned
                    </Button>
                  )}
                  {order.status === "RETURNED" && (
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                  {order.status === "CANCELLED" && (
                    <Badge className="bg-red-100 text-red-800">
                      Cancelled
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
