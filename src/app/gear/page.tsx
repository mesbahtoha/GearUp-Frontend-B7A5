"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { IApiResponse, IGearItem, ICategory } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RefreshButton from "@/components/ui/RefreshButton";
import { GearCardSkeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

function GearContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 12,
    search: search || undefined,
    categoryId: categoryId || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const { data: gearsRes, isLoading } = useQuery({
    queryKey: ["gears", params],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears", params),
    refetchInterval: 15000,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
    refetchInterval: 30000,
  });

  const gears = gearsRes?.data || [];
  const meta = gearsRes?.meta;
  const categories = categoriesRes?.data || [];

  const applyFilters = () => {
    setPage(1);
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (categoryId) sp.set("categoryId", categoryId);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (sortBy) sp.set("sortBy", sortBy);
    if (sortOrder) sp.set("sortOrder", sortOrder);
    router.push(`/gear?${sp.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    router.push("/gear");
  };

  const hasFilters = search || categoryId || minPrice || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Browse Gear</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKeys={[["gears"]]} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-64 shrink-0`}>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 sticky top-20">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gear..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split("-");
                  setSortBy(sb);
                  setSortOrder(so);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="pricePerDay-asc">Price: Low to High</option>
                <option value="pricePerDay-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={applyFilters} className="flex-1">
                Apply
              </Button>
              {hasFilters && (
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <GearCardSkeleton key={i} />)}
            </div>
          ) : gears.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No gear found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gears.map((gear) => (
                  <Link key={gear.id} href={`/gear/${gear.id}`}>
                    <Card hover className="overflow-hidden h-full">
                      <div className="relative h-48 bg-gray-100">
                        {gear.image ? (
                          <Image src={gear.image} alt={gear.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{gear.name}</h3>
                          <Badge status={gear.isAvailable ? "In Stock" : "Out of Stock"} />
                        </div>
                        <p className="text-sm text-gray-500 truncate">{gear.brand}</p>
                        {gear.category && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {gear.category.name}
                          </span>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-primary-600">
                            {formatPrice(gear.pricePerDay)}
                            <span className="text-xs text-gray-500 font-normal">/day</span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {meta && meta.totalPage > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center text-sm text-gray-600 px-3">
                    Page {meta.page} of {meta.totalPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <GearCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <GearContent />
    </Suspense>
  );
}
