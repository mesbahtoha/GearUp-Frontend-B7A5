"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMyProfile } from "@/lib/auth";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!cookieToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setInitialized(true);
      return;
    }
    const token = localStorage.getItem("accessToken") || cookieToken;
    getMyProfile()
      .then((res) => {
        if (res.success && res.data) setUser(res.data);
      })
      .catch(() => {})
      .finally(() => setInitialized(true));
  }, [setUser]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#1f2937", color: "#fff", fontSize: "14px" },
          }}
        />
      </AuthInitializer>
    </QueryClientProvider>
  );
}
