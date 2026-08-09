"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { updateInListCache, removeFromListCache } from "@/lib/queryCache";
import type { IApiResponse, IGearItem } from "@/types";
// import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminGearsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gears", page],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears", { page, limit: 10 }),
    refetchInterval: 10000,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IGearItem>>(`/admin/gears/${id}/availability`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateInListCache<IGearItem>(qc, ["admin-gears"], id, () => res.data!);
      }
      qc.invalidateQueries({ queryKey: ["admin-gears"] });
      toast.success("Gear availability toggled");
    },
    onError: () => {
      toast.error("Failed to toggle availability");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/gears/${id}`),
    onSuccess: (_res, id) => {
      removeFromListCache<IGearItem>(qc, ["admin-gears"], id);
      qc.invalidateQueries({ queryKey: ["admin-gears"] });
      toast.success("Gear permanently deleted");
    },
    onError: () => {
      toast.error("Failed to delete gear");
    },
  });

  const gears = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Gear Listings</h1>
        <RefreshButton queryKeys={[["admin-gears"]]} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Brand</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Provider</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Created</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gears.map((gear) => (
                <tr key={gear.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{gear.name}</td>
                  <td className="py-3 px-2 text-gray-500">{gear.brand}</td>
                  <td className="py-3 px-2 text-gray-500">{gear.provider?.name || "N/A"}</td>
                  <td className="py-3 px-2">{formatPrice(gear.pricePerDay)}/day</td>
                  <td className="py-3 px-2">
                    <Badge status={gear.isAvailable ? "Active" : "Inactive"} />
                  </td>
                  <td className="py-3 px-2 text-gray-500">{formatDate(gear.createdAt)}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <Button
                      size="sm"
                      variant={gear.isAvailable ? "outline" : "primary"}
                      onClick={() => toggleMutation.mutate(gear.id)}
                      loading={toggleMutation.isPending}
                    >
                      {gear.isAvailable ? "Inactive" : "Active"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm("Are you sure you want to permanently delete this gear?")) {
                          deleteMutation.mutate(gear.id);
                        }
                      }}
                      loading={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="flex items-center text-sm text-gray-600 px-3">Page {meta.page} of {meta.totalPage}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
