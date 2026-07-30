"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function GearError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      message={error.message || "Failed to load gears"}
      onRetry={reset}
    />
  );
}
