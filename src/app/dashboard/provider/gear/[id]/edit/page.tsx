"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useUpdateGear } from "@/hooks/useGear";
import type { IApiResponse, IGearItem, ICategory } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const gearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  pricePerDay: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

type GearForm = z.infer<typeof gearSchema>;

export default function EditGearPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const updateMutation = useUpdateGear();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: gearRes, isLoading: gearLoading } = useQuery({
    queryKey: ["gear", id],
    queryFn: () => api.get<IApiResponse<IGearItem>>(`/gears/${id}`),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<IApiResponse<ICategory[]>>("/categories"),
  });

  const gear = gearRes?.data;
  const categories = categoriesRes?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GearForm>({
    resolver: zodResolver(gearSchema),
    values: gear
      ? {
          name: gear.name,
          description: gear.description,
          brand: gear.brand,
          pricePerDay: gear.pricePerDay,
          stock: gear.stock,
          categoryId: gear.categoryId,
          image: gear.image || "",
          isAvailable: gear.isAvailable,
        }
      : undefined,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await api.postFormData<{ success: boolean; data?: { image?: string } }>("/upload/image", formData);
      return res.data?.image || null;
    } catch {
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: GearForm) => {
    try {
      const uploadedUrl = await uploadImage();
      const payload = { ...data, image: uploadedUrl || data.image || undefined };
      const res = await updateMutation.mutateAsync({ id, data: payload as unknown as Record<string, unknown> });
      if (res.success) {
        toast.success("Gear updated successfully!");
        router.push("/dashboard/provider/gear");
      } else {
        toast.error(res.message || "Failed to update gear");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (gearLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!gear) {
    return <div className="text-center py-12"><p className="text-gray-500">Gear not found</p></div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Gear</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="name" label="Gear Name" error={errors.name?.message} {...register("name")} />
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description")}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="brand" label="Brand" error={errors.brand?.message} {...register("brand")} />
            <Select
              id="categoryId"
              label="Category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="pricePerDay"
              label="Price Per Day ($)"
              type="number"
              step="0.01"
              error={errors.pricePerDay?.message}
              {...register("pricePerDay")}
            />
            <Input id="stock" label="Stock" type="number" error={errors.stock?.message} {...register("stock")} />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : gear?.image ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                <Image src={gear.image} alt="Current" fill className="object-cover" />
                <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-0.5">Current</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            )}
            <p className="mt-1 text-xs text-gray-400">Upload a new image to replace (max 2MB)</p>
          </div>

          <Button type="submit" loading={updateMutation.isPending || uploadingImage} className="w-full">
            Update Gear
          </Button>
        </form>
      </Card>
    </div>
  );
}
