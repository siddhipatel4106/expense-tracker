import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Check if token is expired
      const expiresAt = localStorage.getItem('expires_at');
      if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        if (expiryDate < now) {
          // Token expired, logout
          logout();
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, expiresAt) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_id', userData.id);
    localStorage.setItem('expires_at', expiresAt);
    
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    const currentToken = localStorage.getItem('token');
    
    // Call logout API
    if (currentToken) {
      try {
        await fetch("https://siddhiexpense.rf.gd/api/logout.php", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentToken}`
          }
        });
      } catch (error) {
        console.log('Logout API error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');
    
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};