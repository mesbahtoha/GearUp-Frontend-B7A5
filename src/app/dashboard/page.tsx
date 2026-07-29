"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
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
        router.push("/login");
    }
  }, [user, loading, router]);

  return <LoadingSpinner size="lg" />;
}
