import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Hdr2 from './Header2';
import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from './Store';
import { useContext } from 'react';

// isLoggedIn, setLoggedIn
function Login(props) {

  // const {state,setState} = useContext(Context);


  const isLoggedIn = props.isLoggedIn;
  const userAuthentication = props.userAuthentication
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    const [popupMessage, setPopupMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (event) => {
      event.preventDefault();
      try{
        const response = await axios.post('http://localhost:8080/getCustomer',formData);
        console.log(response.data);
        if (response.data['203']) {
          // Incorrect password
          alert("Incorrect password. Please try again!");
          setPopupMessage('Incorrect password. Please try again!');
      } else if (response.data['204']) {
          // User not found
          setPopupMessage('User not found. Please sign up!');
      } else if (response.data['200']) {
          // Success
          setPopupMessage('Login successful!');
          props.setLoggedIn(true);
          console.log(props.isLoggedIn);
          localStorage.setItem('isLogin', true);
          if (response.data['200'].customer.userRole === 'Customer')
          {
            // userAuthentication;
            alert('loging Successful!');
            localStorage.setItem('email',formData.email);
            if(rememberMe){
              localStorage.setItem('User',response.data['200']);
            }else{
              localStorage.removeItem('User');
            }
            // const log = localStorage.getItem('isLogin');
            // const log1 = localStorage.getItem('isLogin');
            // console.log(log1);
            navigate('/',{ state : { email: formData.email, password: formData.password, name: response.data['200'].customer.firstName}  });
          } else if(response.data['200'].customer.userRole === 'Admin')
          {
            navigate('/admin',{ state : { email: formData.email, password: formData.password} });
          }
          
      } else {
          // Other errors
          setPopupMessage('An error occurred. Please try again later!');
      }
      }catch(error){
        console.error('Error:', error);
      }
    }

    return (
      <div>  
        <div className="signup-container">
            <h3>Log in:</h3>
            <form onSubmit={handleSubmit} className="signup-form">
            {/* <form  action="/login" method="post" className="signup-form"> */}
              <div className="input-group">
                <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
              </div>
              <div>
                <br></br>
                <div>
                  <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}/>
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
              </div>
                <input type="submit" value="Submit" className="submit-button" onClick={userAuthentication}/>
            </form>
            {popupMessage && (
                    <div className="popup">
                        <span className="popup-message">{popupMessage}</span>
                    </div>
                )}

            <p class="lin">Forgot password ? No worries! <Link to="/forgot-password">Forgot Password?</Link></p>
            <p class="lin"> Don't have an account? <a href="/signup">Sign up here!</a></p>
            
              
        </div>
      </div>
      
    );
  }
  
  export default Login;