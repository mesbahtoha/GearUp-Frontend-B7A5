import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

const variants: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  SUSPENDED: "bg-red-100 text-red-800",
  Available: "bg-green-100 text-green-800",
  Unavailable: "bg-gray-100 text-gray-600",
  CUSTOMER: "bg-blue-100 text-blue-800",
  PROVIDER: "bg-purple-100 text-purple-800",
  ADMIN: "bg-orange-100 text-orange-800",
  PLACED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  PICKED_UP: "bg-indigo-100 text-indigo-800",
  RETURNED: "bg-teal-100 text-teal-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[status] || "bg-gray-100 text-gray-800", className)}>
      {status}
    </span>
  );
}
