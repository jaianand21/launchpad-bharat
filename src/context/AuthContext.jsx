import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'lb_visitor';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const saveVisitor = (visitorData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
    setUser(visitorData);
  };

  const clearVisitor = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // Keep these stubs so existing pages that use useAuth() don't crash
  const logout = () => {
    clearVisitor();
    window.location.reload();
  };

  // Derive display name safely
  const userName = user?.name || 'Founder';

  return (
    <AuthContext.Provider value={{ user, userName, saveVisitor, clearVisitor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
