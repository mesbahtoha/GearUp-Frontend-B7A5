"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import type { IApiResponse, IRentalOrder } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PayPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["rental", id],
    queryFn: () => api.get<IApiResponse<IRentalOrder>>(`/rentals/${id}`),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const order = data?.data;

  const handlePay = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await api.post<IApiResponse<{ checkoutUrl: string }>>(
        `/payments/checkout/${order.id}`
      );
      if (res.success && res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error(res.message || "Failed to create checkout session");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <Link href="/dashboard/customer/orders" className="text-primary-600 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (order.status === "PAID") {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">This order has already been paid.</p>
          <p className="text-gray-500 mb-6">The provider will process it shortly.</p>
          <Link href="/dashboard/customer/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (order.status !== "CONFIRMED") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          This order is not ready for payment (status: {order.status}).
        </p>
        <Link href="/dashboard/customer/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link
        href="/dashboard/customer/orders"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Link>

      <h1 className="text-2xl font-bold">Complete Payment</h1>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gear</span>
            <span className="font-medium">{order.gear?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rental Period</span>
            <span className="font-medium">
              {formatDate(order.startDate)} - {formatDate(order.endDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Quantity</span>
            <span className="font-medium">{order.quantity}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl text-primary-600">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <Button onClick={handlePay} loading={loading} className="w-full" size="lg">
          <CreditCard className="w-5 h-5 mr-2" />
          Pay with Stripe
        </Button>

        <p className="text-xs text-gray-400 text-center">
          You will be redirected to Stripe&apos;s secure checkout page.
        </p>
      </Card>
    </div>
  );
}
