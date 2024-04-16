import React, { useState } from 'react';
import Header from './Header';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === '') {
            window.alert("Enter a valid email");
        } else {
            setIsLoggedIn(false);
            navigate('/email-sent', { state: { email } });
        }
    };

    return (
        <div>
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                <form className="forgot-password-form" onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input type="email" name="email" value={email} onChange={handleChange} />
                    </label>
                    <button type="submit">Send Email</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;