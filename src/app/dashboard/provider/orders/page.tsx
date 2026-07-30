"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useConfirmOrder, useMarkPickedUp, useMarkReturned, useCancelOrder } from "@/hooks/useRental";
import type { IApiResponse, IRentalOrder } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function ProviderOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["provider-orders", page, statusFilter],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/provider-orders", {
        page,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    refetchInterval: 10000,
  });

  const confirmMutation = useConfirmOrder();
  const pickupMutation = useMarkPickedUp();
  const returnMutation = useMarkReturned();
  const cancelMutation = useCancelOrder();

  const orders = data?.data || [];
  const meta = data?.meta;

  const handleAction = async (action: string, id: string) => {
    setLoadingOrderId(id);
    try {
      let res;
      switch (action) {
        case "confirm":
          res = await confirmMutation.mutateAsync(id);
          break;
        case "pickup":
          res = await pickupMutation.mutateAsync(id);
          break;
        case "return":
          res = await returnMutation.mutateAsync(id);
          break;
        case "cancel":
          res = await cancelMutation.mutateAsync(id);
          break;
      }
      if (res?.success) toast.success("Order updated!");
    } catch {
      toast.error("Failed to update order");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getActions = (order: IRentalOrder) => {
    const actions: { label: string; action: string; variant: "primary" | "outline" | "danger" }[] = [];
    if (order.status === "PLACED") {
      actions.push({ label: "Confirm", action: "confirm", variant: "primary" });
      actions.push({ label: "Cancel", action: "cancel", variant: "danger" });
    }
    if (order.status === "PAID") {
      actions.push({ label: "Mark Picked Up", action: "pickup", variant: "primary" });
    }
    if (order.status === "PICKED_UP") {
      actions.push({ label: "Mark Returned", action: "return", variant: "primary" });
    }
    if (order.status === "CONFIRMED") {
      actions.push({ label: "Cancel", action: "cancel", variant: "danger" });
    }
    return actions;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incoming Orders</h1>
        <RefreshButton queryKeys={[["provider-orders"]]} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "PLACED", "CONFIRMED", "PAID", "PICKED_UP", "RETURNED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{order.gear?.name || "Gear"}</h3>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Customer: {order.customer?.name || "Unknown"} ({order.customer?.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.startDate)} - {formatDate(order.endDate)} | Qty: {order.quantity}
                  </p>
                  <p className="text-sm font-medium">{formatPrice(order.totalPrice)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {getActions(order).map((action) => (
                    <Button
                      key={action.action}
                      size="sm"
                      variant={action.variant}
                      onClick={() => handleAction(action.action, order.id)}
                      loading={loadingOrderId === order.id}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {meta && meta.totalPage > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-gray-600 px-3">
                Page {meta.page} of {meta.totalPage}
              </span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPage} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
