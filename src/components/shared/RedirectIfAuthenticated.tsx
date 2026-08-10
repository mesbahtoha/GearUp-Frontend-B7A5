"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function RedirectIfAuthenticated() {
  const router = useRouter();
  const { user, isAuthenticated, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized || !isAuthenticated || !user) return;
    const path =
      user.role === "ADMIN"
        ? "/dashboard/admin"
        : user.role === "PROVIDER"
          ? "/dashboard/provider"
          : "/dashboard/customer";
    router.replace(path);
  }, [user, isAuthenticated, initialized, router]);

  if (isAuthenticated) return <LoadingSpinner size="lg" />;

  return null;
}
