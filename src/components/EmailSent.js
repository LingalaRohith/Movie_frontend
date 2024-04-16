import React, { useState } from 'react';
import Header from './Header';
import './RegistrationConfirmation';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailSent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); 
    const email = localStorage.getItem('email');// Retrieve email from location state

    const handleClose = async () => {
        setIsLoggedIn(false);
        const response = await axios.post('http://localhost:8080/forgetPasswordMail',{
                email: email
            });
            console.log(response)
        navigate('/');
    };

    return (
        <>
            <div className="dark-background">
                <div className="confirmation-card">
                    <h1>Sent Instructions</h1>
                    <p>Read the instructions carefully</p>
                    {email && (
                        <p>
                            Instructions for resetting your password have been sent to your email at {email}. Please follow the instructions that were provided in the email.
                        </p>
                    )}
                    <button onClick={handleClose} className="close-button">
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

export default EmailSent;
