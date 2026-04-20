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

  const saveVisitor = async (visitorData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
    setUser(visitorData);
    
    // Sync join to live feed
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/stats/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData)
      });
    } catch (err) {
      console.error('[Sync] Failed to record join:', err.message);
    }
  };

  const clearVisitor = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const logout = () => {
    clearVisitor();
    window.location.reload();
  };

  const onboardUser = async (onboardingData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...onboardingData,
          name: user?.name || 'Founder'
        })
      });
      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[Auth] Onboarding error:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Derive display name safely
  const userName = user?.name || 'Founder';

  return (
    <AuthContext.Provider value={{ user, userName, saveVisitor, clearVisitor, logout, onboardUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
