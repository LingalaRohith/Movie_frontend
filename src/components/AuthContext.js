import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(sessionStorage.getItem('isLogin') === 'true');
  const [isAdmin, setAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllAdmins');
        const adminEmailList = response.data.map(admin => admin.email);
        setAdminEmails(adminEmailList);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    fetchAdmins();
  }, []);

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
  

  const login = async (email, userData) => {
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('email', email);
    console.log(email);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setLoggedIn(true);
    const isAdminUser = adminEmails.includes(email);
    setAdmin(isAdminUser);
    console.log('admin'+ isAdminUser);
  };

 const logout = () => {
  sessionStorage.removeItem('isLogin');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('userData');
  setLoggedIn(false);
  setAdmin(false);
  navigate('/');
};


  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
