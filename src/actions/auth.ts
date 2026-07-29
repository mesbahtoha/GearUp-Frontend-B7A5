"use server";

import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cookieStore = await cookies();

  return cookieStore.get("accessToken")?.value;
};

export const removeAccessToken = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
};