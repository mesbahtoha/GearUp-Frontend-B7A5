import { BASE_URL } from "@/constants";

type FetchOptions = RequestInit;

export const fetchData = async (
  endpoint: string,
  options?: FetchOptions
) => {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};