const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers } = options;

  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers: isFormData
      ? (headers as HeadersInit)
      : {
          "Content-Type": "application/json",
          ...(headers as Record<string, string>),
        },
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong.");
  }

  return result;
}
