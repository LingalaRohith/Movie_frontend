import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import './VerifyAccount.css'; 
import axios from 'axios';

const VerifyAccount = () => {
  // { customerData }
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
   const mail = location.state?.email; 
   const pwd = location.state.pwd;
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [customerData, setCustomerData] = useState(location.state.customerData || {});
  const [popupMessage, setPopupMessage] = useState('');
  const [formData, setformData ] = useState({
    email: mail,
    password: pwd
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const response = await axios.post('http://localhost:8080/getCustomer',formData);
      console.log(response.data);
      if (response.data['203']) {
        // Incorrect password
        setPopupMessage('Incorrect password. Please try again!');
    } else if (response.data['204']) {
        // User not found
        setPopupMessage('User not found. Please sign up!');
    } else if (response.data['200']) {
        // Success
        setPopupMessage('Congrats');
        const customer = response.data['200'].customer;
        customer.verificationCode = verificationCode;
        const resp = await axios.post('http://localhost:8080/verifyCustomer',customer);
        if(resp.data['200'])
        {
          navigate('/registration-confirmation');
        }
        else if(resp.data['400']){
          console.log('incorrect OTP');
          setPopupMessage('incorrect otp');
        }
    } else {
        // Other errors
        setPopupMessage('An error occurred. Please try again later!');
    }
    }catch(error){
      console.error('Error:', error);
    }
    // Here, you would verify the code
    // For demonstration, let's assume verification is successful
    // // You can replace this with your actual verification logic
    console.log('Verification code:', verificationCode);
    // console.log('Customer data:', customerData);
    console.log('email', mail);
    console.log('pwd',pwd);
    navigate('/registration-confirmation');
  };

  return (
    <div>
      <div className="verification-container"> 
        <h2>Verify Your Account</h2> 
        <p>Please enter the verification code sent to {mail}</p>
        <form className="verification-form" onSubmit={handleSubmit}> 
          <input 
            type="text" 
            placeholder="Verification Code" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)}
            required 
          />
           {popupMessage && (
                    <div className="popup">
                        <span className="popup-message">{popupMessage}</span>
                    </div>
                )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
