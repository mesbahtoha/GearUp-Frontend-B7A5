"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GearsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/gear" + window.location.search);
  }, [router]);
  return null;
}
