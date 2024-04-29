import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './Header'; 
import './RegistrationForm.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const RegistrationConfirmation = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        confetti({
            particleCount: 750,
            spread: 770,
            origin: { y: 0.6 }
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn) { 
          console.log("already logged in, navigating to home.");
          navigate("/", { replace: true });
        } 
      }, [navigate, isLoggedIn]); 

    const handleClose = () => {
        navigate('/login');
    };

    return (
        <>
            <div className="dark-background">
                <div className="confirmation-card">
                    <h1>Registration Successful</h1>
                    <p>Your registration has been successfully completed.</p>
                    <button onClick={handleClose} className="close-button">
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

export default RegistrationConfirmation;

