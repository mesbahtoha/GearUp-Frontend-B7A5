import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { updateInListCache } from "@/lib/queryCache";
import type { IApiResponse, IRentalOrder } from "@/types";

export function useMyRentals(page = 1, status?: string) {
  return useQuery({
    queryKey: ["my-rentals", page, status],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/my-rentals", {
        page,
        ...(status ? { status } : {}),
      }),
    refetchInterval: 10000,
  });
}

export function useProviderOrders(page = 1, status?: string) {
  return useQuery({
    queryKey: ["provider-orders", page, status],
    queryFn: () =>
      api.get<IApiResponse<IRentalOrder[]>>("/rentals/provider-orders", {
        page,
        ...(status ? { status } : {}),
      }),
    refetchInterval: 10000,
  });
}

export function useSingleRental(id: string) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => api.get<IApiResponse<IRentalOrder>>(`/rentals/${id}`),
    enabled: !!id,
  });
}

function updateRentalInCache(qc: QueryClient, id: string, updater: (r: IRentalOrder) => IRentalOrder) {
  updateInListCache<IRentalOrder>(qc, ["my-rentals"], id, updater);
  updateInListCache<IRentalOrder>(qc, ["provider-orders"], id, updater);
}

export function useConfirmOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IRentalOrder>>(`/rentals/${id}/confirm`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateRentalInCache(qc, id, () => res.data);
      }
      qc.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}

export function useMarkPickedUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IRentalOrder>>(`/rentals/${id}/pickup`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateRentalInCache(qc, id, () => res.data);
      }
      qc.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}

export function useMarkReturned() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IRentalOrder>>(`/rentals/${id}/return`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateRentalInCache(qc, id, () => res.data);
      }
      qc.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<IApiResponse<IRentalOrder>>(`/rentals/${id}/cancel`),
    onSuccess: (res, id) => {
      if (res.data) {
        updateRentalInCache(qc, id, () => res.data);
      }
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      qc.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}
