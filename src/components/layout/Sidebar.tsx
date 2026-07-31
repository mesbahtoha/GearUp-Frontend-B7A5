"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Users,
  DollarSign,
  Grid3X3,
  Tags,
  User,
  LogOut,
  PlusCircle,
  List,
  Compass,
} from "lucide-react";
import { logoutUser } from "@/lib/auth";
import Button from "@/components/ui/Button";

const browseLink = { href: "/gear", label: "Browse Gear", icon: Compass };
const profileLink = { href: "/dashboard/profile", label: "Profile", icon: User };

const customerLinks = [
  browseLink,
  profileLink,
  { href: "/dashboard/customer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/dashboard/customer/reviews", label: "My Reviews", icon: Star },
];

const providerLinks = [
  browseLink,
  profileLink,
  { href: "/dashboard/provider", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/provider/gear", label: "My Gear", icon: Package },
  { href: "/dashboard/provider/gear/new", label: "Add Gear", icon: PlusCircle },
  { href: "/dashboard/provider/orders", label: "Orders", icon: List },
  { href: "/dashboard/provider/reviews", label: "Reviews", icon: Star },
];

const adminLinks = [
  browseLink,
  profileLink,
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/gears", label: "All Gear", icon: Grid3X3 },
  { href: "/dashboard/admin/rentals", label: "Rentals", icon: ShoppingBag },
  { href: "/dashboard/admin/payments", label: "Payments", icon: DollarSign },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/admin/reviews", label: "Reviews", icon: Star },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const links = user?.role === "ADMIN" ? adminLinks : user?.role === "PROVIDER" ? providerLinks : customerLinks;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-1 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          {user?.role} Menu
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { logoutUser(); onClose?.(); }}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
