"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { rentalService } from "@/services/rental.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-purple-100 text-purple-800",
  RETURNED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminRentalsPage() {
  const queryClient = useQueryClient();

  const {
    data: rentalsRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminService.getRentals(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => rentalService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rentals"] });
      toast.success("Rental cancelled");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return (
      <ErrorState message="Failed to load rentals" onRetry={refetch} />
    );

  const rentals = rentalsRes?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Rentals</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all platform rentals
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10"
                >
                  No rentals found
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">
                    {rental.gear?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {rental.customer?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {rental.gear?.provider?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(rental.startDate).toLocaleDateString()} -{" "}
                    {new Date(rental.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>৳{rental.totalPrice}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[rental.status] || "bg-gray-100"
                      }
                    >
                      {rental.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {rental.status !== "RETURNED" &&
                      rental.status !== "CANCELLED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            cancelMutation.mutate(rental.id)
                          }
                          disabled={cancelMutation.isPending}
                        >
                          Cancel
                        </Button>
                      )}
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
