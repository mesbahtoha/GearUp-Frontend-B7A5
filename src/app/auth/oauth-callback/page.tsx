"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken, clearTokens } from "@/lib/api";
import { getMyProfile } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const role = params.get("role");

    if (!accessToken || !refreshToken || !role) {
      router.replace("/auth/login?error=google_login_failed");
      return;
    }

    // Drop any previous session (stale tokens, old user state) before applying
    // the freshly issued Google login tokens.
    clearTokens();
    setUser(null);
    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

    // Remove the token fragment from the URL without adding a new history entry,
    // so the auth flow never remains in browser history.
    window.history.replaceState(null, "", window.location.pathname);

    // Popup flow: the Google OAuth redirect chain ran in this popup. Hand the
    // tokens to the login page that opened it, then close — the popup's history
    // (Google account chooser, consent, backend URLs) is discarded with it.
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "GOOGLE_OAUTH_SUCCESS",
          accessToken,
          refreshToken,
          role,
        },
        window.location.origin
      );
      window.close();
      return;
    }

    // Fallback (popup blocked / direct visit): full-page flow.
    (async () => {
      try {
        const profile = await getMyProfile();
        if (profile.success && profile.data) {
          setUser(profile.data);
        }
      } catch {
        // continue to dashboard even if profile fetch fails
      }
    })();

    const dashboardPath =
      role === "ADMIN" ? "/dashboard/admin" : role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer";

    router.replace(dashboardPath);
  }, [router, setUser]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">Signing you in...</p>
    </div>
  );
}
