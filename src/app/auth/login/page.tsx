"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { getMyProfile } from "@/lib/auth";
import { Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { BASE_URL } from "@/constants";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_login_failed") {
      toast.error("Google login failed. Please try again.");
    } else if (error) {
      toast.error("Google login failed: " + error);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const redirectByRole = (role?: string) => {
    if (role === "ADMIN") router.push("/dashboard/admin");
    else if (role === "PROVIDER") router.push("/dashboard/provider");
    else router.push("/dashboard/customer");
  };

  const doLogin = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res.success) {
      const profile = await getMyProfile();
      if (profile.success && profile.data) {
        setUser(profile.data);
      }
      toast.success("Logged in successfully!");
      redirectByRole(profile.data?.role);
      return true;
    }
    toast.error(res.message || "Login failed");
    return false;
  };

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await doLogin(data.email, data.password);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Dumbbell className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your GearUp account</p>
        </div>

       

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

         <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-slate-950 px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            showPasswordToggle
            {...register("password")}
          />
          <div className="flex justify-end -mt-2">
            <Link href="/auth/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
