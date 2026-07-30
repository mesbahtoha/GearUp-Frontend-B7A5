"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IGearItem, ICategory } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { GearCardSkeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Search, Shield, Sparkles, Truck } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { data: gearsRes, isLoading } = useQuery({
    queryKey: ["gears", "home"],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears", { limit: 8 }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
  });

  const gears = gearsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const dashboardLink = user?.role === "ADMIN" ? "/dashboard/admin" : user?.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer";

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rent Sports & Outdoor Gear Instantly
              </h1>
              <p className="text-primary-100 text-lg mb-8">
                From camping tents to tennis rackets — get the gear you need, when you need it. No
                hassle, just play.
              </p>
              <div className="flex gap-3">
                <Link href="/gear">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                    Explore Gear <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Link href={dashboardLink}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-white/10 rounded-full" />
                <div className="absolute inset-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Search, label: "Browse Gear", desc: "Find what you need" },
            { icon: Truck, label: "Fast Delivery", desc: "Get it delivered" },
            { icon: Sparkles, label: "Top Quality", desc: "Premium equipment" },
            { icon: Shield, label: "Secure Payments", desc: "Protected transactions" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                <h3 className="font-semibold text-sm">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gear?categoryId=${cat.id}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Gear</h2>
          <Link href="/gear" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <GearCardSkeleton key={i} />)}
          </div>
        ) : gears.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No gear available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gears.map((gear) => (
              <Link key={gear.id} href={`/gear/${gear.id}`}>
                <Card hover className="overflow-hidden h-full">
                  <div className="relative h-48 bg-gray-100">
                    {gear.image ? (
                      <Image src={gear.image} alt={gear.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Sparkles className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 truncate">{gear.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{gear.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(gear.pricePerDay)}
                        <span className="text-xs text-gray-500 font-normal">/day</span>
                      </span>
                      <Badge status={gear.isAvailable ? "In Stock" : "Out of Stock"} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
