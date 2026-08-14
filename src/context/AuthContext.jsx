import { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token && savedUser && savedUser !== "undefined") {
      try {
        const parsed = JSON.parse(savedUser);
        // eslint-disable-next-line
        setUser(parsed);
        setIsAdmin(parsed?.role === "admin");
      } catch (error) {
        console.error("Gagal membaca data user dari local storage: ", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });

      const userData = response.data.user;
      const authToken = response.data.token;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAdmin(userData.role === "admin");
      return { success: true };
    } catch (err) {
      const errorMessage = err.data?.message || err.message;
      const validationErrors = err.data?.errors;
      return { success: false, errors: validationErrors || errorMessage };
    }
  };

  const register = async (formData) => {
    try {
      const response = await apiRequest("/register", {
        method: "POST",
        body: formData,
      });

      const userData = response.data.user;
      const authToken = response.data.token;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAdmin(userData.role === "admin");
      return { success: true };
    } catch (err) {
      const errorMessage = err.data?.message || err.message;
      const validationErrors = err.data?.errors;
      return { success: false, errors: validationErrors || errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return context;
}
