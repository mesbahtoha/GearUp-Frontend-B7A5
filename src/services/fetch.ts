const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit;

export const fetchData = async (
  endpoint: string,
  options?: FetchOptions
) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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