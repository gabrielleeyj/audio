import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Check localStorage for token when the component mounts
  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem('jwtToken', jwtToken); // Save token in local storage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
