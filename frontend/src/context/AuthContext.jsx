import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        setUser(parsed);
        // fetch fresh data quietly in background
        try {
          const { data } = await authAPI.getProfile();
          const updated = { ...parsed, ...data };
          localStorage.setItem('userInfo', JSON.stringify(updated));
          setUser(updated);
        } catch (e) {
          console.error("Failed to refresh user profile", e);
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register(name, email, password);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getProfile();
      const current = JSON.parse(localStorage.getItem('userInfo')) || {};
      const updated = { ...current, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updated));
      setUser(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
