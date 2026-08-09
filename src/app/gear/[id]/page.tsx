"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { IApiResponse, IGearItem, IReview } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Skeleton, GearCardSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { Calendar, Star, User, ChevronLeft, MapPin, Package, Tag, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState<string>("1");
  const [creating, setCreating] = useState(false);

  const { data: gearRes, isLoading } = useQuery({
    queryKey: ["gear", id],
    queryFn: () => api.get<IApiResponse<IGearItem>>(`/gears/${id}`),
  });

  const { data: reviewsRes } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => api.get<IApiResponse<IReview[]>>(`/reviews/gear/${id}`),
  });

  const { data: relatedRes } = useQuery({
    queryKey: ["gears", "related", id],
    queryFn: () =>
      api
        .get<IApiResponse<IGearItem[]>>("/gears", {
          limit: 3,
          categoryId: gearRes?.data?.categoryId,
        })
        .then((res) => ({
          data: (res.data || []).filter((g) => g.id !== id),
          meta: res.meta,
        }))
        .catch(() => ({ data: [] as IGearItem[], meta: undefined })),
    enabled: !!gearRes?.data?.categoryId,
  });

  const gear = gearRes?.data;
  const reviews = reviewsRes?.data || [];
  const relatedItems = (relatedRes?.data || []).slice(0, 3);

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const handleRent = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to rent gear");
      router.push("/auth/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can rent gear");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post<IApiResponse<unknown>>("/rentals", {
        gearId: id,
        startDate,
        endDate,
        quantity: Number(quantity),
      });
      if (res.success) {
        toast.success("Rental order placed! Provider will confirm it.");
        router.push("/dashboard/customer/orders");
      } else {
        toast.error(res.message || "Failed to create rental");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Gear not found</p>
        <Link href="/gear" className="text-primary-600 dark:text-primary-400 mt-4 inline-block">Back to Gear</Link>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const totalPrice = days * gear.pricePerDay * Number(quantity);

  const keyInfo = [
    { icon: Tag, label: "Brand", value: gear.brand },
    { icon: Package, label: "Stock", value: `${gear.stock} units` },
    { icon: User, label: "Provider", value: gear.provider?.name || "N/A" },
    { icon: Clock, label: "Listed", value: formatDate(gear.createdAt) },
    { icon: MapPin, label: "Availability", value: gear.isAvailable ? "Available" : "Unavailable" },
    { icon: ShieldCheck, label: "Condition", value: "Inspected & ready" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/gear" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Gear
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-64 md:h-96 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden">
          {gear.image ? (
            <Image src={gear.image} alt={gear.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600">No Image</div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold">{gear.name}</h1>
              <Badge status={gear.isAvailable ? "Available" : "Unavailable"} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{gear.brand}</p>
            {gear.category && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                {gear.category.name}
              </span>
            )}
          </div>

          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(gear.pricePerDay)}
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/day</span>
          </p>

          {/* Rating summary */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-slate-700"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">({reviews.length} reviews)</span>
            </div>
          )}

          {/* Description / Overview */}
          <div>
            <h2 className="font-semibold mb-1">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{gear.description}</p>
          </div>

          {/* Key information / Specifications */}
          <div>
            <h2 className="font-semibold mb-2">Key Information</h2>
            <div className="grid grid-cols-2 gap-2">
              {keyInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                    <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    <span className="min-w-0">
                      <span className="text-gray-400 dark:text-gray-500">{item.label}: </span>
                      <span className="truncate">{item.value}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {gear.isAvailable && (
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold">Rent Now</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today}
                    className="block w-full min-w-0 max-w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today}
                    className="block w-full min-w-0 max-w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={gear.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setQuantity("");
                      return;
                    }
                    const num = Number(value);
                    if (Number.isNaN(num)) return;
                    setQuantity(String(Math.min(gear.stock, Math.max(1, num))));
                  }}
                  onBlur={() => {
                    const num = Number(quantity);
                    if (quantity === "" || Number.isNaN(num) || num < 1) {
                      setQuantity("1");
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm"
                />
              </div>
              {days > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {days} day{days > 1 ? "s" : ""} &times; {Number(quantity) || 0} unit{Number(quantity) > 1 ? "s" : ""}
                  </span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
              )}
              <Button onClick={handleRent} loading={creating} className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                {isAuthenticated ? "Rent Now" : "Login to Rent"}
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <Card className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this gear after your rental!
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="font-medium text-sm">{review.customer?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-slate-700"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{formatDate(review.createdAt)}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Related items */}
      {relatedItems.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Related Gear</h2>
            <Link href={`/gear?categoryId=${gear.categoryId}`} className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
              View All <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <Card key={item.id} hover className="overflow-hidden h-full flex flex-col">
                <Link href={`/gear/${item.id}`} className="relative h-40 bg-gray-100 dark:bg-slate-800 block">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-600">No Image</div>
                  )}
                </Link>
                <div className="p-4 space-y-1 flex flex-col flex-1">
                  <Link href={`/gear/${item.id}`}>
                    <h3 className="font-semibold text-sm truncate hover:text-primary-600 dark:hover:text-primary-400">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(item.pricePerDay)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/day</span>
                  </p>
                  <Link href={`/gear/${item.id}`} className="mt-auto pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
