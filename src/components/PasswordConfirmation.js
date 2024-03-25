import React, { useState } from 'react';
import Header from './Header';
import './RegistrationForm.css';
import { useNavigate } from 'react-router-dom';

const PasswordConfirmation = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            {isLoggedIn ? (
                <Header loggedIn={isLoggedIn} />
            ) : (
                <Header />
            )}
            <div className="dark-background">
                <div className="confirmation-card">
                    <h1>Password Confirmed!</h1>
                    <p>Confirmation of password that user reset.</p>
                    <p>
                        Congratulations! We have confirmed that you reset your password. Please log in with the password that you reset with.
                    </p>
                    <button onClick={handleClose} className="close-button">
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

export default PasswordConfirmation;
