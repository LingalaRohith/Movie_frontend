import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(sessionStorage.getItem('isLogin') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    let initialLoad = true;
    const handleLoginChange = () => {
      console.log("isLoggedIn:", isLoggedIn);
      sessionStorage.setItem('isLogin', isLoggedIn);
      if (!isLoggedIn && !initialLoad) {
        console.log("Navigating to /login...");
        navigate('/login');
      }
      initialLoad = false;
    };
    handleLoginChange();
  }, [isLoggedIn, navigate]);
  

  const login = (email, userData) => {
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('email', email);
    console.log(email);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setLoggedIn(true);
  };

 const logout = () => {
  sessionStorage.removeItem('isLogin');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('userData');
  setLoggedIn(false);
  navigate('/');
};


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
