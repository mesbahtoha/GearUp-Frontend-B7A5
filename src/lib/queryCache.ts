import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { IApiResponse } from "@/types";

export function removeFromListCache<T extends { id: string }>(
  qc: QueryClient,
  queryKey: QueryKey,
  id: string,
) {
  qc.setQueriesData<IApiResponse<T[]>>(
    { queryKey },
    (old) => {
      if (!old?.data) return old;
      return { ...old, data: old.data.filter((item) => item.id !== id) };
    },
  );
}

export function updateInListCache<T extends { id: string }>(
  qc: QueryClient,
  queryKey: QueryKey,
  id: string,
  updater: (item: T) => T,
) {
  qc.setQueriesData<IApiResponse<T[]>>(
    { queryKey },
    (old) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((item) => (item.id === id ? updater(item) : item)),
      };
    },
  );
}
