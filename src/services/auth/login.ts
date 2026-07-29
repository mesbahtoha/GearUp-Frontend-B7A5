import { fetchData } from "../fetch";

export const loginUser = async (
  payload: unknown
) => {
  return fetchData("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};