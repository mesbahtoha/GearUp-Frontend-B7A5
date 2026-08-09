"use client";

import Link from "next/link";
import { Dumbbell, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Github } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Footer() {
  const { user } = useAuthStore();
  const dashboardLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "PROVIDER"
        ? "/dashboard/provider"
        : "/dashboard/customer";

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Gear", href: "/gear" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const accountLinks = [
    { label: "Login", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
    { label: "Dashboard", href: user ? dashboardLink : "/auth/login" },
    { label: "Profile", href: "/dashboard/profile" },
  ];

  const supportLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Help & Support", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  const socials = [
    { label: "Facebook", href: "https://facebook.com", icon: Facebook },
    { label: "Twitter", href: "https://twitter.com", icon: Twitter },
    { label: "Instagram", href: "https://instagram.com", icon: Instagram },
    { label: "YouTube", href: "https://youtube.com", icon: Youtube },
    { label: "GitHub", href: "https://github.com/mesbahtoha", icon: Github },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-slate-900 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
              <Dumbbell className="w-7 h-7" />
              GearUp
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Rent sports & outdoor gear instantly. From camping tents to tennis rackets — get the
              gear you need, when you need it.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-slate-700 dark:hover:text-primary-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h3>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Support</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              support@gearup.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              +1 (555) 123-4567
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Dhaka, Bangladesh
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
