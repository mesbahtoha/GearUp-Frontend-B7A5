"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "@/lib/auth";
import { Dumbbell } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "PROVIDER"], { required_error: "Please select a role" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      if (res.success) {
        toast.success("Registered successfully! Please login.");
        router.push("/auth/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Dumbbell className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join GearUp today</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4"
        >
          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
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
            placeholder="At least 6 characters"
            error={errors.password?.message}
            showPasswordToggle
            {...register("password")}
          />
          <Input
            id="phone"
            label="Phone (optional)"
            type="tel"
            placeholder="+1234567890"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Select
            id="role"
            label="I want to..."
            placeholder="Select your role"
            options={[
              { value: "CUSTOMER", label: "Rent gear as a Customer" },
              { value: "PROVIDER", label: "List gear as a Provider" },
            ]}
            error={errors.role?.message}
            {...register("role")}
          />
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
