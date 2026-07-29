"use client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { AuthService } from "@/services/AuthService";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginSchema } from "@/schemas/login.schema";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

type LoginFormValues = z.infer<
  typeof loginSchema
>;



const LoginForm = () => {

    const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 const onSubmit = async (
  data: LoginFormValues
) => {
  try {
    const res =
      await AuthService.loginUser(data);

    if (!res.success) {
      toast.error(
        res.message ||
          "Login failed."
      );
      return;
    }

    toast.success(
      "Login successful!"
    );

    router.refresh();

    router.push("/dashboard");
  } catch (error) {
    console.error(error);

    toast.error(
      "Something went wrong."
    );
  }
};

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl">
          Welcome Back 👋
        </CardTitle>

        <CardDescription>
          Login to your GearUp account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={
                form.formState.isSubmitting
              }
            >
              {form.formState.isSubmitting
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;