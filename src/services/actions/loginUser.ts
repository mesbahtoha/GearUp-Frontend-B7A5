import { fetcher } from "@/lib/fetch";
import type { ApiResponse } from "@/types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload
) => {
  return fetcher<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    "/auth/login",
    {
      method: "POST",
      body: payload,
    }
  );
};