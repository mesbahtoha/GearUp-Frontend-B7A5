"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useCancelOrder } from "@/hooks/useRental";
import type { IApiResponse, IRentalOrder } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { CreditCard, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function OrdersContent() {
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const paymentSuccess = searchParams.get("payment_success") === "true";

  useEffect(() => {
    if (paymentSuccess) {
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      toast.success("Payment successful!");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("payment_success");
      router.replace(`/dashboard/customer/orders${newParams.toString() ? `?${newParams.toString()}` : ""}`, { scroll: false });
    }
  }, [paymentSuccess, searchParams, qc, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-rentals", page, statusFilter],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/my-rentals", {
        page,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    refetchInterval: 10000,
  });

  const cancelMutation = useCancelOrder();

  const orders = data?.data || [];
  const meta = data?.meta;

  const handlePay = (orderId: string) => {
    router.push(`/dashboard/customer/orders/${orderId}/pay`);
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelMutation.mutateAsync(orderId);
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <RefreshButton queryKeys={[["my-rentals"]]} />
      </div>

      {paymentSuccess && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Payment Successful!</p>
              <p className="text-sm text-green-600">Your order has been paid. The provider will process it shortly.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap">
        {["", "PLACED", "CONFIRMED", "PAID", "PICKED_UP", "RETURNED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          <p className="text-gray-500">No orders found.</p>
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
                    {formatDate(order.startDate)} - {formatDate(order.endDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {order.quantity} | Total: {formatPrice(order.totalPrice)}
                  </p>
                  {order.payment && (
                    <p className="text-sm text-gray-500">
                      Payment: <Badge status={order.payment.status} />
                      {order.payment.transactionId && (
                        <span className="ml-2 text-xs text-gray-400">
                          TX: {order.payment.transactionId}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {order.status === "CONFIRMED" && (
                    <Button size="sm" onClick={() => handlePay(order.id)}>
                      <CreditCard className="w-4 h-4 mr-1" /> Pay Now
                    </Button>
                  )}
                  {(order.status === "PLACED" || order.status === "CONFIRMED") && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancel(order.id)}
                      loading={cancelMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  {order.status === "RETURNED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/customer/reviews`)}
                    >
                      Leave Review
                    </Button>
                  )}
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

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} />}>
      <OrdersContent />
    </Suspense>
  );
}
