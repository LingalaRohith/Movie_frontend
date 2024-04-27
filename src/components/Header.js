import React, { useState, useEffect } from 'react';
import logo from '../resources/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import './Signup.js';
import axios from 'axios';

// { isLoggedIn, setLoggedIn }
const Hdr = (props) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [firstName, setFirstName] = useState('');
  const [formData, setFormData] = useState({
    email: props.mail,
    password: props.pwd,
  });
  

  useEffect( () => {
    try{
    const response = axios.post('http://localhost:8080/getCustomerX',{"email" : localStorage.getItem('email')});
    const userData = response.data['200'].customer;//JSON.parse(localStorage.getItem('userData'));
    console.log(userData);
    if (userData) {
      setUserInitial(userData.firstName.charAt(0).toUpperCase());
      setFirstName(userData.firstName);
    }
  }catch{
      console.log("error");
  }
}, []);

  const handleLogout = () => {
    props.setLoggedIn(false);
    localStorage.setItem('isLogin',false);
    // localStorage.removeItem('email');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // const handleProfile = async () => {
  //   navigate('/editprofile', { state : { email : formData.email, pwd : formData.password}});
     
  // };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const login = localStorage.getItem('isLogin');

  return (
    <div className='header'>
    <Link to="/">
      <img src={logo} className="logo" alt="logo" />
    </Link>
    <h1>Cinema Hub</h1>
    <div className="buttons">
        {props.isLoggedIn ? (
          <>
            <Link to="/">
                <button>Home</button>
            </Link>
            <Link to="/">
              <button>Book Movies</button>
            </Link>
            
            {/* User Initial and Dropdown */}
            <div className='user-info' onClick={toggleDropdown}>
            <div className='user-initial'>{userInitial}</div>
              <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <div className='dropdown-item-greeting'>Hi {firstName}!</div>
                <Link to="/editprofile">
                  <div className='dropdown-item'>Edit Profile</div>
                </Link>
                <div className='dropdown-item' onClick={handleLogout}>Sign out</div>
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

