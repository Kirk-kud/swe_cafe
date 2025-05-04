import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to process and enhance user data
  const processUserData = (userData) => {
    if (!userData) return null;
    
    console.log("Processing user data:", userData);
    
    // Make sure we have a proper user object with role information
    const enhancedUser = {
      ...userData,
      // Ensure we have role even if it comes as userType
      role: userData.role || userData.userType || userData.user_type,
      // Set admin flags if not already present
      isAdmin: userData.isAdmin || userData.user_type === 'admin' || userData.role === 'admin',
      // Check for restaurant admin status
      isRestaurantAdmin: userData.isRestaurantAdmin || 
                         (userData.restaurant_id && userData.restaurant_id > 0)
    };
    
    console.log("Enhanced user data:", enhancedUser);
    return enhancedUser;
  };

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
            const parsedUser = JSON.parse(userData);
            setUser(processUserData(parsedUser));
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

          console.log('Session validation response:', {
            status: response.status,
            ok: response.ok
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Session data received:', data);
            const processedUser = processUserData(data.user);
            setUser(processedUser);
            localStorage.setItem('user', JSON.stringify(processedUser));
          } else {
            // If session is invalid, clear the token and user data
            console.error('Session validation failed:', await response.text());
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Session check failed:', error);
          // Don't clear token on network errors to allow offline usage with cached token
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const processedUser = processUserData(data.user);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(processedUser));
        
        setUser(processedUser);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
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