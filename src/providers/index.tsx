"use client";

import { ReactNode } from "react";

import QueryProvider from "./QueryProvider";

import { Toaster } from "@/components/ui/sonner";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryProvider>
      {children}

      <Toaster
        position="top-right"
        richColors
      />
    </QueryProvider>
  );
}