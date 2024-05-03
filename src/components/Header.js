import React, { useState, useEffect, useContext } from 'react';
import logo from '../resources/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import './header.css';
import './Signup.js';
import axios from 'axios';

const Hdr = () => {
  const { isLoggedIn, logout } = useAuth(); 
  const [showMenu, setShowMenu] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const email = sessionStorage.getItem('email');
      fetchUserFirstName(email);
    }
  }, [isLoggedIn]);

  const fetchUserFirstName = async (email) => {
    try {
      const response = await axios.post('http://localhost:8080/getcustomerx', { email });
      if (response.status === 200) {
        const firstName = response.data["200"].customer.firstName; 
      setUserFirstName(firstName);
      } else {
        console.error('Error fetching user first name:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user first name:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className='header'>
      <Link to="/">
        <img src={logo} className="logo" alt="logo" />
      </Link>
      <h1>Cinema Hub</h1>
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <Link to="/">
              <button>Home</button>
            </Link>
            <div className="user-info" onClick={toggleMenu}>
              <div className="user-initial">{userFirstName && userFirstName.charAt(0).toUpperCase()}</div>
              <div className={showMenu ? "dropdown-menu show" : "dropdown-menu"}>
                <div className="dropdown-item-greeting">Hi {userFirstName}!</div>
                <Link to="/order-history" className="dropdown-item">Order History</Link>
                <Link to="/editprofile" className="dropdown-item">Edit Profile</Link>
                <Link to="/password-change" className="dropdown-item">Reset Password</Link>
                <div className="dropdown-item" onClick={handleLogout}>Sign out</div>
              </div>           
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
            <Link to="/">
              <button>Home</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Hdr;




