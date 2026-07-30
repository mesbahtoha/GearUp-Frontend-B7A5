import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { removeFromListCache, updateInListCache } from "@/lib/queryCache";
import type { IApiResponse, IGearItem, IGearFilters } from "@/types";

export function useGears(filters: IGearFilters) {
  return useQuery({
    queryKey: ["gears", filters],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears", filters as Record<string, string | number | undefined>),
  });
}

export function useGear(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => api.get<IApiResponse<IGearItem>>(`/gears/${id}`),
    enabled: !!id,
  });
}

export function useMyGears() {
  return useQuery({
    queryKey: ["my-gears"],
    queryFn: () => api.get<IApiResponse<IGearItem[]>>("/gears/my-gears"),
  });
}

export function useCreateGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<IApiResponse<IGearItem>>("/gears", data),
    onSuccess: (res) => {
      if (res.data) {
        qc.setQueryData<IApiResponse<IGearItem[]>>(["my-gears"], (old) => {
          if (!old?.data) return old;
          return { ...old, data: [res.data, ...old.data] };
        });
      }
      qc.invalidateQueries({ queryKey: ["my-gears"] });
      qc.invalidateQueries({ queryKey: ["gears"] });
    },
  });
}

export function useUpdateGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.patch<IApiResponse<IGearItem>>(`/gears/${id}`, data),
    onSuccess: (res, vars) => {
      if (res.data) {
        qc.setQueryData<IApiResponse<IGearItem>>(["gear", vars.id], res);
        updateInListCache<IGearItem>(qc, ["my-gears"], vars.id, () => res.data);
        updateInListCache<IGearItem>(qc, ["gears"], vars.id, () => res.data);
      }
      qc.invalidateQueries({ queryKey: ["my-gears"] });
      qc.invalidateQueries({ queryKey: ["gears"] });
    },
  });
}

export function useDeleteGear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<IApiResponse<null>>(`/gears/${id}`),
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: ["gear", id] });
      removeFromListCache<IGearItem>(qc, ["my-gears"], id);
      removeFromListCache<IGearItem>(qc, ["gears"], id);
      qc.invalidateQueries({ queryKey: ["my-gears"] });
      qc.invalidateQueries({ queryKey: ["gears"] });
    },
  });
}
