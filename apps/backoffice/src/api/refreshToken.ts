import axios from "axios";

export const refreshTokenApi = () =>
  axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
