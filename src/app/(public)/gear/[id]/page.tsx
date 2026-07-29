"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gearService } from "@/services/gear.service";
import { rentalService } from "@/services/rental.service";
import { reviewService } from "@/services/review.service";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, User, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GearDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: gearRes, isLoading } = useQuery({
    queryKey: ["gear", params.id],
    queryFn: () => gearService.getById(params.id as string),
    enabled: !!params.id,
  });

  const { data: reviewsRes } = useQuery({
    queryKey: ["reviews", params.id],
    queryFn: () => reviewService.getByGear(params.id as string),
    enabled: !!params.id,
  });

  const gear = gearRes?.data;
  const reviews = reviewsRes?.data || [];

  const createRentalMutation = useMutation({
    mutationFn: (data: { gearId: string; quantity: number; startDate: string; endDate: string }) =>
      rentalService.create(data),
    onSuccess: (res) => {
      toast.success("Rental created successfully!");
      router.push("/dashboard/customer/rentals");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create rental");
    },
  });

  const handleRent = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can rent gears");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    createRentalMutation.mutate({
      gearId: params.id as string,
      quantity: 1,
      startDate,
      endDate,
    });
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Container>
    );
  }

  if (!gear) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold">Gear not found</h2>
        <p className="text-muted-foreground mt-2">
          The gear you are looking for does not exist.
        </p>
        <Link
          href="/gear"
          className={cn(buttonVariants({ className: "mt-4" }))}
        >
          Back to Gears
        </Link>
      </Container>
    );
  }

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return (
    <Container className="py-8">
      <Link
        href="/gear"
        className={cn(buttonVariants({ variant: "ghost", className: "mb-4" }))}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Gears
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={gear.image || "/placeholder.svg"}
              alt={gear.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{gear.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={gear.isAvailable ? "default" : "secondary"}
                >
                  {gear.isAvailable ? "Available" : "Rented"}
                </Badge>
                {gear.category && (
                  <Badge variant="outline">{gear.category.name}</Badge>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">
              ৳{gear.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </p>
          </div>

          <p className="mt-4 text-muted-foreground">{gear.description}</p>

          {gear.provider && (
            <Card className="mt-6">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {gear.provider.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{gear.provider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {gear.provider.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {gear.isAvailable && (
            <Card className="mt-6">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rent Now
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                {days > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>
                      {days} day{days > 1 ? "s" : ""}
                    </span>
                    <span className="font-bold">
                      ৳{gear.pricePerDay * days}
                    </span>
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleRent}
                  disabled={createRentalMutation.isPending}
                >
                  {createRentalMutation.isPending
                    ? "Processing..."
                    : user
                    ? "Rent Now"
                    : "Login to Rent"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.customer?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {review.customer?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
