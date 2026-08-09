"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/auth";
import {
  Dumbbell,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  ShoppingBag,
  Star,
  ChevronDown,
  Package,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { getGravatarUrl } from "@/lib/gravatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors";

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const dashboardLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer";

  const profileMenuItems = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/customer/reviews", label: "My Reviews", icon: Star },
  ];

  const loggedInLinks = [
    { href: "/gear", label: "Browse Gear", icon: Package },
    { href: dashboardLink, label: "Dashboard", icon: LayoutDashboard },
    { href: "/about", label: "About", icon: null },
  ];

  const loggedOutLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/gear", label: "Browse Gear", icon: null },
    { href: "/about", label: "About", icon: null },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
            <Dumbbell className="w-7 h-7" />
            GearUp
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated
              ? loggedInLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      navLinkClass,
                      pathname === link.href && "text-primary-600 dark:text-primary-400",
                    )}
                  >
                    {link.label}
                  </Link>
                ))
              : loggedOutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      navLinkClass,
                      pathname === link.href && "text-primary-600 dark:text-primary-400",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <Image
                    src={user?.image || getGravatarUrl(user?.email || "", 28)}
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full ring-2 ring-gray-200 dark:ring-slate-700 object-cover"
                    priority
                  />
                  <span className="hidden lg:inline truncate max-w-[120px]">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-2 animate-slide-in"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                          role="menuitem"
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          {item.label}
                        </Link>
                      );
                    })}
                    <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={logoutUser}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

          {/* Mobile bar */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {isAuthenticated && (
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <Image
                  src={user?.image || getGravatarUrl(user?.email || "", 28)}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full ring-2 ring-gray-200 dark:ring-slate-700 object-cover"
                  priority
                />
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          {isAuthenticated
            ? [...loggedInLinks, { href: "/dashboard/profile", label: "Profile", icon: null }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ),
              )
            : [...loggedOutLinks, { href: "/auth/login", label: "Login", icon: null }, { href: "/auth/register", label: "Register", icon: null }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm py-2 text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ),
              )}
          {isAuthenticated && (
            <button
              onClick={() => {
                logoutUser();
                setMobileOpen(false);
              }}
              className="block text-sm py-2 text-red-600 w-full text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
