"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Thank you for your payment. Your rental is now confirmed.
            You can view your rental details in the dashboard.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/customer/rentals"
              className={cn(buttonVariants({ className: "w-full" }))}
            >
              View My Rentals
            </Link>
            <Link
              href="/gear"
              className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}
            >
              Continue Browsing
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
