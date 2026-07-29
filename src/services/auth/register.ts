import { fetchData } from "../fetch";

export const registerUser = async (
  payload: unknown
) => {
  return fetchData(
    "/users/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};