import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../config/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'lb_visitor';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Track if they've submitted the welcome modal
  const [hasVisited, setHasVisited] = useState(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('lb_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const apiUrl = getApiBaseUrl();
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers,
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setHasVisited(true);
        } else {
          if (token && res.status === 401) {
            localStorage.removeItem('lb_token');
          }
        }
      } catch (err) {
        console.error('[Auth] Session check failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const saveVisitor = async (visitorData, leadToken) => {
    // Only store an indicator, no PII
    localStorage.setItem(STORAGE_KEY, 'true');
    if (leadToken) {
      localStorage.setItem('lb_token', leadToken);
    }
    setHasVisited(true);
    
    // Sync join to live feed
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/stats/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData)
      });
      if (response.ok && leadToken) {
        // Fetch full user details now that we have auto-registered
        const meRes = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${leadToken}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        }
      }
    } catch (err) {
      console.error('[Sync] Failed to record join:', err.message);
    }
  };

  const clearVisitor = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('lb_token');
    setHasVisited(false);
    setUser(null);
  };

  const logout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearVisitor();
    window.location.reload();
  };

  const onboardUser = async (onboardingData) => {
    try {
      const token = localStorage.getItem('lb_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...onboardingData,
          name: user?.name || 'Founder'
        })
      });
      const data = await response.json();
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.user }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[Auth] Onboarding error:', err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (credentials) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) localStorage.setItem('lb_token', data.token);
        setUser(data.user);
        setHasVisited(true);
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[Auth] Login error:', err);
      return { success: false, error: 'Login failed.' };
    }
  };

  const signup = async (credentials) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) localStorage.setItem('lb_token', data.token);
        setUser(data.user);
        setHasVisited(true);
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[Auth] Signup error:', err);
      return { success: false, error: 'Signup failed.' };
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_token: credentialResponse.credential })
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) localStorage.setItem('lb_token', data.token);
        setUser(data.user);
        setHasVisited(true);
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[Auth] Google login error:', err);
      return { success: false, error: 'Google Login failed.' };
    }
  };

  // Derive display name safely
  const userName = user?.name || 'Founder';

  return (
    <AuthContext.Provider value={{ 
      user, 
      hasVisited,
      authLoading,
      userName, 
      saveVisitor, 
      clearVisitor, 
      logout, 
      onboardUser,
      login,
      signup,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
