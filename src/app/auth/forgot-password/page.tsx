"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Dumbbell, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RedirectIfAuthenticated from "@/components/shared/RedirectIfAuthenticated";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>("/auth/forgot-password", {
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        router.push("/auth/login");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <RedirectIfAuthenticated />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Dumbbell className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your email, current password, and a new password</p>
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
            id="oldPassword"
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            error={errors.oldPassword?.message}
            showPasswordToggle
            {...register("oldPassword")}
          />
          <Input
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.newPassword?.message}
            showPasswordToggle
            {...register("newPassword")}
          />
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Repeat your new password"
            error={errors.confirmPassword?.message}
            showPasswordToggle
            {...register("confirmPassword")}
          />
          <Button type="submit" loading={loading} className="w-full">
            Reset Password
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
