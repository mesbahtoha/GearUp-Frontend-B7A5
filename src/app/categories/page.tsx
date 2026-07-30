"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import type { IApiResponse, ICategory } from "@/types";
import Card from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tags, ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
  });

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/gear?categoryId=${cat.id}`}>
              <Card hover className="p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                    <Tags className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-sm text-gray-500 truncate">{cat.description}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
