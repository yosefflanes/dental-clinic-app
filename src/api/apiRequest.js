import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// GLOBAL SECURITY (Auto Logout 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config && error.config.url !== "/login") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

/**
 * @param {string} path   contoh: "/login"
 * @param {object} options {method, body}
 */

export async function apiRequest(path, { method = "GET", body } = {}) {
  try {
    const res = await apiClient.request({
      url: path,
      method,
      data: body,
    });
    return res.data;
  } catch (err) {
    const data = err.response?.data ?? null;
    const error = new Error(data?.message || "Terjadi kesalahan pada server");
    error.status = err.response?.status;
    error.data = data;
    throw error;
  }
}
