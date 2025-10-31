import axios from "axios";

const apiBaseURL =
  process.env.NODE_ENV === "production"
    ? "https://hyrosbots.vercel.app/api"
    : "http://localhost:5174/api";

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});
