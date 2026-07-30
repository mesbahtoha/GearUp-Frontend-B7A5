"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { updateInListCache, removeFromListCache } from "@/lib/queryCache";
import type { IApiResponse, ICategory } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RefreshButton from "@/components/ui/RefreshButton";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
    refetchInterval: 10000,
  });

  const categories = data?.data || [];

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (cat: ICategory) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setEditId(cat.id);
    setShowForm(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      api.post<IApiResponse<ICategory>>("/categories", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category created");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; description?: string } }) =>
      api.patch<IApiResponse<ICategory>>(`/categories/${id}`, payload),
    onSuccess: (res) => {
      if (res.data) {
        updateInListCache<ICategory>(qc, ["admin-categories"], res.data.id, () => res.data!);
      }
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category updated");
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: (_res, id) => {
      removeFromListCache<ICategory>(qc, ["admin-categories"], id);
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete category"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (editId) {
      updateMutation.mutate({ id: editId, payload: { name: name.trim(), description: description.trim() || undefined } });
    } else {
      createMutation.mutate({ name: name.trim(), description: description.trim() || undefined });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex gap-2">
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          )}
          <RefreshButton queryKeys={[["admin-categories"]]} />
        </div>
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                autoFocus
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={createMutation.isPending || updateMutation.isPending}>
                {editId ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                {editId ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : categories.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Created</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{cat.name}</td>
                  <td className="py-3 px-2 text-gray-500">{cat.description || "—"}</td>
                  <td className="py-3 px-2 text-gray-500">{formatDate(cat.createdAt)}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(cat)}>
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                        loading={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
