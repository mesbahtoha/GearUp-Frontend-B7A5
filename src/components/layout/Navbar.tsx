"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/auth";
import { Dumbbell, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { getGravatarUrl } from "@/lib/gravatar";

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardLink = user?.role === "ADMIN" ? "/dashboard/admin" : user?.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <Dumbbell className="w-7 h-7" />
            GearUp
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/gear" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Browse Gear
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <Image
                    src={user?.image || getGravatarUrl(user?.email || "", 28)}
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full ring-2 ring-gray-200 object-cover"
                    priority
                  />
                  {user?.name}
                </Link>
                <Button variant="ghost" size="sm" onClick={logoutUser}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <Image
                  src={user?.image || getGravatarUrl(user?.email || "", 28)}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full ring-2 ring-gray-200 object-cover"
                  priority
                />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{user?.name}</span>
              </Link>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link href="/gear" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
            Browse Gear
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/profile" className="flex items-center gap-2 py-2" onClick={() => setMobileOpen(false)}>
                <Image
                  src={user?.image || getGravatarUrl(user?.email || "", 24)}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full ring-2 ring-gray-200 object-cover"
                />
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>
              <Link href={dashboardLink} className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { logoutUser(); setMobileOpen(false); }}
                className="block text-sm py-2 text-red-600 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link href="/auth/register" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
