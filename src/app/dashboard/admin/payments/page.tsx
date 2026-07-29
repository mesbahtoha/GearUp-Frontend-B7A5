"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
};

export default function AdminPaymentsPage() {
  const {
    data: paymentsRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => adminService.getPayments(),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return (
      <ErrorState message="Failed to load payments" onRetry={refetch} />
    );

  const payments = paymentsRes?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Payments</h1>
        <p className="text-muted-foreground mt-1">
          View all platform payment transactions
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rental</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.transactionId ||
                      payment.stripeSessionId?.slice(0, 15) + "..." ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {payment.rental?.customer?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {payment.rental?.gear?.name || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    ৳{payment.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        paymentStatusColors[payment.status] ||
                        "bg-gray-100"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(
                      payment.createdAt
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
