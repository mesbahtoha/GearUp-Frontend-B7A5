"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { gearService } from "@/services/gear.service";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function InventoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: gearsRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-gears"],
    queryFn: () => gearService.getMyGears(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => gearService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-gears"] });
      toast.success("Gear deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return <ErrorState message="Failed to load inventory" onRetry={refetch} />;

  const gears = gearsRes?.data || [];

  if (gears.length === 0) {
    return (
      <EmptyState
        title="No gears in inventory"
        description="Add your first gear item to start renting"
        actionLabel="Add Gear"
        actionHref="/dashboard/provider/inventory/new"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gear listings
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/provider/inventory/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Gear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gears.map((gear) => (
          <Card key={gear.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{gear.name}</CardTitle>
                <Badge
                  variant={gear.isAvailable ? "default" : "secondary"}
                >
                  {gear.isAvailable ? "Available" : "Rented"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {gear.description}
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                ৳{gear.pricePerDay}
                <span className="text-sm font-normal text-muted-foreground">
                  /day
                </span>
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    router.push(
                      `/dashboard/provider/inventory/${gear.id}/edit`
                    )
                  }
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive"
                  onClick={() => {
                    if (confirm("Delete this gear?")) {
                      deleteMutation.mutate(gear.id);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
