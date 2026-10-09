import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const authData = res.data.data;
      localStorage.setItem('token', authData.token);
      setToken(authData.token);
      
      // Fetch full profile info
      try {
        const meRes = await api.get('/auth/me');
        setUser(meRes.data.data);
      } catch {
        setUser({
          id: authData.id,
          name: authData.name,
          email: authData.email,
          rating: authData.rating,
          totalScore: authData.totalScore
        });
      }
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const authData = res.data.data;
      localStorage.setItem('token', authData.token);
      setToken(authData.token);

      try {
        const meRes = await api.get('/auth/me');
        setUser(meRes.data.data);
      } catch {
        setUser({
          id: authData.id,
          name: authData.name,
          email: authData.email,
          rating: authData.rating,
          totalScore: authData.totalScore
        });
      }
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (e) {
      console.error('Error refreshing user:', e);
    }
  };

  const deleteAccount = async () => {
    const res = await api.delete('/user/account');
    if (res.data.success) {
      logout();
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
