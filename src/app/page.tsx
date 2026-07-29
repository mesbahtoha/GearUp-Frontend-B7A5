"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { gearService } from "@/services/gear.service";
import Container from "@/components/shared/container";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bike, ArrowRight, Shield, Clock } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const { data: gearsRes, isLoading } = useQuery({
    queryKey: ["featured-gears"],
    queryFn: () => gearService.getAll({ limit: "6" }),
  });

  const gears = gearsRes?.data || [];

  return (
    <div>
      <section className="bg-gradient-to-b from-background to-muted/30">
        <Container className="py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Rent Sports & Outdoor{" "}
              <span className="text-primary">Gear Instantly</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              GearUp connects you with top-quality sports and outdoor equipment.
              Rent what you need, when you need it.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="/gear"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Browse Gears <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Get Started
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t">
        <Container className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Wide Selection</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  From bikes to camping gear, find everything you need.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Trusted Providers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All equipment verified and maintained by professionals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Flexible Rentals</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Rent by the day. Pick up and return on your schedule.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-muted/30">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Gears</h2>
              <p className="text-muted-foreground mt-1">
                Popular equipment available for rent
              </p>
            </div>
            <Link
              href="/gear"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : gears.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No gears available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gears.map((gear) => (
                <Link key={gear.id} href={`/gear/${gear.id}`}>
                  <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
                    <div className="relative h-48">
                      <Image
                        src={gear.image || "/placeholder.svg"}
                        alt={gear.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            gear.isAvailable ? "default" : "secondary"
                          }
                        >
                          {gear.isAvailable ? "Available" : "Rented"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{gear.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {gear.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">
                        ৳{gear.pricePerDay}
                        <span className="text-sm font-normal text-muted-foreground">
                          /day
                        </span>
                      </p>
                      {gear.category && (
                        <Badge variant="outline">
                          {gear.category.name}
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16">
        <Container className="text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Join GearUp today and start renting sports & outdoor equipment.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Create Account
            </Link>
            <Link
              href="/gear"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Explore Gears
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
