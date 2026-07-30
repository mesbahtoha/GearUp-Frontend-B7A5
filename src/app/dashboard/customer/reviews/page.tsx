"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { removeFromListCache } from "@/lib/queryCache";
import type { IApiResponse, IReview, IRentalOrder } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerReviewsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: reviewsRes, isLoading } = useQuery({
    queryKey: ["my-reviews", page],
    queryFn: () => api.get<IApiResponse<IReview[]>>("/reviews/my-reviews", { page }),
    refetchInterval: 10000,
  });

  const reviewsMeta = reviewsRes?.meta;

  const { data: returnedRentalsRes } = useQuery({
    queryKey: ["my-rentals", "RETURNED"],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/my-rentals", {
        limit: 50,
        status: "RETURNED",
      }),
  });

  const reviews = reviewsRes?.data || [];
  const returnedRentals = returnedRentalsRes?.data || [];

  const alreadyReviewedGearIds = new Set(reviews.map((r) => r.gearId));
  const unReviewedRentals = returnedRentals.filter((r) => !alreadyReviewedGearIds.has(r.gearId));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: (_res, id) => {
      removeFromListCache<IReview>(qc, ["my-reviews"], id);
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      toast.success("Review deleted");
    },
  });

  const handleSubmitReview = async () => {
    if (!selectedGearId) return;
    setSubmitting(true);
    try {
      const res = await api.post<IApiResponse<unknown>>("/reviews", { gearId: selectedGearId, rating, comment });
      if (res.success) {
        toast.success("Review submitted!");
        setShowForm(false);
        setSelectedGearId("");
        setRating(5);
        setComment("");
        qc.invalidateQueries({ queryKey: ["my-reviews"] });
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <RefreshButton queryKeys={[["my-reviews"]]} />
      </div>

      {unReviewedRentals.length > 0 && !showForm && (
        <Button onClick={() => setShowForm(true)}>Write a Review</Button>
      )}

      {showForm && (
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Write a Review</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gear</label>
            <select
              value={selectedGearId}
              onChange={(e) => setSelectedGearId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select gear</option>
              {unReviewedRentals.map((r) => (
                <option key={r.id} value={r.gearId}>
                  {r.gear?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  <Star
                    className={`w-6 h-6 ${
                      n <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmitReview} loading={submitting} disabled={!selectedGearId}>
              Submit Review
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.gear?.name}</span>
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
                  </div>
                  {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(review.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {reviewsMeta && reviewsMeta.totalPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="flex items-center text-sm text-gray-600 px-3">
            Page {reviewsMeta.page} of {reviewsMeta.totalPage}
          </span>
          <Button variant="outline" size="sm" disabled={page >= reviewsMeta.totalPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
