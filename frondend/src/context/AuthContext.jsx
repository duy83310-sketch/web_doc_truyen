import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await axiosClient.get('/auth/me');
          setUser(data);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (userOrEmail, password) => {
    try {
      const res = await axiosClient.post('/auth/login', { usernameOrEmail: userOrEmail, password });
      localStorage.setItem('token', res.token);
      setUser(res.user);
      toast.success(`Chào mừng ${res.user.username}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập thất bại');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);