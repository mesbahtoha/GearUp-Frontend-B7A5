"use client";

import { ReactNode } from "react";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";

export default function AuthInitializer({
  children,
}: {
  children: ReactNode;
}) {
  useInitializeAuth();

  return <>{children}</>;
}