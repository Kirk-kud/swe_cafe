import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // If we have user data in localStorage, use it immediately
        // to avoid flickering of UI while waiting for API response
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error('Failed to parse user data from localStorage', e);
          }
        }

        try {
          const response = await fetch('/api/auth/session', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            // If session is invalid, clear the token and user data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Session check failed:', error);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes, since we don't have an actual backend
      // simulate a successful login with mock data
      if (email && password) {
        const mockUserData = {
          id: 'user123',
          email: email,
          name: email.split('@')[0],
          role: 'student'
        };
        
        // Store token and user data in localStorage
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUserData));
        
        // Set user state
        setUser(mockUserData);
        return { success: true };
      }
      
      // If using a real backend, uncomment this code
      /*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
      */
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 