const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = RAW_API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

type FetchOptions = RequestInit;

export const fetchData = async (
  endpoint: string,
  options?: FetchOptions
) => {
  const response = await fetch(`${API_BASE}/api${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Something went wrong"
    );
  }

  return result;
};