"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Your payment has been processed successfully.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 mb-6">Session: {sessionId}</p>
        )}
        <div className="flex justify-center gap-3">
          <Link href="/dashboard/customer/orders">
            <Button>View My Orders</Button>
          </Link>
          <Link href="/gear">
            <Button variant="outline">Browse More Gear</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
