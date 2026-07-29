"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gearService } from "@/services/gear.service";
import { categoryService } from "@/services/category.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearSchema, GearFormValues } from "@/schemas/gear.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditGearPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: gearRes, isLoading: gearLoading } = useQuery({
    queryKey: ["gear", params.id],
    queryFn: () => gearService.getById(params.id as string),
    enabled: !!params.id,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesRes?.data || [];
  const gear = gearRes?.data;

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerDay: 0,
      location: "",
      categoryId: "",
      images: "",
      availability: true,
    },
  });

  useEffect(() => {
    if (gear) {
      form.reset({
        name: gear.name,
        description: gear.description,
        pricePerDay: gear.pricePerDay,
        location: gear.location,
        categoryId: gear.categoryId,
        images: gear.images?.join("\n") || "",
        availability: gear.availability,
      });
    }
  }, [gear, form]);

  const updateMutation = useMutation({
    mutationFn: (values: GearFormValues) =>
      gearService.update(params.id as string, {
        ...values,
        images: values.images.split("\n").filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-gears"] });
      toast.success("Gear updated successfully");
      router.push("/dashboard/provider/inventory");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update gear");
    },
  });

  const onSubmit = (values: GearFormValues) => {
    updateMutation.mutate(values);
  };

  if (gearLoading) return <LoadingSpinner size="lg" />;

  if (!gear) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Gear not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Edit Gear</h1>
        <p className="text-muted-foreground mt-1">
          Update your gear listing
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Day (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs (one per line)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Available for Rent</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    router.push("/dashboard/provider/inventory")
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Update Gear"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
