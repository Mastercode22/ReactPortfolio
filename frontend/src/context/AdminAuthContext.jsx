import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a token, we could optionally fetch user details here
    if (token) {
      setAdminUser({ name: 'Administrator' });
    }
  }, [token]);

  const login = (newToken, user) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setAdminUser(user || { name: 'Administrator' });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdminUser(null);
    try {
      navigate('/admin/login');
    } catch (e) {
      window.location.href = '/admin/login';
    }
  };

  const isAuthenticated = !!token;

  return (
    <AdminAuthContext.Provider value={{ token, adminUser, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
