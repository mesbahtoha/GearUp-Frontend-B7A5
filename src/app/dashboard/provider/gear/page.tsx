"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { useDeleteGear } from "@/hooks/useGear";
import { updateInListCache } from "@/lib/queryCache";
import type { IApiResponse, IGearItem } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProviderGearPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-gears", page],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears/my-gears", { page }),
    refetchInterval: 10000,
  });

  const deleteMutation = useDeleteGear();

  const gears = data?.data || [];
  const meta = data?.meta;

  const handleToggleAvailability = (gear: IGearItem) => {
    toggleAvailabilityMutation.mutate({ id: gear.id, isAvailable: !gear.isAvailable });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gear?")) return;
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Gear deleted");
    } catch {
      toast.error("Failed to delete gear");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.patch<IApiResponse<IGearItem>>(`/gears/${id}`, { isAvailable }),
    onSuccess: (res, vars) => {
      if (res.data) {
        updateInListCache<IGearItem>(qc, ["my-gears"], vars.id, () => res.data!);
      }
      qc.invalidateQueries({ queryKey: ["my-gears"] });
      toast.success(`Gear ${vars.isAvailable ? "available" : "unavailable"} now`);
    },
    onError: () => toast.error("Failed to update gear"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Gear</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKeys={[["my-gears"]]} />
          <Link href="/dashboard/provider/gear/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Gear
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : gears.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No gear listed yet.</p>
          <Link href="/dashboard/provider/gear/new">
            <Button>Add Your First Gear</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {gears.map((gear) => (
            <Card key={gear.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{gear.name}</h3>
                    <Badge status={gear.isAvailable ? "Available" : "Unavailable"} />
                  </div>
                  <p className="text-sm text-gray-500">{gear.brand}</p>
                  {gear.category && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {gear.category.name}
                    </span>
                  )}
                  <p className="text-sm text-gray-500">
                    {formatPrice(gear.pricePerDay)}/day | Stock: {gear.stock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/provider/gear/${gear.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAvailability(gear)}
                  >
                    {gear.isAvailable ? "Set Unavailable" : "Set Available"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(gear.id)}
                    loading={deletingId === gear.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
  );
}
