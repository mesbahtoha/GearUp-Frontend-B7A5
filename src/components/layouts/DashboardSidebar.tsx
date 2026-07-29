"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  CreditCard,
  LogOut,
  Plus,
  User,
  Bike,
} from "lucide-react";

const customerLinks = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/rentals", label: "My Rentals", icon: ShoppingBag },
  { href: "/dashboard/customer/reviews", label: "My Reviews", icon: Star },
  { href: "/dashboard/customer/profile", label: "Profile", icon: User },
];

const providerLinks = [
  { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/provider/inventory", label: "My Inventory", icon: Package },
  { href: "/dashboard/provider/inventory/new", label: "Add Gear", icon: Plus },
  { href: "/dashboard/provider/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/provider/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/rentals", label: "Rentals", icon: ShoppingBag },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const links =
    user?.role === "CUSTOMER"
      ? customerLinks
      : user?.role === "PROVIDER"
      ? providerLinks
      : adminLinks;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="w-64 min-h-screen border-r bg-background flex flex-col">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg p-6 border-b"
      >
        <Bike className="h-5 w-5" />
        <span>GearUp</span>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
