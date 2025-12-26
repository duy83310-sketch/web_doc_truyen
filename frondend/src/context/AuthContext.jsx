import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Load user khi F5 / reload web
  // ===============================
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // ⚠️ LUÔN dùng 1 endpoint DUY NHẤT
      const res = await axiosClient.get("/users/me");
      setUser(res);
    } catch (err) {
      console.error("Fetch user failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ===============================
  // Refresh profile (sau khi update avatar, info)
  // ===============================
  const refreshProfile = async () => {
    try {
      const res = await axiosClient.get("/users/me");
      setUser(res);
    } catch (err) {
      console.error("Refresh profile error:", err);
    }
  };

  // ===============================
  // Login
  // ===============================
  const login = async (usernameOrEmail, password) => {
    try {
      const res = await axiosClient.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      // backend trả token
      localStorage.setItem("token", res.token);

      // lấy lại user đầy đủ (có avatar_url)
      const me = await axiosClient.get("/users/me");
      setUser(me);

      toast.success(`Chào mừng ${me.username}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Đăng nhập thất bại");
      return false;
    }
  };

  // ===============================
  // Logout
  // ===============================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );x
};

export const useAuth = () => useContext(AuthContext);
