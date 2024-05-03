import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import Header from './Header';
import Hdr2 from './Header2';
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from './Store';
import { useContext } from 'react';
import { useAuth } from './AuthContext'; 

// isLoggedIn, setLoggedIn
function Login() {
  const { login, isLoggedIn } = useAuth(); 

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });

  useEffect(() => {
    if (isLoggedIn) { 
      console.log("already logged in, navigating to home.");
      navigate("/", { replace: true });
    } 
  }, [navigate, isLoggedIn]); 

  const [popupMessage, setPopupMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const res = await axios.post('http://localhost:8080/getAdmin', formData)
        if (res.status === 200){
            login(formData.email,res.data);
            navigate('/admin', { replace: true });
        }else if(res.status === 203){
            alert("Invalid Credientails")
        }else if(res.status === 204){
          const response = await axios.post('http://localhost:8080/getCustomer', formData);
          if (response.data['203']) {
              setPopupMessage('Incorrect password. Please try again!');
          } else if (response.data['204']) {
              setPopupMessage('User not found. Please sign up!');
          } else if (response.data['200']) {
              const userData = response.data['200'];
              login(formData.email, userData); // Use login from context
              if (userData.customer.userRole === 'Customer') {
                  navigate('/', { replace: true });
              } 
            //   else if (userData.customer.userRole === 'Admin') {
            //       navigate('/admin', { replace: true });
            //   }
          } 
        }else {
              setPopupMessage('An error occurred. Please try again later!');
          }
      } catch (error) {
          console.error('Error:', error);
          setPopupMessage('An error occurred during login.');
      }
  };

  return (
      <div>
          <div className="signup-container">
              <h3>Log in:</h3>
              <form onSubmit={handleSubmit} className="signup-form">
                  <div className="input-group">
                      <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                      <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                  </div>
                  <div>
                      <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}/>
                      <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <input type="submit" value="Submit" className="submit-button"/>
              </form>
              {popupMessage && (
                  <div className="popup">
                      <span className="popup-message">{popupMessage}</span>
                  </div>
              )}
              <p className="lin">Forgot password ? No worries! <Link to="/forgot-password">Forgot Password?</Link></p>
              <p className="lin"> Don't have an account? <Link to="/signup">Sign up here!</Link></p>
          </div>
      </div>
  );
}

export default Login;