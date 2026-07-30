"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { updateMyProfile, changePassword } from "@/lib/auth";
import { api } from "@/lib/api";
import { getGravatarUrl } from "@/lib/gravatar";
import type { IApiResponse, IUser } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Camera, Save, Lock, Upload, X } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const profileMutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string }) => updateMyProfile(data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data);
        qc.invalidateQueries({ queryKey: ["my-profile"] });
        toast.success("Profile updated");
      }
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update profile"),
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to change password"),
  });

  const imageMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return api.postFormData<IApiResponse<IUser>>("/users/upload-image", formData);
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data);
        qc.invalidateQueries({ queryKey: ["my-profile"] });
        setSelectedFile(null);
        setPreview(null);
        toast.success("Profile photo updated");
      }
    },
    onError: (err: Error) => toast.error(err.message || "Failed to upload photo"),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (selectedFile) {
      imageMutation.mutate(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    profileMutation.mutate({ name: name.trim(), phone: phone.trim() || undefined });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Both old and new password are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    passwordMutation.mutate({ oldPassword, newPassword });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 group">
            {preview ? (
              <Image src={preview} alt="Preview" width={80} height={80} className="object-cover w-full h-full" />
            ) : user?.image ? (
              <Image src={user.image} alt={user.name} width={80} height={80} className="object-cover w-full h-full" />
            ) : user?.email ? (
              <Image
                src={getGravatarUrl(user.email, 80)}
                alt={user.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFile && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 flex-1 truncate">{selectedFile.name}</span>
            <Button size="sm" onClick={handleUpload} loading={imageMutation.isPending}>
              <Upload className="w-4 h-4 mr-1" /> Upload
            </Button>
            <button type="button" onClick={clearFile} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number (optional)"
          />
          <div className="pt-2">
            <Button type="submit" loading={profileMutation.isPending}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" /> Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            showPasswordToggle
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 chars)"
            showPasswordToggle
          />
          <div className="pt-2">
            <Button type="submit" loading={passwordMutation.isPending} variant="outline">
              <Lock className="w-4 h-4 mr-2" /> Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
