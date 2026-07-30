import { fetchData } from "../fetch";

export const logoutUser = async () => {
  return fetchData("/auth/logout", {
    method: "POST",
  });
};