"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { updateInListCache } from "@/lib/queryCache";
import type { IApiResponse, IUser, IUserFilters } from "@/types";
// import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { Search, Shield, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filters: IUserFilters = { page, limit: 10, search: search || undefined, role: roleFilter || undefined, status: statusFilter || undefined };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () =>
      api.get<IApiResponse<IUser[]>>("/admin/users", filters as Record<string, string | number | undefined>),
    refetchInterval: 10000,
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const suspendMutation = useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IUser>>(`/admin/users/${id}/suspend`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateInListCache<IUser>(qc, ["admin-users"], id, () => ({ ...res.data, status: "SUSPENDED" as const }));
      }
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User suspended");
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IUser>>(`/admin/users/${id}/activate`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateInListCache<IUser>(qc, ["admin-users"], id, () => ({ ...res.data, status: "ACTIVE" as const }));
      }
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User activated");
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.patch<IApiResponse<IUser>>(`/admin/users/${id}/role`, { role }),
    onSuccess: (res, vars) => {
      if (res.data) {
        updateInListCache<IUser>(qc, ["admin-users"], vars.id, () => ({ ...res.data, role: vars.role as IUser["role"] }));
      }
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <RefreshButton queryKeys={[["admin-users"]]} />
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="PROVIDER">Provider</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Joined</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{user.name}</td>
                  <td className="py-3 px-2 text-gray-500">{user.email}</td>
                  <td className="py-3 px-2">
                    <Badge status={user.role} />
                  </td>
                  <td className="py-3 px-2">
                    <Badge status={user.status} />
                  </td>
                  <td className="py-3 px-2 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      {user.status === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => suspendMutation.mutate(user.id)}
                          loading={suspendMutation.isPending}
                        >
                          <ShieldOff className="w-3 h-3 mr-1" /> Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => activateMutation.mutate(user.id)}
                          loading={activateMutation.isPending}
                        >
                          <Shield className="w-3 h-3 mr-1" /> Activate
                        </Button>
                      )}
                      <select
                        value={user.role}
                        onChange={(e) => {
                          if (window.confirm(`Change ${user.name}'s role to ${e.target.value}?`)) {
                            roleMutation.mutate({ id: user.id, role: e.target.value });
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="PROVIDER">Provider</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="flex items-center text-sm text-gray-600 px-3">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
