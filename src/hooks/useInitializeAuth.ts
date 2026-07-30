"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useInitializeAuth() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      await refreshUser();
    };

    void initialize();
  }, [refreshUser]);
}