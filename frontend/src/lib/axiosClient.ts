import axios from "axios";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: backendURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL: Add interceptors if needed
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Axios Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);