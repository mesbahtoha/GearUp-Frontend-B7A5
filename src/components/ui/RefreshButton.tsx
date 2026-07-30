"use client";

import { useState } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  queryKeys: QueryKey[];
  className?: string;
}

export default function RefreshButton({ queryKeys, className = "" }: RefreshButtonProps) {
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all(
      queryKeys.map((key) => qc.invalidateQueries({ queryKey: key }))
    );
    setRefreshing(false);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={refreshing}
      className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Refresh data"
    >
      <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
    </button>
  );
}
