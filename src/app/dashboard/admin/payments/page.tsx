"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { IApiResponse, IPayment } from "@/types";
// import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", page, statusFilter],
    queryFn: () =>
      api.get<IApiResponse<IPayment[]>>("/admin/payments", {
        page,
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
    refetchInterval: 10000,
  });

  const payments = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Payments</h1>
        <RefreshButton queryKeys={[["admin-payments"]]} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "PENDING", "COMPLETED", "FAILED"].map((s) => (
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
                <th className="text-left py-3 px-2 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Provider</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Transaction ID</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Paid At</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{formatPrice(p.amount)}</td>
                  <td className="py-3 px-2 text-gray-500">{p.provider}</td>
                  <td className="py-3 px-2"><Badge status={p.status} /></td>
                  <td className="py-3 px-2 text-gray-500 text-xs">{p.transactionId || "N/A"}</td>
                  <td className="py-3 px-2 text-gray-500">{p.paidAt ? formatDate(p.paidAt) : "N/A"}</td>
                  <td className="py-3 px-2 text-gray-500">{formatDate(p.createdAt)}</td>
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
