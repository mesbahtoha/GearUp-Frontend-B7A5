"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made. You can try again when you&apos;re ready.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard/customer/orders">
            <Button>Back to Orders</Button>
          </Link>
          <Link href="/gear">
            <Button variant="outline">Continue Browsing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
