"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was not completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your payment has been cancelled. If you still want to rent the
            gear, you can try again from your rentals page.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/customer/rentals"
              className={cn(buttonVariants({ className: "w-full" }))}
            >
              Go to Rentals
            </Link>
            <Link
              href="/gear"
              className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}
            >
              Browse Gears
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
