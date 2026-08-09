"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IRentalOrder } from "@/types";
// import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminRentalsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-rentals", page, statusFilter],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/all", {
        page,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    refetchInterval: 10000,
  });

  const rentals = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Rentals</h1>
        <RefreshButton queryKeys={[["admin-rentals"]]} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "PLACED", "CONFIRMED", "PAID", "PICKED_UP", "RETURNED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Gear</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Period</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Payment</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{r.gear?.name || "N/A"}</td>
                  <td className="py-3 px-2 text-gray-500">{r.customer?.name || "N/A"}</td>
                  <td className="py-3 px-2 text-gray-500 text-xs">
                    {formatDate(r.startDate)} - {formatDate(r.endDate)}
                  </td>
                  <td className="py-3 px-2">{formatPrice(r.totalPrice)}</td>
                  <td className="py-3 px-2"><Badge status={r.status} /></td>
                  <td className="py-3 px-2">
                    {r.payment ? <Badge status={r.payment.status} /> : <span className="text-gray-400">N/A</span>}
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
