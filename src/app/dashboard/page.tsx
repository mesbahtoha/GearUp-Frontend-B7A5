"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { user, isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated || !user) {
      router.push("/auth/login");
      return;
    }
    switch (user.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "PROVIDER":
        router.push("/dashboard/provider");
        break;
      case "CUSTOMER":
        router.push("/dashboard/customer");
        break;
      default:
        router.push("/auth/login");
    }
  }, [user, isAuthenticated, initialized, router]);

  return <LoadingSpinner size="lg" />;
}
