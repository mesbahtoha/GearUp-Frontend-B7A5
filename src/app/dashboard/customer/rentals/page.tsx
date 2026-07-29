"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { rentalService } from "@/services/rental.service";
import { paymentService } from "@/services/payment.service";
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
  PLACED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PAID: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  RETURNED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function MyRentalsPage() {
  const router = useRouter();

  const {
    data: rentalsRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-rentals"],
    queryFn: () => rentalService.getMyRentals(),
  });

  const handlePayment = async (rentalId: string) => {
    try {
      const res = await paymentService.checkout(rentalId);
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error("Failed to get payment URL");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment failed"
      );
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load rentals" onRetry={refetch} />;

  const rentals = rentalsRes?.data || [];

  if (rentals.length === 0) {
    return (
      <EmptyState
        title="No rentals yet"
        description="Browse gears and rent your first equipment"
        actionLabel="Browse Gears"
        actionHref="/gear"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Rentals</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your rental history
        </p>
      </div>

      <div className="space-y-4">
        {rentals.map((rental) => (
          <Card key={rental.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {rental.gear?.name || "Gear"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(rental.startDate).toLocaleDateString()} -{" "}
                    {new Date(rental.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        statusColors[rental.status] || "bg-gray-100"
                      }
                    >
                      {rental.status}
                    </Badge>
                    <span className="text-sm font-semibold">
                      ৳{rental.totalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {rental.status === "PLACED" && (
                    <Button
                      onClick={() => handlePayment(rental.id)}
                    >
                      Pay Now
                    </Button>
                  )}
                  {rental.status === "PICKED_UP" && (
                    <Button variant="outline" disabled>
                      In Progress
                    </Button>
                  )}
                  {rental.status === "RETURNED" && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/gear/${rental.gearId}`)
                      }
                    >
                      Review Gear
                    </Button>
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
