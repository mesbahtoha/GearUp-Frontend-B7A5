"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { removeFromListCache } from "@/lib/queryCache";
import type { IApiResponse, IReview } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", page],
    queryFn: () => api.get<IApiResponse<IReview[]>>("/reviews/all", { page }),
    refetchInterval: 10000,
  });

  const reviews = data?.data || [];
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: (_, id) => {
      removeFromListCache<IReview>(qc, ["admin-reviews"], id);
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Reviews</h1>
        <RefreshButton queryKeys={[["admin-reviews"]]} />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.gear?.name}</span>
                    <span className="text-sm text-gray-500">by {review.customer?.name}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm("Delete this review?")) {
                      deleteMutation.mutate(review.id);
                    }
                  }}
                  loading={deleteMutation.isPending}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
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
