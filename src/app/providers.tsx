"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMyProfile } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized } = useAuthStore();
  const [initialized, setLocalInitialized] = useState(false);

  useEffect(() => {
    const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // The middleware's auth decisions are driven by the accessToken COOKIE. If the
    // cookie is gone (logged out / expired) but a token lingers in localStorage,
    // restoring the user here would render logged-in UI (dashboard links) whose
    // prefetches get redirected by the middleware -> the router caches those
    // redirects and subsequent navigations fail silently. Only restore when the
    // cookie (the middleware's source of truth) says the session is alive.
    if (!cookieToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setInitialized(true);
      setLocalInitialized(true);
      return;
    }

    getMyProfile()
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      })
      .finally(() => {
        setInitialized(true);
        setLocalInitialized(true);
      });
  }, [setUser, setInitialized]);

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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
