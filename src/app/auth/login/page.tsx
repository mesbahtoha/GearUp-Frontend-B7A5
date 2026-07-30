"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await loginUser(data.email, data.password);
      if (res.success) {
        const profile = await getMyProfile();
        if (profile.success && profile.data) {
          setUser(profile.data);
        }
        toast.success("Logged in successfully!");
        const role = profile.data?.role;
        if (role === "ADMIN") router.push("/dashboard/admin");
        else if (role === "PROVIDER") router.push("/dashboard/provider");
        else router.push("/dashboard/customer");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Dumbbell className="w-12 h-12 mx-auto text-primary-600 mb-2" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your GearUp account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
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
            <Link href="/auth/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
