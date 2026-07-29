"use client";

import { Suspense, useState, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { gearService } from "@/services/gear.service";
import { categoryService } from "@/services/category.service";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";

export default function GearListingPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center">Loading...</div>}>
      <GearListingContent />
    </Suspense>
  );
}

function GearListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const readParam = (key: string, fallback = "") => searchParams.get(key) || fallback;

  const [search, setSearch] = useState(readParam("search"));
  const [categoryId, setCategoryId] = useState(readParam("categoryId"));
  const [availability, setAvailability] = useState(readParam("availability"));
  const [minPrice, setMinPrice] = useState(readParam("minPrice"));
  const [maxPrice, setMaxPrice] = useState(readParam("maxPrice"));
  const [page, setPage] = useState(Number(readParam("page", "1")));
  const [showFilters, setShowFilters] = useState(false);

  const syncUrl = useCallback(
    (overrides: Record<string, string>) => {
      const p = new URLSearchParams();
      const vals = { search, categoryId, availability, minPrice, maxPrice, page: String(page), ...overrides };
      Object.entries(vals).forEach(([k, v]) => { if (v && v !== "1") p.set(k, v); });
      const qs = p.toString();
      router.replace(qs ? `/gear?${qs}` : "/gear", { scroll: false });
    },
    [search, categoryId, availability, minPrice, maxPrice, page, router]
  );

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (categoryId) params.categoryId = categoryId;
  if (availability) params.availability = availability;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (page > 1) params.page = String(page);

  const { data: gearsRes, isLoading } = useQuery({
    queryKey: ["gears", params],
    queryFn: () => gearService.getAll(params),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const gears = gearsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setAvailability("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    router.replace("/gear", { scroll: false });
  };

  const hasFilters = search || categoryId || availability || minPrice || maxPrice;

  const goToPage = (p: number) => {
    setPage(p);
    syncUrl({ page: String(p) });
  };

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Gears</h1>
          <p className="text-muted-foreground mt-1">
            Find the perfect equipment for your adventure
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gears..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              syncUrl({ search: e.target.value, page: "1" });
            }}
            className="pl-10"
          />
        </div>
        <Select value={categoryId || null} onValueChange={(v) => {
          setCategoryId(v ?? "");
          setPage(1);
          syncUrl({ categoryId: v ?? "", page: "1" });
        }}>
          <SelectTrigger className="w-[180px] hidden md:flex">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={availability || null} onValueChange={(v) => {
          setAvailability(v ?? "");
          setPage(1);
          syncUrl({ availability: v ?? "", page: "1" });
        }}>
          <SelectTrigger className="w-[140px] hidden md:flex">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Rented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showFilters && (
        <div className="md:hidden flex flex-wrap gap-3 mb-4 p-4 border rounded-lg">
          <Select value={categoryId || null} onValueChange={(v) => {
            setCategoryId(v ?? "");
            setPage(1);
            syncUrl({ categoryId: v ?? "", page: "1" });
          }}>
            <SelectTrigger className="flex-1 min-w-[140px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availability || null} onValueChange={(v) => {
            setAvailability(v ?? "");
            setPage(1);
            syncUrl({ availability: v ?? "", page: "1" });
          }}>
            <SelectTrigger className="flex-1 min-w-[120px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Rented</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
              syncUrl({ minPrice: e.target.value, page: "1" });
            }}
            className="flex-1 min-w-[100px]"
          />
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
              syncUrl({ maxPrice: e.target.value, page: "1" });
            }}
            className="flex-1 min-w-[100px]"
          />
        </div>
      )}

      <div className="hidden md:flex gap-4 mb-6">
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(1);
            syncUrl({ minPrice: e.target.value, page: "1" });
          }}
          className="w-[130px]"
        />
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
            syncUrl({ maxPrice: e.target.value, page: "1" });
          }}
          className="w-[130px]"
        />
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

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
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No gears found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your search or filters
          </p>
          {hasFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
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
                    <Badge variant={gear.isAvailable ? "default" : "secondary"}>
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
                    <Badge variant="outline">{gear.category.name}</Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {gearsRes?.meta && gearsRes.meta.totalPage > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: gearsRes.meta.totalPage }).map((_, i) => (
            <Button
              key={i}
              variant={gearsRes.meta.page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= gearsRes.meta.totalPage}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
}
