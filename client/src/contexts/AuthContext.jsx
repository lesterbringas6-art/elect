import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'https://elect-omega.vercel.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('electrum_token'));

  // Sync axios header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('electrum_user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          logout(); // Clear corrupted data
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const saveAuthData = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('electrum_token', token);
    localStorage.setItem('electrum_user', JSON.stringify(user));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;
      saveAuthData(token, user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };
const register = async (name, email, password, adminCode) => {
  try {
    await axios.post(`${API_URL}/api/auth/register`, {
      name, email, password, adminCode: adminCode || undefined
    });
    // We DO NOT call saveAuthData here.
    return { success: true }; 
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('electrum_token');
    localStorage.removeItem('electrum_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAdmin: user?.role === 'admin', 
      token,
      isAuthenticated: !!token 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};