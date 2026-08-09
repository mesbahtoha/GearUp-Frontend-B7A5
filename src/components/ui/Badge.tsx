import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

const variants: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Available: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "In Stock": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Out of Stock": "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400",
  Unavailable: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400",
  CUSTOMER: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  PROVIDER: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  ADMIN: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  PLACED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  PICKED_UP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  RETURNED: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[status] || "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-300", className)}>
      {status}
    </span>
  );
}
